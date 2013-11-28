var app = app || {};

$(function ($) {
    'use strict';

    app.PeopleShowList = Backbone.View.extend({

        //className : "item",
        tagName: 'div',

        template : _.template($("#peopleShowList").html()),


        events : {
            "click #person":"onPersonClick"
        },

        initialize : function () {

        },

        render : function () {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        },

        addAllPeople : function(title,data,addPerson){

            var i,id,name,picture,model;

            this.$el.find("#peopleListTitle").html(title);
            this.$el.find("#peopleListNames").html("");

            for(i=0;i<data.length;i++){
                id=data[i]._id.$id;
                name=data[i].name;
                picture=data[i].image.original;

                model=new Backbone.model(
                    {
                        "id":id,
                        "name":name,
                        "picture":picture
                    }
                );

                this.addPerson(model);

            }

            $("#mm").html(this.el);
            $("#mm").show();




        },

        addPerson:function(personmodel){

            var person=new app.PeopleShow({
                model:personmodel
            });
            this.$el.find("#peopleListNames").append(person.render().el);
        }

    });

});