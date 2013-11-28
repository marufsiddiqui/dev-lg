var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Onboard = Backbone.View.extend({
        
        className : 'onboarding',

        step1Template : _.template($("#onboardStep1Template").html()),
        yesTemplate   : _.template($("#onboardYesTemplate").html()),
        orgTemplate   : _.template($("#onboardOrgTemplate").html()),
        noTemplate    : _.template($("#onboardNoTemplate").html()),

        events : {
            'click .btn-success'     : 'onClickYes',
            'click .linkedin-signin' : 'onClickLI',
            'click .no'              : 'onClickNo'
        },

        initialize : function () {
            var me = this;
            _.bindAll(me, 'onClickYes', 'onClickNo');
            me.model.on('change', me.render, me);
        },

        render : function (template) {
            var me = this;
            me.template = (template === undefined) ? me.step1Template : me[template];
            console.log("rending template "+me.template);
            me.$el.html(me.template(me.model.toJSON()));
            return me;
        },

        onClickYes : function (e) {
            e.preventDefault();
            this.render('yesTemplate');
        },

        onClickNo : function (e) {
            e.preventDefault();
            this.render('noTemplate');
        },

        onClickLI : function (e) {
            var me=this;
            e.preventDefault();

            var token, win, timer, str,
                    el = $(e.currentTarget),
                    action = el.data('action');

            token = app.User.generateToken();

            str = 'token=' + token 
                    + '&action=' + action 
                    + '&claimedId=' + sessionStorage.getItem('activeItemId');
                    //+ '&claimedId=' + localStorage.getItem('activeItemId');



            //TODO : move the url to global app.URLS object
            win = window.open(app.SERVER_URL + '/test/linkedin/auth.php?' + str, '', 'menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            function is_closed() {

                if (win && win.closed) {

                    //me.$el.hide();
                    //me.$el.html(me.template).hide();
                    //app.LGRouter.navigate('/#'+ sessionStorage.getItem("currentView"), true);
                    me.$el.modal('hide');
                    clearInterval(timer);
                    win = null;
                    //$("#mm").modal('hide');
                    $.getJSON(app.SERVER_URL + '/li_connect/verify_token?' + str)
                            .then(function (response) {
                                if (!_.isEmpty(response.success)) {

                                    console.log("asdads");

                                    //from response determine if the merge is successful
                                    
                                    //or if its a new account
                                    
                                    app.User.set('userToken', token);
                                    app.User.set('userId', response.success.$id);
                                    app.trigger('userLoggedIn');
                                    if(localStorage.hasOwnProperty("userId")
                                        && localStorage.hasOwnProperty("userInfo")
                                        && localStorage.hasOwnProperty("userToken")){
                                        $("#mm").modal('hide');
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