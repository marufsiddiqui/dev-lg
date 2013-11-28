var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.ModerationRequest = Backbone.View.extend({

        className : 'contributorBody clearfix',

        events : {

        },

        initialize : function () {
            var me = this;

            _.bindAll(me, 'checkScroll');


            me.model = new Backbone.Model({
                tags_count : 0,
                total_count : 0
            });

            me.collection.on('reset', me.addAll, me);

            app.Collections.ModerationRequest.fetch(function(){
                me.ini();
            });

        },

        ini:function(){
            var me=this;
            me.model.on('change', me.render, me);
            app.on('moderationRequestFeedData', me.onRequestFeedData, me);

            me.isLoading = false;
            me.collection.on('add', me.addOneInfinite, me);

            me.collection.on('change', this.addAll, this);
            $(window).scroll(me.checkScroll);

            me.collection.fetch(function(){
                console.log("hello ");
            });

        },

        render : function () {


            this.addAll();
            return this;
        },

        addOne : function (item) {
            item.set("request",true);
            var view = new app.Views.Contributor.ModerationItem({ model : item });
            this.$el.find("#moderationRequestView1").append(view.render().el);
            this.checkItems();
        },

        addOneInfinite : function (item) {
            var me = this;
            me.addOne(item);
            me.makeEqualHeight();
        },

        addAll : function () {
            var me = this;
            me.$el.html("<div id='moderationRequestView1'></div>");

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
                && !me.isLoading
                && $(window).scrollTop() >= $(document).height() - $(window).scrollTop() - 500) {

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

        onRequestFeedData : function (data) {
            console.log("req innnnnnn");
            var me = this;
            me.model.set('total_count', data.total_count)
            me.model.set('tags_count', data.tags_count)
        }
    });
});
