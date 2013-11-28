var app = app || {};

(function () {
    "use strict";

    var PeoplePictureCollection = Backbone.Collection.extend({
        model : app.PeoplePictureModel,
        url   : function () {
            return app.SERVER_URL + '/lg/random_list/?limit=20';
        },
        parse : function (response, xhr) {




            var values = response.results;

            //var objects=new Array();
            var objects=[];
            //Parse the response and construct models
            for (var i = 0, length = values.length; i < length; i++) {

                var currentValues = values[i];
                var peoplePictureObject = {
                    "id":currentValues["_id"]["$id"],
                    "name":currentValues["name"],
                    "pictue":currentValues["image_urls"]["original"]
                };

                this.models.push(peoplePictureObject);
                //push the model object

                //this.push(peoplePictureObject);
                objects.push(currentValues);
                //objects[i]=currentValues;
            }



           // this.models.push(objects);

            //return models
            return this.models;
            //return this.toJSON();
            //return objects;
        }

    });

    app.PeoplePictureCollection = new PeoplePictureCollection();

}());