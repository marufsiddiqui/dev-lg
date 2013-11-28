var app = app || {};

(function () {
    "use strict";
    
    var PegboardItems = Backbone.Collection.extend({
        model: app.PegboardItem,
        
        //TODO : duplicate code with bioentries, need 2 find a better way
        parse : function (response, xhr) {

            if (response.error) {
                return;
            }
            
            var me = this;

            me.total = response.total_count;
            me.loaded += response.data.length;
            
            return _.parse.call(me, response);
        },

        fetch : function (options) {
            // Only if you don't want to send requests concurrently
            if (!sessionStorage.getItem('activeItemType') && this._fetching) return;
           // if (!localStorage.getItem('activeItemType') && this._fetching) return;
            this._fetching = true;
            var self = this;
            var xhr = Backbone.Collection.prototype.fetch.call(this, options);
            xhr.always(function (res, msg, xhr) {
                self._fetching = false;
            });
        },
        
        initialize : function () {
            var me = this;
            me.pageNum = 1;
            me.itemCount = 0;
            me.loaded = 0;

            /*me.on('queryChanged', function () {
                if (me.query !== me.prevQuery) {
                    me.prevQuery = me.query;
                    me.loaded = 0;
                }
            })*/
        },
        
        url : function () {
            var activeItemType = sessionStorage.getItem('activeItemType') ? sessionStorage.getItem('activeItemType') : 'people';
            //var activeItemType = localStorage.getItem('activeItemType') ? localStorage.getItem('activeItemType') : 'people';
            return app.SERVER_URL + '/lge?id1='
                    + app.SearchResults.activeItemId()
                    + "&id1_type=" + activeItemType
                    + "&per_page=12"
                    + "&page_num=" + this.pageNum;
        } 
    }); 
    
    app.PegboardItems = new PegboardItems();
}());