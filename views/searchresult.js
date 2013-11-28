var app = app || {};

$(function ($) {
    'use strict';

    app.SearchResultView = Backbone.View.extend({

        className : 'resultsView',

        events : {
            'scroll' : 'checkScroll'
        },

        initialize : function () {
            var me = this;
            
            _.bindAll(me, 'checkScroll');
            
            me.isLoading = false; 
            me.collection.on('reset', me.addAll, me);
            me.collection.on('add', me.addOne, me);
            $(window).scroll(me.checkScroll);
        },

        render : function () {
            this.addAll();
            return this;
        },
        
        checkItems : function () {
            var me = this;
            if (me.collection.total === me.$el.find('.entry').length) {
                me.$el.append("<div style='clear:both; margin: 20px 25%;font-size:18px;color:#999;'>No more items</div>");
            }
        },

        addOne : function (searchResultItem) {
            var view = new app.SearchResultItemView({ model : searchResultItem });
            this.$el.append(view.render().el);
            this.checkItems();
        },

        addAll : function () {
            var me = this, collection = me.collection;
            me.$el
                    .html('')
                    .append("<div class='title'><h2>Found "+ collection.total + " results</h2></div>");
            collection.each(this.addOne, this);
        },

        checkScroll : function () {
            var me = this;
            var collection = me.collection;

            if ( collection.loaded < collection.total &&
                    app.activeView === 'Search' && !me.isLoading 
                    && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                collection.pageNum += 1; // Load next page
                me.loadMore();
            }
        },

        loadMore : function () {
            var me = this, collection = me.collection;
            me.isLoading = true;
            $("<div class='loader loaderResults'></div>").appendTo(me.$el).show();

            collection.fetch({
                add : true,
                success : function (collection) {
                    // Now we have finished loading set isLoading back to false
                    me.isLoading = false;
                    me.$el.find('.loader').fadeOut().remove();
                    // Once the results are returned lets populate our template
                    //collection.pageNum 
                    //collection.each(me.addOne, me);
                }
            });
        }
    });
});
