var app = app || {};

(function () {
    'use strict';

    app.SearchItem = Backbone.Model.extend({
        defaults : {
            profilePic  : "",
            name        : "",
            jobTitle    : "",
            jobLocation : "",
            bioSummary  : ""
        }
    });

}());
