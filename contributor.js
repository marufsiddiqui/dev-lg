var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.Main = Backbone.View.extend({

        className : 'contributor',

        subViews : [],

        events : {

        },

        initialize : function () {
            var me = this;
            me.createTopBar();
        },

        render : function () {
            var me = this, $el = me.$el;
            // $el.css('padding-top', '25px');

            //me.$el.html('');
            

            //wrap inner with .row class div for matching design
            //this.$el.wrapInner("<div class='row'></div>");

            return this;
        },
        
        setup : function (options) {
            var me = this;
            me.topBar.setActiveClass(options.task);

            $.each(me.subViews, function (i, view) {
                if (me[view])
                    me[view].$el.hide();
            });

            me['show' + _.capitalize(options.task) ](options);
        } ,

        createTopBar : function () {
            var me = this;
            me.topBar = new app.Views.Contributor.Topbar();
            me.$el.append(me.topBar.render().el);
        },

        showFeed : function () {
            var me = this;

            if (!me.feedView) {
                me.subViews.push('feedView');
                me.feedView = new app.Views.Contributor.Feed({
                    collection : app.Collections.Contributor
                });
                me.$el.append(me.feedView.render().el);
            }else{
                app.Collections.Contributor.fetch();
            }
            me.feedView.$el.show('fast');
        },

        showModeration : function () {
            var me = this;

            if (!me.moderationView) {
                me.subViews.push('moderationView');
                me.moderationView = new app.Views.Contributor.ModerationView();
                me.$el.append(me.moderationView.render().el);
            }else{
                app.Collections.ModerationRequest.fetch();
                app.Collections.ModerationPending.fetch();
            }
            me.moderationView.$el.show('fast');
        },
        
        showProfile : function () {
            var me = this;

            if (!me.profileView) {
                me.subViews.push('profileView');
                me.profileView = new app.Views.Contributor.Profile({
                    model : app.User
                });
                me.$el.append(me.profileView.render().el);
            }

            me.profileView.render().$el.show();
        },
        
        showContributions : function () {
            var me = this;

            if (!me.contributionsView) {
                me.subViews.push('contributionsView');
                me.contributionsView = new app.Views.Contributor.Contributions({
                    collection : app.Collections.Contributor
                });
                me.$el.append(me.contributionsView.render().el);
            }else{
                app.Collections.Contributor.iniCollection();
                app.Collections.Contributor.fetch();
            }
            me.contributionsView.$el.show('fast', function () {
                me.contributionsView.makeEqualHeight();
            });
        },

        showPostnew : function () {
            var me = this;

            if (!me.postNew) {
                me.subViews.push('postNew');
                me.postNew = new app.Views.Contributor.Newpost({
                    model : app.User
                });
                me.$el.append(me.postNew.render().el);
            }
            me.postNew.setup();
            me.postNew.$el.show();
        },

        showPostEdit : function (editNoteModel) {
            var me = this;

            $.each(me.subViews, function (i, view) {
                if (me[view])
                    me[view].$el.hide();
            });

            if (!me.postEdit) {
                me.subViews.push('postEdit');
                me.postEdit = new app.Views.Contributor.Editpost({
                    model : editNoteModel
                });
                me.$el.append(me.postEdit.render().el);
            }else{
                $("#editNote").remove();
                me.postEdit = new app.Views.Contributor.Editpost({
                    model : editNoteModel
                });
                me.$el.append(me.postEdit.render().el);
            }

            me.postEdit.setup();
            me.postEdit.$el.show();
        }

    });
});
