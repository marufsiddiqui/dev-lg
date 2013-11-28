var app = app || {};

(function() {
	'use strict';
	
	app.Models.ContributorFeedItem = Backbone.Model.extend({
        
		defaults: {
            collectionName : 'app.Collections.Contributor'
		}
	});

}());
