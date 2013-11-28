var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contact = Backbone.View.extend({
        
        template : _.template($("#commingSoonTemplate").html()),
    	
    	render : function () {
            this.$el.html(this.template());
            return this;
    	}
    	
    });
});