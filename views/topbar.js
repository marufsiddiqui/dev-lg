var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Topbar = Backbone.View.extend({

        className : "",

        initialize : function () {
            
        },

        render : function () {
            var me = this;

            //create short bio
            me.createShortBio();
            
            //create nav
            me.createNav();
            
            return this;
        },

        createNav : function () {
            var me = this;
            me.nav = new app.Views.Contributor.Nav({
                model : app.User
            });
            me.$el.append(me.nav.render().el);
        },
        
        createShortBio : function () {
            var me = this;
            me.shortBio = new app.Views.Contributor.ShortBio({
                model : app.User
            });
            me.$el.append(me.shortBio.render().el);
        },

        setActiveClass : function (task) {
            var me = this, classMap;
            classMap = {
                'feed' : 0,
                'profile' : 1,
                'contributions' : 2,
                'moderation' : 3
            };
            me.nav.$el.find('li').removeClass('active');
            me.nav.$el.find('li').eq(classMap[task]).addClass('active');
        }
    });
});
