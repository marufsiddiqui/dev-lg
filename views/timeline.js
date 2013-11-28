var app = app || {};

$(function ($) {
    'use strict';

    app.TimelineView = Backbone.View.extend({
        
        id : "timeline-embed",

        initialize : function () {
            var me = this;
            
            //app.on('userLoggedIn', me.createTimeline, me);
            //app.on('userLogOut', me.createTimeline, me);
        },

        render : function () {
            return this;
        },

        createTimeline : function () {
            var source = app.SERVER_URL + '/timeline/?id=' + app.SearchResults.activeItemId() + "&type=.jsonp";
            console.log("in time line ",source);
            app.curTimeline = createStoryJS({
                type              : 'timeline',
                embed_id          : 'timeline-embed', // ID of the DIV you want to load the timeline into                
                width             : '100%',
                height            : '540',
                source            : source, //OPTIONAL USE A DIFFERENT DIV ID FOR EMBED
                //source            : 'data/weissman_jsonp.jsonp', //OPTIONAL USE A DIFFERENT DIV ID FOR EMBED
                start_at_end      : true, //OPTIONAL START AT LATEST DATE
                start_at_slide    : '0', //OPTIONAL START AT SPECIFIC SLIDE
                start_zoom_adjust : '1', //OPTIONAL TWEAK THE DEFAULT ZOOM LEVEL
                hash_bookmark     : false, //OPTIONAL LOCATION BAR HASHES
                font              : 'PT', //OPTIONAL FONT
                debug             : true, //OPTIONAL DEBUG TO CONSOLE
                lang              : 'en', //OPTIONAL LANGUAGE
                maptype           : 'watercolor', //OPTIONAL MAP STYLE
                css               : 'css/timeline/timeline.css', //OPTIONAL PATH TO CSS
                js                : 'js/lib/timeline-min.js?time=?'    //OPTIONAL PATH TO JS
            });
        }
    });
});
