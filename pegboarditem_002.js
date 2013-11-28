var app = app || {};

(function() {
	'use strict';
	
	app.PegboardItem = Backbone.Model.extend({
        
		defaults: {
            collectionName : 'app.PegboardItems'
		}
	});

}());
