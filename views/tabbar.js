var app = app || {};

$(function ($) {
    'use strict';

    app.TabbarView = Backbone.View.extend({
        
        id : "tabbar",

        className : "nav btn-group",

        template : _.template($("#tabbarTemplate").html()),
        
        events : {
            'click' : 'onTabClick'
        },

        initialize : function () {
            _.bindAll(this, "setId");
            
            app.on('activeItemChanged', this.setId);
        },

        render : function () {
            $("#tabbar").remove();
            this.$el.html(this.template(this.model));            
            return this;
        },
        
        setId : function () {   
            this.model = {
                id : sessionStorage.getItem('activeItemId')
                //id : localStorage.getItem('activeItemId')
            };
            this.render();
        },
        
        onTabClick : function (e) {
            this.$el.find('a').removeClass('active');
            this.$el.find(e.target).addClass('active')
        }
    });
});
