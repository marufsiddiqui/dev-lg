var app = app || {};

(function() {
	'use strict';
	
	app.BioEntry = Backbone.Model.extend({
        
		defaults: {
            collectionName : 'app.BioEntries'
            /*like
            share
            follow
            time
            name
            content
            profilePic*/
		}
	});

}());
