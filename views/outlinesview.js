var app = app || {};

$(function ($) {
    'use strict';

    app.OutlinesView = Backbone.View.extend({

        className : "fixed-cards fancy-scrollbar",


        events : {

        },

        initialize : function () {
            var me = this;
            
            _.bindAll(me, 'fetchCollection');
            
            app.on('userLoggedIn', this.addAll, this);
            app.on('userLogOut', this.addAll, this);
            app.on('generalInfoLoaded', function () {
                me.fetchCollection();
            }, me);
            me.collection.on('add', me.addOne, me);
            me.collection.on('reset', me.addAll, me);
            //me.collection.on('change', this.addAll, this);

            // when activeItemChanged event triggered
            app.on('activeItemChanged', me.fetchCollection);

           /* me.fetchCollection(function(){
                me.addAll();
            });*/
        },
        
        fetchCollection : function () {
            this.collection.initialize();

            var me=this;
            this.$el.html("<img class='loadingImage' src='images/loading.gif'><span class='loadingEventsText'>Loading events...</span>");
            this.collection.fetch(function(){
                me.addAll();
            });
        },

        render : function () {
            
            return this;
        },
        
        addAll : function () {
            var me = this;
            //TODO : dirty quick way to do. must change it
            me.$el.html('');
            me.$el.append('<div class="fixed-cards-container"></div>');

            if (me.collection.length) {
                console.log("in ",me.collection.length);
                me.collection.each(me.addOne, me);
            } else {
                me.$el.html('<div class="emptyEvents">No events found.' +
                    //'<img src="images/loading.gif"/>' +
                    '' +
                    '</div>');
            }
        },
        
        addOne : function (item) {
            console.log("in item 1");
            var view = new app.OutlineItemView({ model : item });
            this.$el.find(".fixed-cards-container").append(view.render().el);
        }

    });
});