var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Nav = Backbone.View.extend({

        className : "nav nav-pills",
        
        id : "ContributorNav",
        
        tagName : "ul",

        template : _.template($("#contributorNavTemplate").html()),

        render : function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});
