var app = app || {};

(function () {
    "use strict";

    var ContributorCollection = Backbone.Collection.extend({
        model : app.Models.ContributorFeedItem,

        //TODO : duplicate code with bioentries, need 2 find a better way
        parse : function (response, xhr) {

            if (response.error) {
                return;
            }
            
            var me = this;
            
            me.total = response.total_count;
            me.loaded += response.data.length;


            app.trigger('feedData', response);

            return _.parse.call(me, response);
        },

        initialize : function () {
            this.iniCollection();
        },

        iniCollection:function(){
            var me = this;
            me.pageNum = 1;
            me.itemCount = 0;
            me.loaded = 0;
        },

        url : function () {
            return app.SERVER_URL + '/lge/all?token='
                    + app.User.get('userToken')
                    + "&per_page=11"
                    + "&page_num=" + this.pageNum;
        }
    });

    app.Collections.Contributor = new ContributorCollection();
}());