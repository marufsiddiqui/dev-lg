var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Contributions = Backbone.View.extend({

        className : 'contributorBody clearfix',

        events : {
            'click .addNote a' : "onClickNew"
        },

        initialize : function () {
            var me = this;

            _.bindAll(me, 'checkScroll');

            me.isLoading = false;

            me.collection.on('add', me.addOneInfinite, me);
            me.collection.on('reset', me.addAll, me);
            //me.collection.on('change', this.addAll, this);

            app.on('newLGECreated', function () {
                me.collection.fetch();
            });

            $(window).scroll(me.checkScroll);

            me.collection.fetch();
        },

        render : function () {

            this.addAll();
            return this;
        },

        addOne : function (item) {




            item.set("editable",true);
            //item.setData("showEditable",true);
            var view = new app.PegboardItemView({ model : item });
            this.$el.append(view.render().el);
            this.checkItems();
        },

        addOneInfinite : function (item) {
            console.log("sda I");
            var me = this;
            me.addOne(item);
            me.makeEqualHeight();
        },

        addAll : function () {
            console.log("sda");
            var me = this;
            me.$el.html('');
            me.$el.append("<div class='addNote'><a href='#'>Add new note</a></div>");
            me.collection.each(me.addOne, me);
            //me.makeEqualHeight();            
        },

        checkItems : function () {
            var me = this;
            if (me.collection.total === me.$el.find('.item').length) {
                me.$el.append("<div style='clear:both; margin: 10px 0'>No more items</div>");
            }
        },

        makeEqualHeight : function () {
            //make equal height
            _.equalHeight(this.$el.find('.contentContainer'));
        },

        checkScroll : function () {


            var me = this;
            var collection = me.collection;

            if (collection.loaded < collection.total
                //&& app.activeView === 'Pegboard'
                && !me.isLoading
                    && $(window).scrollTop() >= $(document).height() - $(window).scrollTop() - 500) {
                console.log("in");
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
                    me.isLoading = false;
                    me.$el.find('.loader').fadeOut().remove();
                }
            });
        },

        onClickNew : function (e) {
            e.preventDefault();
            app.LGRouter.navigate("/#contributor/" + app.User.get('userId') + "/postnew");            
        }
    });
});
