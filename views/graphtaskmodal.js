var app = app || {};

$(function ($) {
    'use strict';

    app.Views.GraphTaskModal = Backbone.View.extend({

        el : $("#graphModal"),

        events : {
            'click #fetch_lge' : "onClickFetchLGE",
            'click #recenter' : "onClickRecenter"
        },

        initialize : function () {
            _.bindAll(this, 'onClickFetchLGE');
        },

        render : function () {
            return this;
        },

        onClickRecenter : function (e) {
            e.preventDefault();
            this.$el.modal('hide');
            app.LGRouter.navigate('/#graph/' + $(e.target).attr('data-id'), true);
        },

        onClickFetchLGE : function (e) {
            e.preventDefault();
        }
    });
});