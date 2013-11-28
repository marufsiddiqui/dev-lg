var app = app || {};

(function () {
    'use strict';

    app.Models.Comment = Backbone.Model.extend({

        defaults : {
            profilePic : '',
            userId     : localStorage.getItem("userId"),
            name       : '',
            time       : 'Just now'
        }
    });

}());
