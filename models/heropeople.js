var app = app || {};

(function() {
	'use strict';
	
	app.Models.HeroPeople = Backbone.Model.extend({
        
		defaults: {},
        
        parse : function (response, xhr) {
            
            if (response.error) {
                return;
            }
            
            var data, typeMap;
            data = response.data;  
            data.entityType = response.col;

            typeMap = {
                people       : 'people',
                organization : 'org'
            };
            
            //set col attribute for LG
            sessionStorage.setItem('activeItemType', typeMap[response.col.toLowerCase()]);
            localStorage.setItem('activeItemType', typeMap[response.col.toLowerCase()]);

            return _.parseUser.call(this, data);
        },
        
        url : function () {
            return app.SERVER_URL + '/lg/' + this.id;  
        },
        
        initialize : function () {

            var me = this;
            
            _.bindAll(this, "setId");
            
            me.setId();
            
            // when activeItemChanged event triggered
            app.on('activeItemChanged', me.setId);
            
            // if id changes then refetch item
            me.on('change:id', function () {
                me.fetch(me.url).then(function () {
                    app.trigger('generalInfoLoaded');
                });
            });
        },
        
        setId : function () {
            this.set('id', sessionStorage.getItem('activeItemId'));
            //this.set('id', localStorage.getItem('activeItemId'));
        }
	});

}());
