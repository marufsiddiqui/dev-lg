var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Editpost = app.BasicView.extend({


        className : 'contributorForm',
        id : 'editNote',
        model:app.NoteDetailModel,


        template : _.template($("#editPostTemplate").html()),

        tagName : 'form',
        
        events : {
            'submit' : 'savePost',
            'change #editPostTemplate_lge_image' : 'changeImage'
        },

        changingImage:false,

        changeImage:function(){

            if(this.changingImage){
                return;
            }

            this.changingImage=true;

            console.log(this.model.get("profilePic"));

            var val=$("#editPostTemplate_lge_image").val();

            var l=val.length;
            console.log("p",l<4);
            if(l < 4){
                alert("invalid file");
                $("#editPostTemplate_lge_image").val(this.model.get("profilePic"));
                this.changingImage=false;
                return;
            }
            val=val.substring(val.length-4);


            console.log("val ",val,val== ".png" );
            if(!(val==".jpg" || val== ".png" || val==".gif"
                || val==".JPG" || val== ".PNG" || val==".GIF")){
                alert("invalid file");
                $("#editPostTemplate_lge_image").val(this.model.get("profilePic"));
                this.changingImage=false;
                return;
            }

            this.changingImage=false;
        },
        
        initialize : function () {
            var me = this;
            _.bindAll(me, 'resetForm');
            me.autoCompleteInited = false;
            me.$tokenInput = '';
        },

        render:function(){
            var newTime="";

            var d=new Date(this.model.get("time"));

            newTime=newTime+ d.getFullYear();

            newTime=newTime+"-";

            if(d.getMonth()<10){
                newTime=newTime+"0"+d.getMonth();
            }else{
                newTime=newTime+d.getMonth();
            }

            newTime=newTime+"-";

            if(d.getDate()<10){
                newTime=newTime+"0"+d.getDate();
            }else{
                newTime=newTime+d.getDate();
            }

            this.model.set("date_time",newTime);

            var me = this;


            this.$el.html(this.template(me.model.toJSON()));
            me.setup();
            me.$el.show();
            me.prefillTokenInput2();
            console.log("date ",this.model.get("time"));
            return me;
        },

        prefillTokenInput : function () {
            var obj = app.LGRouter.masterView.generalInfoView.model.toJSON();
            // Add a token programatically
            this.$tokenInput.tokenInput("add", {
                name : obj.name,
                id   : {
                    "ref" : obj.hasOwnProperty('type') ? (obj.type === '' ? 'Organization' : obj.type) : "People",
                    "id"  : obj.id
                }
            });
        },

        prefillTokenInput2 : function () {

            var me=this;
            var obj;
            //var data=this.model.get("people");
            var data=this.model.toJSON().people;
            for(var i=0;i<data.length;i++){
                obj=data[i];

                me.$tokenInput.tokenInput("add", {
                    name : obj.name,
                    id   : {
                        "ref" : obj.id.$ref,
                        "id"  : obj.id.$id.$id
                    }
                });
            }

            var data=this.model.toJSON().orgs;
            for(var i=0;i<data.length;i++){
                obj=data[i];

                me.$tokenInput.tokenInput("add", {
                    name : obj.name,
                    id   : {
                        "ref" : obj.id.$ref,
                        "id"  : obj.id.$id.$id
                    }
                });
            }

        },



        setup : function () {
            var me = this;

            me.setupCharCount();

            me.setupDatePicker();

            me.setupAutocomplete();

            me.resetForm();
        },
        
        setupCharCount : function () {            
            var $el = this.$el;
            var $el = this.$el;
            var maxCharacters = 1000;

            $el.find('#editPostTemplate_count').text(maxCharacters);
               console.log($el.find('textarea'));
            $el.find('textarea').on('keyup keydown', function () {
                var count = $el.find('#editPostTemplate_count');
                var characters = $(this).val().length;

                if (characters > maxCharacters) {
                    count.addClass('charOver');
                } else {
                    count.removeClass('charOver');
                }

                count.text(maxCharacters - characters);
            });
        },
        
        setupDatePicker : function () {
            this.$el.find('[type=date], .datepicker').pickadate({
                today         : false,
                date_max      : true,
                format        : 'dddd, dd mmm, yyyy',
                yearSelector  : 50
            });
        },
        
        setupAutocomplete : function () {
            var me = this;
            console.log("me.autoCompleteInited  ",me.autoCompleteInited);
            if (!me.autoCompleteInited) {
                me.$tokenInput = me.$el.find('#editPostTemplate_lge_person');
                me.$tokenInput.tokenInput(app.SERVER_URL + '/search/', {
                    theme       : "facebook",
                    method      : 'GET',
                    minChars    : 3,
                    crossDomain : false,
                    onResult    : function (results) {
                        return _.map(results.data, function (obj) {
                            return {
                                name : obj.name,
                                id   : {
                                    "ref" : obj.hasOwnProperty('type') ? (obj.type === '' ? 'Organization' : obj.type) : "People",
                                    "id"  : obj._id.$id
                                }
                            };
                        });
                    }
                });
                me.autoCompleteInited = 1;
            }            
        },
        
        resetForm : function () {
            var me = this;
            if (me.autoCompleteInited) {
               // me.$tokenInput.tokenInput("clear");
            }
            if (sessionStorage.getItem('prefill')) {
            //if (localStorage.getItem('prefill')) {
                me.prefillTokenInput();
                sessionStorage.removeItem('prefill');
                //localStorage.removeItem('prefill');
            }
            _.enableForm(me.$el);
            me.hideErrors.call(me);
            me.el.reset();
            me.$el.find('input:first').focus();
        },
        
        savePost : function (e) {
            e.preventDefault();
            var me = this, lge, ret, options;

            lge = new app.Models.LGE(me.newAttributes());
            console.log("lge data",lge);
            //return;

            if (ret = lge.validate(lge.attributes)) {
                me.showErrors.call(me, ret);
            } else {
                me.hideErrors.call(me);
                
                _.disableForm(me.$el);
                
                options = {
                    data : lge.toJSON(),
                    url : app.SERVER_URL + '/lge/save/'+me.model.get("id"),

                    type : 'POST',
                    success : function (response, textStatus, jqXHR) {
                        
                        _.enableForm(me.$el);
                        
                        response = _.isObject(response) ? response : $.parseJSON(response);
                        if (response.success) {
                            delete lge.id; //TODO: very nasty thing. I'm removing the id as collection thinks its duplicate data
                            app.trigger('newLGECreated');
                            //$(me.el).modal("hide");
                            $("#editNote").modal("hide");
                            app.LGRouter.navigate('/#contributor/' + app.User.get('userId') + '/feed', this);
                        } else {
                            console.log('error');
                        }
                    },
                    error : me.postFail
                };
                
                me.$el.ajaxSubmit(options);
            }
        },

        showErrors : function (errors) {
            var me = this, msg = '';
            if  (!me.$('.errorDiv').length) {
                me.$el.prepend("<div class='errorDiv alert alert-error'></div>");
            }
            
            _.each(errors, function (error) {
                //this.$('#' + error.name).addClass('error');
                msg += error.message + " <br>";
            }, this);
            
            this.$(".errorDiv").html(msg).fadeIn();
            $('html, body').animate({scrollTop : 100}, 500);
        },

        hideErrors : function () {
            //this.$('.error').removeClass('error');
            this.$('.errorDiv').fadeOut().remove();
        },

        newAttributes : function () {
            var me = this;
            console.log(me.model);
            var $entityData = $("#editPostTemplate_lge_person").tokenInput("get");
            console.log();
            return {
                lge_data : {
                  //  id:me.model.get("id"),
                    access_level       : '',
                    subject_name       : '',
                    title              : me.getFieldValue('#editPostTemplate_lge_title'),
                    primary_people_ids : me.getPrimaryPeopleIds($entityData),

                    primary_org_ids    : me.getPrimaryOrgIds($entityData),

                    timestamp          : me.getTimestamp(me.getFieldValue('#editPostTemplate_lge_date')),
                    details            : me.getFieldValue('#editPostTemplate_lge_edit_post_message'),
                    summary            : me.getFieldValue('#editPostTemplate_lge_edit_post_message'),
                    editPostTemplate_lge_person_email   : me.getFieldValue('#editPostTemplate_lge_person_email')
                },
                token : app.User.get('userToken')
            }
        },
        
        getTimestamp : function (str) {
            var dt = new Date(str);
            return dt.getTime() / 1000;
        },
        
        getFieldValue : function (field) {
            return $.trim(this.$el.find(field).val());
        },

        getPrimaryOrgIds : function ($entityData) {
            return _.filter($entityData, function (entity) {
                return entity.id.ref !== 'People'
            });
        },
        
        getPrimaryPeopleIds : function ($entityData) {
            return _.filter($entityData, function (entity) {
                return entity.id.ref === 'People'
            })
        },

        postFail : function (jqXHR, textStatus) {
            alert('error occured');
        }
    });


});
