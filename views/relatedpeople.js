var app = app || {};

$(function ($) {
    'use strict';

    app.Views.RelatedPeople = Backbone.View.extend({

        className : "relatedPeople",

        template : _.template($("#relatedPeopleTemplate").html()),

        events : {
            'click a' : function (e) {
                e.preventDefault();
                var col;
                if (col = app.GraphBreadcrumbCollection ) { //TODO write a clear method for clearing collection also duplicated in routes.js
                    var modelsToRemove = col.filter(function (model) {
                        return col.indexOf(model) >= 0;
                    });
                    col.remove(modelsToRemove);
                }
                app.LGRouter.navigate($(e.currentTarget).attr("href"), true);
            }
        },

        initialize : function () {
            var me = this;

            _.bindAll(me, 'checkRelatedPeopleData');

            // when activeItemChanged event triggered
            //app.on('viewChanged', me.checkRelatedPeopleData);
            app.on('generalInfoLoaded', me.checkRelatedPeopleData);

            me.collection.on('reset', me.addAll, me);
        },

        checkRelatedPeopleData : function () {
            /**
             * if query/prevQuery is empty then probably we are in timeline
             * or graph view which is accessed directly or page is refreshed
             * we loose all data for the later case
             *
             * so we gonna make a search keyword and then fetch the collection
             */
            var me = this, c = me.collection, firstName;

            var name = app.LGRouter.masterView.generalInfoView.model.toJSON().name;
            //if there's a name and we then split it on space and getting the array[0]
            if (name.length && (firstName = name.split(' ')[0])) {
                c.query = firstName;
                c.fetch().then(function () {
                    me.startPeopleSlider();
                });
            }

        },

        render : function () {
            this.addAll();
            //return this;
        },

        addOne : function (relatedPeopleItem, i) {
            if (i > 3) return;
            var me = this;

            //TODO : remove it as it has been implemented in collection
            if (relatedPeopleItem.get('id') === me.collection.activeItemId()) return;

            if (i % 20 === 0) {
                me.currentClass = 'entry_' + i;
                me.$el.find('ul').append("<li></li>").find('li:last').addClass(me.currentClass);
            }

            var view = new app.Views.RelatedPeopleItem({ model : relatedPeopleItem });
            me.$el.find('.' + me.currentClass).append(view.render().el);
        },

        addAll : function () {
            var me = this, collection = me.collection;

            me.$el
                    .html('')
                    .append(this.template())
                    .prepend("<ul class='bxslider'></ul>");
            collection = collection.nonActiveItems();
            _.each(collection, this.addOne, this);
        },


        startPeopleSlider : function () {
            var $bxSlider = $('.bxslider');
            var $bxSliderLis = $bxSlider.find('li');

            if ($bxSliderLis.length) {
                $bxSlider.bxSlider({
                    auto             : false,
                    mode             : 'horizontal',
                    slideMargin      : 0,
                    nextSelector     : '#slider-next',
                    prevSelector     : '#slider-prev',
                    nextText         : 'Load more',
                    prevText         : 'Load less',
                    infiniteLoop     : false,
                    hideControlOnEnd : true,
                    onSliderLoad : function () {
                        if ($bxSliderLis.length < 2) {
                            $("#slider-next").find('.bx-next').addClass('disabled');
                        }
                    }
                });

            }

        }

    });

});
