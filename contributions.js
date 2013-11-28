var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Feed = app.BasicView.extend({

        className : "contributorBody",
        
        template: _.template($("#contributionsTemplate").html()),
        
        initialize : function () {
            var me = this;
            me.model = new Backbone.Model({
                tags_count : 0,

                total_count:0,
                moderation_count:0,
                participation_count:0
            });
            app.on('feedData', me.onFeedData, me);
            me.model.on('change', me.render, me);
            app.Collections.Contributor.fetch(function(){
                me.ini();
            });

        },

        ini:function(){
            var me=this;
            me.model.on('change', me.render, me);
            app.on('feedData', me.onFeedData, me);

        },

        onFeedData : function (data) {
            console.log("innnn");
            var me = this;
            me.model.set('total_count', data.total_count);
           // me.model.set('tags_count', data.tags_count);

            me.model.set('moderation_count', data.moderation_count);
            me.model.set('participation_count', data.participation_count);
            me.model.set('total_count', data.total_count);

            console.log("data ",me.model);
        }
    });
});
