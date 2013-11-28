var app = app || {};

$(function ($) {
    'use strict';

    app.Views.LoginModal = Backbone.View.extend({

        el : $("#loginModal"),

        events : {
            'click .facebook' : "onClickFacebook",
            'click .linkedin' : "onClickLinkdin"
        },

        initialize : function () {
            var me = this;
            _.bindAll(me, 'onClickFacebook', "onHide");
            me.$el.on('hide', me.onHide);
        },

        onHide : function () {
            $("#alertMessage", this.$el).remove();  
        },
        
        render : function () {
            return this;
        },

        onClickFacebook : function (e) {
            console.log("loginmodal onClickFacebook");
            var me = this;

            e.preventDefault();
            
            if ( app.User.isLoggedIn() ) {
                return;
            }

            var token, win, timer;
            token = app.User.generateToken();
            
            //TODO : move the url to global app.URLS object
            win = window.open(app.SERVER_URL + '/test/facebook/connect.php?token='+token,'','menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            function is_closed() {
                if (win && win.closed) {
                    clearInterval(timer);                    
                    win = null;
                    me.$el.modal('hide');
                    $.getJSON(app.SERVER_URL + '/fb_connect/verify_token?token=' + token)
                            .then(function (response) {
                                if (!_.isEmpty(response.success)) {

                                    app.User.set('userToken', token);                                    
                                    app.User.set('userId', response.success.$id);                                    
                                    app.trigger('userLoggedIn');

                                    if(localStorage.hasOwnProperty("userId")
                                        && localStorage.hasOwnProperty("userInfo")
                                        && localStorage.hasOwnProperty("userToken")){
                                        $("#loginModal").modal('hide');
                                    }
                                } else {
                                    //do nothing?
                                }
                            });
                }
            }

            timer = setInterval(is_closed, 1000);
            //app.LGRouter.navigate("/contributor/100/feed/", true);
        },

        onClickLinkdin : function (e) {
            var me = this;

            e.preventDefault();
            console.log("In LinkedIn");

            if ( app.User.isLoggedIn() ) {
                return;
            }

            var token, win, timer;
            token = app.User.generateToken();

            console.log("loginmodal onClickLinkdin");
            //TODO : move the url to global app.URLS object
            win = window.open(app.SERVER_URL + '/test/linkedin/auth.php?token='+token,'','menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            function is_closed() {
                if (win && win.closed) {
                    clearInterval(timer);
                    win = null;
                   // me.$el.modal('hide');
                    $.getJSON(app.SERVER_URL + '/li_connect/verify_token?token=' + token)
                        .then(function (response) {
                            console.log("v tkn ",response,response.success);
                            if (!_.isEmpty(response.success)) {
                                console.log("v tkn 2 ",response.success,token);
                                localStorage.removeItem("userToken");
                                app.User.set('userToken', token);
                                console.log("v tkn 3 ",response.success);
                                app.User.set('userId', response.success.$id);
                                console.log("v tkn 4 ",response.success);
                                app.trigger('userLoggedIn');
                                app.User.setData();
                                console.log("v tkn 5 ",response.success);
                                if(localStorage.hasOwnProperty("userId")
                                    && localStorage.hasOwnProperty("userInfo")
                                    && localStorage.hasOwnProperty("userToken")){
                                    $("#loginModal").modal('hide');
                                }
                            } else {
                                //do nothing?
                            }
                        });
                }
            }

            timer = setInterval(is_closed, 1000);
            //app.LGRouter.navigate("/contributor/100/feed/", true);
        }

    });
});