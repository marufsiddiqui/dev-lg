var app = app || {};

$(function ($) {
    'use strict';

    app.Views.RelatedPeopleItem = Backbone.View.extend({
            
    	className : "inlineImage",
        
        template : _.template($("#relatedPeopleItemTemplate").html()),        
    	
    	events : {
    		'click a' : 'onClickItem'
    	},
    	
    	initialize : function () {
    		
    	},
    	
    	render : function () {
            this.$el.append(this.template(this.model.toJSON()));
    		return this;
    	},

        onClickItem : function () {
            //remove all tooltips
            $('.tooltip').remove();

            //sessionStorage.setItem('activeItemId', this.model.get('id'));
        }
    	
    });

});