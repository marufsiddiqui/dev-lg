var app = app || {};

(function() {
    'use strict';

    app.Models.ModerationRequestItem = Backbone.Model.extend({

        defaults: {
            collectionName : 'app.Collections.ModerationRequest'
        }
    });

}());
