var app = app || {};

$(function ($) {
    'use strict';

    app.Views.NoteModel = Backbone.View.extend({

        className : 'modal hide fade',
        model: app.NoteDetailModel,

        id : 'popupNoteModel',
        tagName:"div",



        template : _.template($("#popupNoteTemplate").html()),

        events : {

        },

        initialize : function () {
            var me = this;
            console.log(this.model);
            //me.model.on('change', me.render, me);
        },

        render : function () {
            var me = this;
            this.$el.html(this.template(me.model.toJSON()));
            return me;
        }
    });

});