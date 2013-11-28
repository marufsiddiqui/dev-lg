var app = app || {};

$(function () {
    'use strict';

    var Workspace = Backbone.Router.extend({
        routes : {
            ''                      : 'home',
            'home'                  : 'home',
            'search/:keyword'       : 'search',
            'graph/:id'             : 'graph',
            'timeline/:id'          : 'timeline',
            'pegboard/:id'          : 'pegboard',
            'about'                 : 'about',
            'contact'               : 'contact',
            'contributor/:id/:task' : 'contributor',
            'showNote/:id' : 'showNote',
            'editNote/:id' : 'editNote',
            "acceptRejectNote/:user_id/:note_id/:status":"acceptRejectNote"

        },

      acceptRejectNote:function(user_id,note_id,status){
           if(!sessionStorage
               .hasOwnProperty("currentView")){
               this.home();
           }

          var url="";

          var status="Successfully ";
          status+=(status==0)?" Rejected ":" Accepted ";
          status+="the note";
          $("mm").html(status);
      },

      newRoute: function(screenLink){


            sessionStorage.setItem("currentView",screenLink);
          $("#mm").modal('hide');

            return true;
        },

        initialize : function () {
            var me = this;
            _.bindAll(me, "submitForm");

            app.User = new app.Models.User();

            me.masterView = new app.MasterView();
            
            //attach event handlers to app
            app.on('submitForm', me.submitForm);
            app.on('userLogOut', function () {
                if (me.masterView.contributorMainView ) {
                    me.masterView.contributorMainView.remove();
                    delete me.masterView.contributorMainView;
                }
                me.navigate('/#home', true);
            });
        },

        start : function () {
            Backbone.history.start({});
        },

        home : function () {

            this.newRoute("home");
            this.masterView.render('Home');
        },

        search : function (keyword) {

            if(this.newRoute("search/"+keyword)){
                var me = this;
                _.bindAll(me, "searchResultCollectionFetchSuccess");

                app.SearchResults.query = decodeURI(keyword);
                app.SearchResults.trigger('queryChanged');

                me.masterView.render('Search');
                me.masterView.searchResultView.$el
                    .html('')
                    .append("<div class='title'><h2>Loading...</h2></div>");
                app.SearchResults
                    .fetch()
                    .then(me.searchResultCollectionFetchSuccess);
            }
        },

        graph : function (id) {


            if(this.newRoute("graph/"+id)){
                sessionStorage.setItem("currentSearchView",id);
                var options = {id : id};
                this.setSession(options);
                this.masterView.render('Graph', options);
            }

        },
        
        pegboard : function (id) {
            if(this.newRoute("pegboard/"+id)){
                sessionStorage.setItem("currentSearchView",id);

                var options = {id : id};
                this.setSession(options);
                this.masterView.render('Pegboard', options);
            }

        },
        
        timeline : function (id) {
            if(this.newRoute("timeline/"+id)){
                sessionStorage.setItem("currentSearchView",id);
                var options = {id : id};
                this.setSession(options);
                this.masterView.render('Timeline', options);
            }
        },

        contributor : function (contributorId, task) {

            if(this.newRoute("contributor/"+contributorId+"/"+task)){
                var me = this, options;

                options = {
                    contributorId : contributorId,
                    task : task
                };

                if ( me.isValidContributorTask(task) ) {
                    if (!app.User.isLoggedIn() || app.User.get('userId') !== contributorId) {
                        me.goHome();
                        return;
                    }
                    me.masterView.render('Contributor', options);
                } else {
                    me.goHome();
                }
            }
        },

        searchResultCollectionFetchSuccess : function (response) {
            console.log("insearch");
            this.home();

            if(this.newRoute()){
                var me = this, col, i;
                app.trigger('searchFectchComplete');

                if(col = app.GraphBreadcrumbCollection) {
                    var modelsToRemove = col.filter(function (model) {
                        return col.indexOf(model) >= 0;
                    });
                    col.remove(modelsToRemove);
                }

                if (response.type === "specific") {
                    me.navigate('/graph/' + response.data[0]._id.$id, true);
                } else {
                    me.masterView.render('Search');
                }
            }
        },
        
        setSession : function (data) {
            for (var prop in data) {
                if (prop === 'id') {
                   // console.log("session id set ",sessionStorage.getItem('activeItemId'));
                    if (sessionStorage.getItem('activeItemId') !== data['id']) {
                    //if (localStorage.getItem('activeItemId') !== data['id']) {
                        sessionStorage.setItem('activeItemId', data['id']);
                        localStorage.setItem('activeItemId', data['id']);
                        app.trigger('activeItemChanged');
                    }
                }
            }
        },
        
        goHome : function () {
            this.navigate('/home', true);
        },

        /**
         * Globally handles search 
         * 
         * @param e event
         * @param view which veiw
         * 
         */
        submitForm : function (e, view) {
            var keyword = encodeURIComponent($.trim(view.$el.find("input[type=text]").val()));
            app.SearchResults.pageNum = 1;
            
            this.navigate('/search/' + keyword, true);            
        },

        about : function () {
            //sessionStorage.setItem("currentView","about");
            //this.masterView.render('About');

            window.open(app.WP_URL+"/about", '_blank');
        },
        
        contact : function () {
            //sessionStorage.setItem("currentView","contact");
            //this.masterView.render('Contact');

            window.open(app.WP_URL+"/contact", '_blank');
        },
        
        isValidContributorTask : function (task) {
            var contributorTasks = ['profile','contributions','feed', 'postnew','moderation'];
            return  $.inArray(task, contributorTasks) !== -1;
        },


        showNote:function(id){
            if(!sessionStorage.hasOwnProperty("currentView")){
                this.home();
            }
            if(!this.newRoute()){
                return;
            }

            var me=this;




            $.ajax({
                url: app.SERVER_URL + '/lge?id='+encodeURIComponent(id),
                success: function(response){
                    response = _.isObject(response) ? response : $.parseJSON(response);
                    var obj=response.lge;

                    var id=obj._id.$id;

                    var time=new Date();
                    time.setUTCMilliseconds(obj.timestamp);
                    time=time.toDateString();



                    time = app.Utils.getDate(obj.timestamp);

                    var contributor_id=null,
                        contributor_image="img/photo-default.png",
                        contributor_name="";

                    if(obj.source_org!=null){
                        if(obj.source_org._id!=null){
                            contributor_id=obj.source_org._id.$id;
                        }


                        if(obj.source_org.image_urls!=null
                            && obj.source_org.image_urls.length > 0){

                            if(obj.source_org.image_urls[0].original!=null){

                                contributor_image=obj.source_org.image_urls[0].original;
                            }

                        }

                        if(obj.source_org.name!=null){
                            contributor_name=obj.source_org.name;
                        }
                    }

                    var image_urls="";
                    if((image_urls = obj.image_urls.lenght > 0)){
                        image_urls=obj.image_urls[0].original;
                    }

                    var data={
                        "profilePic"        : image_urls, //todo change in css to make min height of image to 100px
                        "id"                :  obj._id.$id,
                        "title"             : (obj.title != "" ) ? obj.title : 'N/A',
                        "summary"           : (obj.summary != "" ) ? obj.summary : 'N/A',
                        "comments"          : (obj.comments !=null) ? obj.comments.length : 0,
                        "name"              : (obj.subject_name !=null) ? obj.subject_name : 'N/A',
                        "time"              : time,
                        "like"              : (obj.like_ids.length>0) ? obj.like_ids.length : 0,
                        "share"             : (obj.shares.length>0) ? obj.shares.length : 0,
                        "follower"          : (obj.follower_ids.length>0) ? obj.follower_ids.length : 0,
                        "web_url"           : (obj.web_urls.length>0) ? obj.web_urls[0] : 'N/A',
                        "hostname"          : (obj.web_urls.length>0) ? obj.web_urls[0] : 'N/A',
                        "follower_ids"      : (obj.follower_ids.length>0) ? obj.follower_ids : [],
                        "like_ids"          : (obj.like_ids.length>0) ? obj.like_ids : [],
                        "share_ids"         :   (obj.shares.length>0) ? obj.shares : [],
                        "comment_ids"       :   (obj.comments.length>0) ? obj.comments : [],
                        "contributor_id"    :   contributor_id,
                        "contributor_image" :   contributor_image,
                        "contributor_name"  :   contributor_name
                    };

                    var model=app.NoteDetailModel;
                    model.set(data);

                    me.masterView.onShowNoteModel(model);
                }
            });

        },

        editLoadingData:false,

        editNote:function(id){

            var me=this;
            if(me.editLoadingData==true){
                return;
            }
            me.editLoadingData=true;
            var loadingdata=true;
            loadingdata=false;

            if(!sessionStorage.hasOwnProperty("currentView")){
                this.home();
            }


            var me=this;

            $.ajax({
                url: app.SERVER_URL + '/lge?id='+encodeURIComponent(id),
                success: function(response){
                    me.editLoadingData=false;
                    response = _.isObject(response) ? response : $.parseJSON(response);
                    var obj=response.lge;



                  /*  if(obj.shares!=null && obj.shares.length<=0){
                        return;
                    }
*/
                    var i,tmp = false;

                   /* if(obj.contributor_id==localStorage.getItem("userId")){
                        tmp=true;
                    }

                    for(i=0;i<obj.shares.length && tmp!=true ; i++){
                        if(obj.shares[i]._id.$id==localStorage.getItem("userId")){
                            tmp=true;
                        }
                    }

                    if(tmp==false){
                        return;
                    }
                    */

                    var id=obj._id.$id;

                    var time=new Date();
                    time.setUTCMilliseconds(obj.timestamp);
                    time=time.toDateString();


                    time = app.Utils.getDate(obj.timestamp);


                    var contributor_id=null,
                        contributor_image="img/photo-default.png",
                        contributor_name="";

                    if(obj.source_org!=null){
                        if(obj.source_org._id!=null){
                            contributor_id=obj.source_org._id.$id;
                        }

                        //console.log("source image ",obj.source_org.image_urls[0].original);
                        if(obj.source_org.image_urls!=null
                            && obj.source_org.image_urls.length > 0){

                            if(obj.source_org.image_urls[0].original!=null){

                                contributor_image=obj.source_org.image_urls[0].original;
                            }

                        }

                        if(obj.source_org.name!=null){
                            contributor_name=obj.source_org.name;
                        }
                    }

                    var image_urls="";
                    if((image_urls = obj.image_urls.lenght > 0)){
                        image_urls=obj.image_urls[0].original;
                    }

                    var data={
                        "profilePic"        : image_urls,
                        "id"                :  obj._id.$id,
                        "title"             : (obj.title != "" ) ? obj.title : 'N/A',
                        "summary"           : (obj.summary != "" ) ? obj.summary : 'N/A',
                        "comments"          : (obj.comments !=null) ? obj.comments.length : 0,
                        "name"              : (obj.subject_name !=null) ? obj.subject_name : 'N/A',
                        "time"              : time,
                        "like"              : (obj.like_ids.length>0) ? obj.like_ids.length : 0,
                        "share"             : (obj.shares.length>0) ? obj.shares.length : 0,
                        "follower"          : (obj.follower_ids.length>0) ? obj.follower_ids.length : 0,
                        "web_url"           : (obj.web_urls.length>0) ? obj.web_urls[0] : 'N/A',
                        "hostname"          : (obj.web_urls.length>0) ? obj.web_urls[0] : 'N/A',
                        "follower_ids"      : (obj.follower_ids.length>0) ? obj.follower_ids : [],
                        "like_ids"          : (obj.like_ids.length>0) ? obj.like_ids : [],
                        "share_ids"         :   (obj.shares.length>0) ? obj.shares : [],
                        "comment_ids"       :   (obj.comments.length>0) ? obj.comments : [],
                        "contributor_id"    :   contributor_id,
                        "contributor_image" :   contributor_image,
                        "contributor_name"  :   contributor_name,
                        "people": (obj.primary_people_ids.length>0) ? obj.primary_people_ids : [],
                        "orgs":  (obj.primary_org_ids.length>0) ? obj.primary_org_ids : []
                    };

                    var model=app.NoteDetailModel;
                    model.set(data);

                    me.masterView.onEditNote(model);
                },

                failure : function(response){
                    me.editLoadingData=false;
                },
                error : function(response){
                    me.editLoadingData=false;
                }
            });

        }


    });

    app.LGRouter = new Workspace();

});
