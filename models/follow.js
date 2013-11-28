var app = app || {};

(function () {
    'use strict';

    app.Models.Follow = Backbone.Model.extend({

        defaults : {
            
        },
        
        url : function () {
            return app.SERVER_URL + '/lge/follow'
        },
        
        initialize : function () {
            var that = this;
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                options.xhrFields = {
                    withCredentials : true
                };
                // If we have a csrf token send it through with the next request
                if (typeof that.get('_csrf') !== 'undefined') {
                    jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
                }
            });
            that.set('token', app.User.get('userToken'));
        }
    });

}());
