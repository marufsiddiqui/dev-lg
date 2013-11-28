var app = app || {};

$(function ($) {
    'use strict';

    app.SearchFormView = Backbone.View.extend({

        template : _.template($("#searchFormTemplate").html()),

        className : 'searchContainer',



        events : {
            'submit form' : "submitForm"
        },

        initialize : function () {


        },

        render : function () {
            console.log("in form");
            this.$el.html(this.template());
            this.createPeople();
            return this;
        },

        submitForm : function (e) {
            e.preventDefault();
            app.trigger('submitForm', e, this);
            return false;
        },

        createPeople:function(){
            console.log("in face");
            //this.$el.find("#peopleList").html("");
            var me=this;

           /* app.PeoplePictureCollection.fetch({
                success : function(){
                    console.log("success");
                    me.addPeople();
                },
                error : function(){
                    console.log("failed");
                    me.addPeople();
                }
            });*/

            $.ajax({
                url: app.SERVER_URL + '/lg/random_list/?limit=7',
                success: function(response){
                    response = _.isObject(response) ? response : $.parseJSON(response);
                    var values=response.results;
                    //me.$el.find("#peopleList").html("");
                    console.log("item ",me.$el.find("#peopleList").html());
                    for (var i = 0, length = values.length; i < length; i++) {

                        var currentValues = values[i];
                        var peoplePictureObject= new app.PeoplePictureModel();
                        peoplePictureObject.set("id",currentValues["_id"]["$id"]);

                        peoplePictureObject.set("name",currentValues["name"]);
                       if(currentValues["image_urls"].length>0){
                           peoplePictureObject.set("picture",currentValues["image_urls"][0]["original"]);

                       }

                        me.addPerson(peoplePictureObject);
                    }

                }
            });

        },

        addPerson: function (item) {

            console.log("in 1");
            var view = new app.PeoplePicture({ model : item });
            this.$el.find("#peopleList").append(view.render().el);
        }

    });
});
