var app = app || {};

$(function ($) {
    'use strict';

    app.MasterView = Backbone.View.extend({

        className : '',

        subViews : [],
        
        validActions : ['like', 'follow', 'share', 'comment'],

        events : {
            'click #contact'  : "contact",
            'click #about' : "about",
            'click a.actionIcon'  : "onClickActionIcon",
            'click .actionIcon a' : "onClickActionIcon",
            //'click .followUser a' : "onClickActionIcon",
            'click .action-btn .comments-btn' : "onClickCommentClicked",
            'click .profilePicThumb div' : "onTitleClick",/*
            'click #noteboardView' : "showNoteBoard"*/


            'click #timelineShare'  : "onTimelineShare",
            'click #timelineFollow' : "onTimelineFollow",
            'click #timelineLike' : "onTimelineLike",
            //'click #timelineComment' : "onClickCommentClicked"
            'click #timelineComment' : "timeLineComment"
        },

        onTimelineFollow:function(e){
            if(!localStorage.hasOwnProperty("userId")

                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");

                return;

            }

            var tag='<i class="ss-icon disabled" style="font-size:11px;padding-right:5px;">plus</i>Following';
            var target=e.currentTarget;

            if(!$(target).hasClass("disabled")){
                $(target).addClass("disabled");
                this.onClickFollow(e,"Follow");
                $(target).html(tag);
            }


        },

        onTimelineShare:function(e){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }

            var target=e.currentTarget;

            var mee=this;
            var id=$(target).parent('.entry').data('lge');
            console.log("in time share");
            if(!$(target).hasClass("disabled")){
                $(target).addClass("disabled");
//                  this.onClickShare(e,"Share");
//                  var share=$(target).find(".share_length");
//                  share.html(parseInt(share.html())+1);


                var me=this;

                $.ajax({
                    url: app.SERVER_URL + '/lge?id='+encodeURIComponent(id),
                    success: function(response){
                        console.log("in 1");
                        response = _.isObject(response) ? response : $.parseJSON(response);
                        var obj=response.lge;

                        var id=obj._id.$id;

                        var time=new Date();
                        time.setUTCMilliseconds(obj.timestamp);
                        time=time.toDateString();


                        console.log("in 2");

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

                        console.log("in 4");

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

                        var url="http://www.sharethis.com/share#sthash.Uf63qB6u.dpuf";
                        var params="";




                        var options = {
                                url  : app.SERVER_URL + '/lge/share',
                            data : {
                                id    : id,
                                token : app.User.get('userToken')
                            },
                            $el  : target,
                            actionType : "Share"
                        };

                        var new_url=model.get("web_url");
                        if(new_url=="N/A"){
                            new_url= "http://"+window.location.hostname+"/#showNote/"+model.get("id");
                        }

                        params=params+"?publisher="+encodeURIComponent("e4cf591c-0bbe-4c83-abb8-92dddcb17238");

                        params=params+"&url="+encodeURIComponent(new_url);

                        params=params+"&title="+encodeURIComponent(model.get("title"));
                        params=params+"&img="+encodeURIComponent(model.get("profilePic"));
                        params=params+"&summary="+encodeURIComponent(model.get("summary"));

                        url=url+params;
                        var timer,win;

                        console.log("in 5  ",url);

                        win = window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,width=600,height=400');

                        function is_closed() {
                            if (win && win.closed) {

                                mee.postAction(options);
                                clearInterval(timer);
                                win = null;

                                var share=$(target).find(".share_length");
                                console.log("share  ",share);
                                share.html(parseInt(share.html())+1);


                            }
                        }

                        timer = setInterval(is_closed, 1000);
                    }
                });
            }

        },

        onTimelineLike:function(e){
            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }

            console.log(e.currentTarget);
            var target=e.currentTarget;
            if(!$(target).hasClass("disabled")){
                $(target).addClass("disabled");

                var options = {
                    url        : app.SERVER_URL + '/lge/like',
                    data       : {
                        id    : function () {
                            return $(target).parent('.entry').data('lge');
                        },
                        token : app.User.get('userToken')
                    }
                };

                $.ajax({
                    type : 'post',
                    url  : options.url,
                    data : options.data
                })
                    .done(function (response, status, jqXHR) {
                        var like=$(target).find(".like_length");
                        like.html(parseInt(like.html())+1);
                    })
                    .fail(function (jqXHR, status, errorMsg) {
                        $(target).removeClass("disabled");
                    })


            }

        },

        timeLineComment:function(e){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                console.log("cc 1");
                return;

            }

            this.timeLineElement= e.currentTarget;
            this.onClickCommentClicked(e);

        },
        timeLineElement:null,

        updateTimeLine:function(){

            var me=this;
            if(me.timeLineElement==null){
                return;
            }


            var comment=$(me.timeLineElement).find(".comments_length");
            comment.html(parseInt(comment.html())+1);


        },


        onClickCommentClicked:function(e){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                console.log("cc 1");
                return;

            }

            //e.preventDefaults();
            var $curTarget = $(e.currentTarget), options, id, url, col, entityType;
            id = $curTarget.parents('.entry').data('lge');

            var $commentModal = this.commentModal;

            $commentModal.collection.currentLGEID = id;

            $commentModal.collection.currentLGEEl = $curTarget;
            $commentModal.$el.modal('show');
        },

        about:function(){
            app.LGRouter.about();
        },

        contact:function(){
            app.LGRouter.contact();
        },

        showNoteBoard:function(){

            if(sessionStorage
                .hasOwnProperty("currentSearchView")){
                app.LGRouter
                    .navigate("/#pegboard"+
                    sessionStorage.getItem("currentSearchView"));
            }
        },

        initialize : function () {
            _.bindAll(this, "onClickActionIcon", "postSuccess", "onShowLoginModal");
            app.on('followClick', this.onClickActionIcon);
            app.on('newCommentAdded', this.postSuccess);
            app.on('showLoginModal', this.onShowLoginModal);
            
            //add login modal
            this.createLoginModal();

            //this.createNoteModel();
            //this.createEditNoteModel();

            //add graph task modal
            //this.createGraphTaskModal();

            //add comment modal
            this.createCommentModal();
            
            //add navbar
            this.createNavbar();

            //add footer
            this.createFooter();

            //tooltips
            this.renderToolTips();

            app.performAction = false;
            app.performingAction = false;

            //counter for search
            //this.startCounter();

            this.startBackToTop();


            this.createPeopleList();

            jQuery("#backtotop").fadeOut(0);

        },

        createPeopleList:function(){
          this.peopleList=app.PeopleShowList;
        },

        render : function (view, options) {
            var me = this, $body = $('body');
            $body.prepend(this.$el);


            $.each(this.subViews, function (i, view) {
                if (me[view])
                    me[view].$el.hide();
            });

            view = (view === '' || typeof view === 'undefined') ? 'Home' : view;
            
            $body.removeClass();
            $body.addClass(view.toLowerCase());            

            //setting active view
            app.activeView = view;
            
            me['show' + view](options);
            $body.prepend(this.$el);



            return this;

        },

        renderToolTips : function () {
            $('body').tooltip({
                selector: '[rel=tooltip]'
            });
        },

        startCounter : function () {

            jQuery(function($) {
                $('#counter').countTo({
                    from: 250000,
                    to: 400000,
                    speed: 8000000,
                    refreshInterval: 1,
                    onComplete: function(value) {
                        console.debug("done");
                    }
                });
            });
        },

        startBackToTop : function () {

            jQuery(function($) {

                    var pxShow = 300;//height on which the button will show
            
                    var fadeInTime = 1000;//how slow/fast you want the button to show
            
                    var fadeOutTime = 1000;//how slow/fast you want the button to hide
            
                    var scrollSpeed = 1000;//how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

                    jQuery(window).scroll(function(){


                        if(jQuery(window).scrollTop() >= pxShow){
            
                            jQuery("#backtotop").fadeIn(fadeInTime);
            
                        }else{
            
                            jQuery("#backtotop").fadeOut(fadeOutTime);
            
                        }
            
                    });
            
                      
        
                jQuery('#backtotop').click(function(){
        
                    jQuery('html, body').animate({scrollTop:0}, scrollSpeed);
        
                    return false;
        
                });

            });
        },

        createNavbar : function () {
            var navbar = new app.NavBarView({
                model : app.User
            });
            this.$el.append(navbar.render().el);
        },

        showHome : function () {
            var me = this;
            if(me.homeView){
                me.homeView=null;
            }
            if (!me.homeView) {
                me.subViews.push('homeView');
                me.homeView = new app.HomeView();
                me.$el.find('#footer').before(me.homeView.render().el);
            }
            
            me.homeView.$el.show();
        },

        showSearch : function () {
            var me = this;

            if (me.graphView) {


                me.graphView.$el
                    .find(".fixed-cards-container")
                    .html(me.getLoadingIcon());
                me.graphView.$el.find("#chart").css("background-image","");


            }

            if (!me.searchResultView) {
                me.subViews.push('searchResultView');
                me.searchResultView = new app.SearchResultView({
                    collection : app.SearchResults
                });
                me.$el.find('#footer').before(me.searchResultView.render().el);
            }

            me.searchResultView.$el.show();
        },

        showGraph : function (options) {
            var me = this;
            
            me.showTabbar(options);
            
            //show general info
            me.showGeneralInfo();
            
            //reset tabbar active item
            me.tabbarView.onTabClick({
                target : me.tabbarView.$el.find('a').get(1) 
            });

            //me.graphView=null;
            
            if (!me.graphView) {
                me.subViews.push('graphView');
                me.graphView = new app.GraphView();
                me.$el.find('#footer').before(me.graphView.render().el);
            } else{


                me.graphView.$el
                    .find(".fixed-cards-container")
                    .html(me.getLoadingIcon());
                me.graphView.$el.find("#chart").css("background-image","");


            }
            me.graphView.generateGraph(options);
            me.graphView.$el.show();


            me.showTabbar(options)
            //show related people
            me.showRelatedPeople(options);
        },
        
        showPegboard : function (options) {
            var me = this;

            me.showTabbar(options);
            
            //show general info
            me.showGeneralInfo();

            //reset tabbar active item
            me.tabbarView.onTabClick({
                target : me.tabbarView.$el.find('a').get(2)
            });

            if (!me.pegboardView) {
                me.subViews.push('pegboardView');
                me.pegboardView = new app.PegboardView({
                    collection:app.PegboardItems
                });
                me.$el.find('#footer').before(me.pegboardView.render().el);
            }
            //me.pegboardView.collection.loaded = 0;
            me.pegboardView.$el.show();
            me.pegboardView.addAll();

            //show related people
            me.showRelatedPeople(options);
        },


        timeHit:0,

        
        showTimeline : function (options) {
            var me = this;
            
            //show tab bar
            me.showTabbar(options);
            console.log("time 1");
            //show general info
            me.showGeneralInfo();

            console.log("time 2");
            //reset tabbar active item
            me.tabbarView.onTabClick({
                target : me.tabbarView.$el.find('a').get(0)
            });

            console.log("time 3");
            if (!me.timelineView) {
                console.log("time 4");
                me.subViews.push('timelineView');
                me.timelineView = new app.TimelineView();
                me.$el.find('#footer').before(me.timelineView.render().el);
            }
            console.log("time 5");
            me.timelineView.$el.html("").show();
            console.log("time 6");
            //show related people
            me.showRelatedPeople(options);
            console.log("time 7 ",options);
            me.timelineView.createTimeline();

            console.log("time 8");
            me.timeHit++;
            if(me.timeHit<=1){
                console.log("time 9");
                me.timelineView.$el.html("").show();
                //show related people
                me.showRelatedPeople(options);
                me.timelineView.createTimeline();

            }
        },

        showTabbar : function (options) {
            var me = this;


            if(me.tabbarView){
                $("#tabbar").remove();

            }
            me.subViews.push('tabbarView');
            me.tabbarView = new app.TabbarView({model : options});
            me.$el.find('.navbar-search').after(me.tabbarView.render().el);

            /*if (!me.tabbarView) {
                me.subViews.push('tabbarView');
                me.tabbarView = new app.TabbarView({model : options});
                me.$el.find('.nav-search').after(me.tabbarView.render().el);
            }*/

            me.tabbarView.model=options;
            
            me.tabbarView.$el.show();
        },

        showGeneralInfo : function () {
            var me = this;

            if(me.generalInfoView
                && $("#generalinfo")
                && false
                ){
                ("#generalinfo").remove();
            }

                me.subViews.push('generalInfoView');
                me.generalInfoView = new app.GeneralInfoView({
                    model : new app.Models.HeroPeople() 
                });



            me.generalInfoView.model.fetch().then(function () {
                app.trigger('generalInfoLoaded');
                me.$el.find('#topNavbar').after(me.generalInfoView.render().el);
            });

            me.generalInfoView.$el.show();
        },

        createTimelineFollow : function () {
            var me = this;

            if (!me.timelineFollowView) {
                me.subViews.push('timelineFollowView');
                me.timelineFollowView = new app.Views.TimelineFollowActionBar({
                    model : me.generalInfoView.model 
                });
            }

            return me.timelineFollowView.render().$el.html();
        },

        showRelatedPeople : function (options) {
            var me = this;

            //sessionStorage.setItem('activeItemId', options.id);

            if (!me.relatedPeopleView) {
                me.subViews.push('relatedPeopleView');
                me.relatedPeopleView = new app.Views.RelatedPeople({
                    collection : app.SearchResults
                });
            }
            
            if ( app.activeView === 'Graph' || app.activeView === 'Timeline' ) {
                //me.$el.find('#footer').before(me.relatedPeopleView.render().el);
                me.relatedPeopleView.$el.show();
                me.relatedPeopleView.startPeopleSlider();
            }            
        },
        
        showAbout : function (options) {
            window.open(app.WP_URL+"/about", '_blank');
        },
        
        showContact : function (options) {

            window.open(app.WP_URL+"/contact", '_blank');
        },
        
        showContributor : function (options) {
            var me = this;
            
            if (!me.contributorMainView) {
                me.subViews.push('contributorMainView');
                me.contributorMainView = new app.Views.Contributor.Main();
                me.$el.find('#footer').before(me.contributorMainView.render().el);
            }
            me.contributorMainView.setup(options);
            me.contributorMainView.$el.show();
        },

        createFooter : function () {
            this.$el.append($("#footerTemplate").html());
        },

        createLoginModal : function () {
            this.loginModal = new app.Views.LoginModal();
        },

        createNoteModel : function () {
            //$('#popupNoteModel').remove();
            this.noteModel = new app.Views.NoteModel({
                model : app.NoteDetailModel
            });

            $('body').append(this.noteModel.render().el);

        },

        createEditNoteModel : function () {


        },

        createGraphTaskModal : function () {
            this.graphTaskModal = new app.Views.GraphTaskModal();
        },

        createCommentModal : function () {
            this.commentModal = new app.Views.CommentModal({
                collection : app.Collections.Comments,
                model : app.User
            });
            $('#commentsModal').remove();
            $('body').append(this.commentModal.render().el);
        },

        onClickActionIcon : function (e) {
            var me = this, action, params;
            //e.preventDefault();


            // now we get the action
            action = this.getAction($(e.currentTarget));

            if ( action && me.isValidAction(action) ) {

                //if user is not logged in then asked him to do so
                if (!app.User.isLoggedIn()) {
                    app.trigger('showLoginModal', "You need to be logged in to " + action);                    
                    app.performAction = true;
                    return;
                }

                if (app.performingAction) return;

                if ( !$(e.currentTarget).hasClass('disabled') ) {
                    app.performingAction = true;
                    action = _(action).capitalize();
                    me['onClick' + action].call(me, e, action);
                }                
            }
        },

        onTitleClick:function(e){
            var $curTarget = $(e.currentTarget);
            var id=$curTarget.parents('.entry').data('lge');

        },

        onClickFollow : function (e, action) {

            var $curTarget = $(e.currentTarget), options, id, url, col, entityType;

            if ($curTarget.data('type') === 'lg') {
                id = app.SearchResults.activeItemId();
                url = app.SERVER_URL + '/lg/follow';
                col = sessionStorage.getItem('activeItemType');
                //col = localStorage.getItem('activeItemType');
                entityType = 'lg'
            } else {
                id = $curTarget.parents('.entry').data('lge');
                url = app.SERVER_URL + '/lge/follow';
                col = null;
                entityType = 'lge'
            }

            options = {
                url        : url,
                data       : {
                    id    : id,
                    col   : col,
                    token : app.User.get('userToken')
                },
                $el        : $curTarget,
                actionType : action,
                entityType : entityType
            };


            this.postAction(options);
        },
        
        onClickLike : function (e, action) {
            var $curTarget = $(e.currentTarget), options;
            options = {
                url        : app.SERVER_URL + '/lge/like',
                data       : {
                    id    : function () {
                        return $curTarget.parents('.entry').data('lge');
                    },
                    token : app.User.get('userToken')
                },
                $el        : $curTarget,
                actionType : action
            };

            this.postAction(options);
        },
        
        onClickComment : function (e, action) {

            var $commentModal = this.commentModal;
            var $curTarget = $(e.currentTarget);

            //$commentModal.collection.currentLGEID = $curTarget.parents('.entry').data('lge');
            $commentModal.collection.currentLGEID = $curTarget.parents('.entry').data('lge');

            $commentModal.collection.currentLGEEl = $curTarget;
            $commentModal.$el.modal('show');
        },
        
        onClickShare : function (e, action) {
            var $curTarget = $(e.currentTarget), options;

            var id=$curTarget.parents('.entry').data('lge');

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }

            var url="http://www.sharethis.com/share#sthash.Uf63qB6u.dpuf";
            var params="";




            var me=this,options = {
                url  : app.SERVER_URL + '/lge/share',
                data : {
                    id    : id,
                    token : app.User.get('userToken')
                },
                $el  : $curTarget,
                actionType : "Share"
            };

            var new_url=model.get("web_url");
            if(new_url=="N/A"){
                new_url= "http://"+window.location.hostname+"/#showNote/"+model.get("id");
            }

            params=params+"?publisher="+encodeURIComponent("e4cf591c-0bbe-4c83-abb8-92dddcb17238");
     
            params=params+"&url="+encodeURIComponent(new_url);

            params=params+"&title="+encodeURIComponent(model.get("title"));
            params=params+"&img="+encodeURIComponent(model.get("profilePic"));
            params=params+"&summary="+encodeURIComponent(model.get("summary"));

            url=url+params;
            var timer,win;

            win = window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            function is_closed() {
                if (win && win.closed) {

                    me.postAction(options);
                    clearInterval(timer);
                    win = null;

                }
            }

            timer = setInterval(is_closed, 1000);

        },

        onClickEdit : function(e, action){

        },
        
        postAction : function (options) {
            var me = this;
            $.ajax({
                type : 'post',
                url  : options.url,
                data : options.data
            })
                    .done(function (response, status, jqXHR) {
                        me.postSuccess(response, status, jqXHR, options);
                    })
                    .fail(function (jqXHR, status, errorMsg) {
                        me.postFail(jqXHR, status, errorMsg, options)
                    })
                    .always(function () {
                        app.performingAction = false;
                    });
        },
        
        postSuccess : function (response, status, jqXHR, options) {
            var $curTarget = options.$el, me = this;

                if (response.error) {
                //alert('Error occured');

            } else {

                var c, modelId, model, action, actionIds, Ids, user;

                if (options.entityType === 'lg') {
                    if ($curTarget.parents('.slider-item').length) { //For timelines action handling                        
                        $curTarget.text('Following').toggleClass('disabled');
                    }
                    model = me.generalInfoView.model;
                } else {
                    if ($curTarget.parents('.slider-item').length) { //For timelines action handling
                        var $el = $curTarget.find('span.count'), text;
                        if ($el.length) {
                            text = parseInt($el.text());
                            $el.text(text + 2 - 1);
                        } 
                        if (options.actionType !== 'comment') {
                            $curTarget.toggleClass('disabled');
                        }
                    } else {
                        //find the collection
                        c = eval($curTarget.parents('.entry').data('collection'));

                        //find the model
                        modelId = $curTarget.parents('.entry').data('lge');

                        model = c.get(modelId);
                    }
                }

                if (_.isObject(model)) {
                    action = options.actionType.toLowerCase();
                    if (action === 'follow') {
                        action = 'follower';
                    }
                    
                    actionIds = action + "_ids";
                    Ids = model.get(actionIds);
                    user = app.User.toJSON();

                    if (_.isArray(Ids)) {
                        Ids.push({
                            _id   : {
                                $id : user.userId
                            },
                            name  : user.name,
                            image : user.image
                        });

                        model.set(actionIds, Ids);
                        if (action === 'comment') {
                            action = 'comments';
                        }
                        model.set(action, Ids.length);
                        $('.tooltip').remove();
                    }
                }
            }
        },
        
        postFail : function (jqXHR, status, errorMsg, options) {
        
        },

        isValidAction : function (action) {
            return  $.inArray(action, this.validActions) !== -1;
        },

        getAction : function ($elem) {
            var act = false;
            _.each(this.validActions, function (action) {
                if ($elem.hasClass(action) || $elem.parent().hasClass(action)) {
                    act = action;
                }
            });
            return act;
        },

        onShowLoginModal : function (message) {

            var me = this, _ref = me.loginModal.$el;
            
            $("<div></div>", {
                "class" : "alert alert-error",
                "id"    : "alertMessage",
                "html"  : message
            }).prependTo(_ref.find('.modal-body'));

            _ref.modal('show');
        },

        onShowNoteModel : function (noteModel) {

            if(this.noteModel){
                $("#popupNoteModel").remove();
            }

            this.noteModel = new app.Views.NoteModel({
                model : noteModel
            });

            $('body').append(this.noteModel.render().el);



            $('#popupNoteModel').modal("show");


        },

        followWork:function(model,$curTarget){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }


            var options, id, url, col, entityType;

            if ($curTarget.data('type') === 'lg') {
                id = app.SearchResults.activeItemId();
                url = app.SERVER_URL + '/lg/follow';
                col = sessionStorage.getItem('activeItemType');
                //col = localStorage.getItem('activeItemType');
                entityType = 'lg';
            } else {
                //id = $curTarget.parents('.entry').data('lge');

                id=model.get("id");
                url = app.SERVER_URL + '/lge/follow';
                col = null;
                entityType = 'lge';
            }

            if(typeof(id)=="undefined" || id==""){
                return;
            }

            if(_.isValid(model.get("col"))){
                if(model.get("col")=="People"){
                    col="people";
                } else{
                    col="org";
                }
            }

            if(_.isValid(model.get("entityType"))){
                entityType=model.get("entityType");
                url = app.SERVER_URL + '/'+entityType+'/follow';

                
                    entityType="lge";

            }

            options = {
                url        : url,
                data       : {
                    "id"    : id,
                    col   : col,
                    token : app.User.get('userToken')
                },
                $el        : $curTarget,
                actionType : "Follow",
                entityType : entityType
            };


            this.postAction(options);

        },

        shareWork:function(model,$curTarget){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;
            }

            var url="http://www.sharethis.com/share#sthash.Uf63qB6u.dpuf";
            var params="";




            var me=this,options = {
                url  : app.SERVER_URL + '/lge/share',
                data : {
                    id    : model.get("id"),
                    token : app.User.get('userToken')
                },
                $el  : $curTarget,
                actionType : "Share"
            };

            var new_url=model.get("web_url");
            if(new_url=="N/A"){
                new_url= "http://"+window.location.hostname+"/#showNote/"+model.get("id");
            }

            params=params+"?publisher="+encodeURIComponent("e4cf591c-0bbe-4c83-abb8-92dddcb17238");
            //params=params+"&url="+encodeURIComponent(model.get("web_url"));
            params=params+"&url="+encodeURIComponent(new_url);

            params=params+"&title="+encodeURIComponent(model.get("title"));
            params=params+"&img="+encodeURIComponent(model.get("profilePic"));
            params=params+"&summary="+encodeURIComponent(model.get("summary"));

            url=url+params;
            var timer,win;

            win = window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            function is_closed() {
                if (win && win.closed) {

                    me.postAction(options);
                    clearInterval(timer);
                    win = null;

                }
            }

            timer = setInterval(is_closed, 1000);
        },

        likeWork:function(model,$curTarget){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }
            var options;
            options = {
                url        : app.SERVER_URL + '/lge/like',
                data       : {
                    id    : function () {
                        return $curTarget.parents('.entry').data('lge');
                    },
                    token : app.User.get('userToken')
                },
                $el        : $curTarget,
                actionType : "Like"
            };

            this.postAction(options);

        },

        onEditNote : function (editModel) {

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }

            var me = this;

            if (!me.contributorMainView) {
                me.subViews.push('contributorMainView');
                me.contributorMainView = new app.Views.Contributor.Main();
                me.$el.find('#footer').before(me.contributorMainView.render().el);
            }
            me.contributorMainView.showPostEdit(editModel);
            me.contributorMainView.$el.show();

            return;


            if(this.editNoteModel){
                $("#editNote").remove();
            }

            this.editNoteModel = new app.Views.Contributor.Editpost({
                model : editModel
            });

            $('body').append(this.editNoteModel.render().el);
            $('#editNote').modal("show");

        },

        commentFeed:function(model,$curTarget){

            if(!localStorage.hasOwnProperty("userId")
                || localStorage.getItem("userId")==""){
                $("#loginModal").modal("show");
                return;

            }
            
            var $commentModal = this.commentModal;


            $commentModal.collection.currentLGEID = model.get("id");

            $commentModal.collection.currentLGEEl = $curTarget;
            $commentModal.$el.modal('show');


        },

        getLoadingIcon:function(){
            var html="<div style='text-align: center;vertical-align: middle;width: 100%;height: 100%;'>";
            html+="<br/><br/><img src='images/loading.gif' style='vertical-align: middle;text-align: center;' />";
            html+="</div>";
            return html;
        }






    });


});
