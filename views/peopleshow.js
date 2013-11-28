var app = app || {};

$(function ($) {
    'use strict';

    app.PeopleShow = Backbone.View.extend({

        //className : "item",
        tagName: 'div',

        template : _.template($("#peopleShow").html()),


        events : {
            "click #person":"onPersonClick"
        },

        initialize : function () {

        },

        render : function () {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        },

        onPersonClick:function(e){
            console.log(this.model);
            e.preventDefault();
            if(this.model.get("id")!=null){
                app.LGRouter.navigate("/#graph/" + this.model.get("id"), true);
            }
        }

    });

});