var app = app || {};

(function () {
    'use strict';

    app.Models.User = Backbone.Model.extend({

        default:{
            email_address:""
        },
        
        parse : function (response, xhr) {
            
            if (response.error) {
                return;
            }

            return _.parseUser.call(this, response.data);
        },

        validateUser : function (attributes) {
            var attrs = attributes.lg_data;
            var errors = [];

            if (!attrs.email_address) {
                errors.push({name : 'email_address', message : 'Please enter email address.'});
            } else if (!_.isValidEmailAddress(attrs.email_address)) {
                errors.push({name : 'email_address', message : 'Please enter an valid email address.'});
            }
            
            if (!attrs.physical_address) {
                errors.push({name : 'physical_address', message : 'Please add address.'});
            }
            
            if (!attrs.phone_number) {
                errors.push({name : 'phone_number', message : 'Please enter phone number.'});
            } 
            
            if (!attrs.bio_summary) {
                errors.push({name : 'bio_summary', message : 'Please fill biography field.'});
            } 

            if (!_.isEmpty(errors)) return errors;
            //return true;
        },
        
        isLoggedIn : function () {
            //var token = sessionStorage.getItem('userToken');
            if(!localStorage.hasOwnProperty('userToken')){
                console.log("no user token");
                return false;
            }
            console.log("has user token");
            var token = localStorage.getItem('userToken');
            return _.isNull(token) || _.isUndefined(token) || token === "undefined" ? 0 : 1;
        },
        
        generateToken : function () {
            return app.Utils.strPad(parseInt(Math.random() * (Math.pow(10, 10))).toString(), 10, '0', STR_PAD_LEFT);
        },
        
        initialize : function () {

            var me = this;
            
            _.bindAll(me, 'setData', 'resetData');
            
            if ( me.isLoggedIn() ) {
                //me.set('userToken', sessionStorage.getItem('userToken'));
                me.set('userToken', localStorage.getItem('userToken'));
                me.setUserInfo();
                //app.trigger('userLoggedIn');
            }
            
            me.on('change:userToken', me.onChangeUserToken);
            me.on('change:userId', me.onChangeUserId);
            
            app.on('userLoggedIn', me.setData);
            app.on('userLogOut', me.resetData);
        },

        onChangeUserToken : function () {
            console.log("changing user token");
            //sessionStorage.setItem('userToken', this.get('userToken'));
            localStorage.setItem('userToken', this.get('userToken'));
        },
        
        onChangeUserId : function () {
            console.log("changing user id");
            if(this.get('userId')==""){
                this.logout();
            }
            //sessionStorage.setItem('userId', this.get('userId'));
            localStorage.setItem('userId', this.get('userId'));
            this.setData();
        },
        
        logout : function () {
            console.log("user logout");
            window.open(app.SERVER_URL + '/test/facebook/logout.php?token=' + this.get('userToken'), '', 'menubar=no,toolbar=no,resizable=yes,width=600,height=400');

            app.trigger('userLogOut');
        },

        setData : function () {

            var me = this;
            app.User.fetch({
                url : app.SERVER_URL + '/lg/' + me.get('userId')
            }).done(function (response) {
                        if (!app.performAction) {
                            //app.LGRouter.navigate("/#contributor/" + me.get('userId') + "/feed", true);
                        }
                        app.performAction = false;
                        //sessionStorage.setItem('userInfo', JSON.stringify(app.User.toJSON()));
                        localStorage.setItem('userInfo', JSON.stringify(app.User.toJSON()));
                        if(localStorage.hasOwnProperty("userId")
                            && localStorage.getItem("userId")!=""
                            && localStorage.getItem("userId")!="0"){
                            $("#loginModal").modal('hide');
                            $("#mm").modal('hide');

                        }else{
                            localStorage.removeItem('userToken');
                            app.User.logout();
                        }

                    });
        },

        resetData : function () {
           // this.clear();
            this.set("userToken","");
            this.set("userInfo","");
            this.set("userId","");
            _.each(['userId', 'userInfo', 'userToken'], function (item) {
                sessionStorage.removeItem(item);
                localStorage.removeItem(item);
            });


        },

        setUserInfo : function () {
            var me = this;
            //var data = JSON.parse( sessionStorage.getItem('userInfo') );
            var data = JSON.parse( localStorage.getItem('userInfo') );
            if (_.isObject(data) ) {
                _.each(data, function (value, key, list) {
                    me.set(key, value)
                });
            }
        }
    });

}());
