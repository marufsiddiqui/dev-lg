var app = app || {};

$(function ($) {
    'use strict';

    app.PegboardView = Backbone.View.extend({

        id : "container-masonry",
        
        className : 'clearfix',

        events : {
            
        },

        initialize : function () {
            var me = this;
            
            _.bindAll(me, 'checkScroll', 'fetchCollection');

            me.isLoading = false;

            app.on('userLoggedIn', me.addAll, me);
            app.on('userLogOut', me.addAll, me);
            app.on('generalInfoLoaded', function () {
                me.fetchCollection();
            }, me);
            me.collection.on('add', me.addOneInfinite, me);
            me.collection.on('reset', me.addAll, me);
            //me.collection.on('change', this.addAll, this);

            /*me.fetchCollection(function(){
                me.addAll();
            });*/

            $(window).scroll(me.checkScroll);

            // when activeItemChanged event triggered
            app.on('activeItemChanged', me.fetchCollection); 
            
        },

        fetchCollection : function () {
            this.collection.initialize();

            var me=this;
            console.log("in fetch");
            this.$el.html(app.LGRouter.masterView.getLoadingIcon());
            this.collection.fetch(function(){
                me.addAll();
            });
        },

        render : function () {
            return this;
        },

        addOne : function (item) {
            var view = new app.PegboardItemView({ model : item });
            this.$el.append(view.render().el);
            this.checkItems();
        },
        
        addOneInfinite : function (item) {
            var me = this;
            me.addOne(item);
            me.makeEqualHeight();
        },

        addAll : function () {
            var me = this;

            this.$el.html(app.LGRouter.masterView.getLoadingIcon());
            //if( app.activeView == "Pegboard" ) {
            if (app.PegboardItems.length) {
                me.$el.html('');
                app.PegboardItems.each(me.addOne, me);
                me.makeEqualHeight();
            } else {
                me.$el.html('<div class="noItemsText">No events found</div>');
            }                
            //}                       
        },
        
        checkItems : function () {
            var me = this;
            if (me.collection.total === me.$el.find('.item').length) {
                me.$el.append("<div class='noItemsText'>No more items</div>");
            }
        },

        makeEqualHeight : function () {
            //make equal height
            _.equalHeight(this.$el.find('.contentContainer'));
        },
        
        checkScroll : function () {
            var me = this;
            var collection = me.collection;

            if (collection.loaded < collection.total &&
                    app.activeView === 'Pegboard' && !me.isLoading
                    && $(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                collection.pageNum += 1; // Load next page
                me.loadMore();
            }
        },

        loadMore : function () {
            var me = this, collection = me.collection;
            me.isLoading = true;
            $("<div class='loader'></div>").appendTo(me.$el).show();

            collection.fetch({
                add     : true,
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
