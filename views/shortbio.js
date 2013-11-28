var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.ShortBio = Backbone.View.extend({

        className : "profileContainer",
        
        initialize : function () {
            this.model.on('change', this.render, this);
        },

        render : function () {
            var data = this.model.toJSON();
            
            if (!data.image) {
                _.each(['follower', 'jobTitle', 'jobLocation', 'name', 'image'], function (k) {
                    data[k] = "images/default-company.png";
                });
            }
            
            this.$el.html(this.template(data));
            return this;
        },

        template : _.template($("#contributorProfileContainerTemplate").html())
        
    });
});