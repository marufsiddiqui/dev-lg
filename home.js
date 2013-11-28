var app = app || {};

$(function ($) {
    'use strict';

    app.HomeView = Backbone.View.extend({

        className : '',

        events : {

        },

        initialize : function () {

        },

        render : function () {

            //add search form
            this.createSearchForm();

            //add bio entries
            // this.createBioEntries();


            //this.createPeople();
            //wrap inner with .row class div for matching design
            //this.$el.wrapInner("<div class='row'></div>");

            return this;
        },

        // createBioEntries : function () {
        //     var bioentry = new app.BioEntriesView();
        //     var bioContainer = $("<div class=></div>").append(bioentry.render().el);
        //     this.$el.append(bioContainer);
        // },

        createSearchForm : function () {
            var searchForm = new app.SearchFormView();
            this.$el.append(searchForm.render().el);
        },

        createPeople:function(){
            console.log("in face 2");
            this.$el.find("#peopleList").html("");
        }

    });
});
