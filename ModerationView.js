var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.ModerationView = Backbone.View.extend({

        className : 'contributorBody clearfix',

        template : _.template($("#moderationTemplate").html()),

        events : {

        },

        initialize : function () {

        },

        render : function () {

            var me=this;

            this.$el.html("");

            this.$el.append(this.template());

            me.moderationRequest = new app.Views.Contributor.ModerationRequest({
                collection : app.Collections.ModerationRequest
            });
            me.moderationPending = new app.Views.Contributor.ModerationPending({
                collection : app.Collections.ModerationPending
            });

            this.$el.find("#moderation_request")
                .append(me.moderationRequest.render().el);

            this.$el.find("#moderation_pending")
                .append(me.moderationPending.render().el);

            return this;
        }
    });
});
