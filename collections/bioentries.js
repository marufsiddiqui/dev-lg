var app = app || {};

(function () {
    "use strict";

    var BioEntries = Backbone.Collection.extend({
        model : app.BioEntry,
        url   : function () {
            return app.SERVER_URL + '/ticker?per_page=4';
        },
        parse : function (response, xhr) {

            if (response.error) {
                return;
            }

            return _.parse.call(this, response);
        }
    });

    app.BioEntries = new BioEntries();
}());