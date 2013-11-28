var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Profile = app.BasicView.extend({

        tagName : 'form',

        events : {
            'submit' : 'saveProfile'
        },
        
        className : 'contributorForm',

        template : _.template($("#contributorFormTemplate").html()),

        saveProfile : function (e) {
            e.preventDefault();
            var me = this, lg, ret, options;

            lg = new app.Models.User(me.newAttributes());

            if (ret = lg.validateUser(lg.attributes)) {
                me.showErrors.call(me, ret);
            } else {
                me.hideErrors.call(me);

                var model=new Backbone.Model();
                model.set(lg.toJSON());
                model.attributes['follower_ids']=null;
                console.log("new followers model ", model);
                console.log("lg", lg);
                options = {
                    //data    : lg.toJSON(),
                    data    : model.toJSON(),
                    dataType : 'JSON',
                    url     : app.SERVER_URL + '/lg/' + app.User.get('userId') + '/save',
                    type    : 'POST',
                    timeout:8000,
                    success : function (response, textStatus, jqXHR) {
                        response = _.isObject(response) ? response : $.parseJSON(response);
                        if (response.success) {
                            app.User.set(me.newAttributes().lg_data); // TODO : possible refactor here and with user.js model
                            app.User.set("image", _.getProfilePic(response.success, false));
                            //sessionStorage.setItem('userInfo', JSON.stringify(app.User.toJSON()));
                            localStorage.setItem('userInfo', JSON.stringify(app.User.toJSON()));
                            alert("Profile Updated");
                            //app.LGRouter.navigate('/#contributor/' + app.User.get('userId') + '/feed', this);
                        } else {
                            console.log('error');
                        }
                    },
                    error   : me.postFail
                };

                me.$el.ajaxSubmit(options);
            }
        },

        showErrors : function (errors) {
            var me = this, msg = '';
            if (!me.$('.errorDiv').length) {
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
            this.$('.errorDiv').fadeOut().remove();
        },

        newAttributes : function () {
            var me = this;
            return {
                lg_data : {
                    email_address    : me.getFieldValue('#email_address'),
                    phone_number     : me.getFieldValue('#phone_number'),
                    physical_address : me.getFieldValue('#physical_address'),
                    bio_summary      : me.getFieldValue('#bio_summary')
                },
                token   : app.User.get('userToken')
            }
        },

        getFieldValue : function (field) {
            return $.trim(this.$el.find(field).val());
        }
    });
});
