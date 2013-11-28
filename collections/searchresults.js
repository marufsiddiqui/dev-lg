var app = app || {};

(function () {
    "use strict";

    var SearchResults = Backbone.Collection.extend({
        query : '',
        prevQuery : '',

        model : app.SearchItem,

        parse : function (response, xhr) {
            if (response.error) {
                return;
            }
            var me = this;
                me.total = response.total_count;
                me.loaded += response.data.length;
            
            return _.map(response.data, function (obj) {
                /**
                 * career is a array of object. so we are assuming that the
                 * first item in the array is the current job
                 */
                var job, _ref;

                job = _.getDefaultJob(response.data);

                return {
                    profilePic   : _.getProfilePic(obj),
                    name         : _.isValid(_ref = obj.name) ? _ref : 'N/A',
                    jobTitle     : job.title,
                    jobLocation  : job.location,
                    id           : _.isValid(_ref = obj._id.$id) ? _ref : '0',
                    follower_ids : _.isValidArray(_ref = obj.follower_ids) ? _ref : [],
                    bioSummary   : _.isValid(_ref = obj.bio_summary) ? _ref : 'N/A',
                    col   : _.isValid(_ref = obj.col) ? _ref : 'N/A',
                    entityType:"lg"
                };
            });
        },

        url : function () {
            return app.SERVER_URL + '/search/?q=' + this.query + "&page_num=" + this.pageNum;
        },
        
        initialize : function () {
            var me = this;
            me.pageNum = 1;
            me.itemCount = 0;
            me.loaded = 0;
            
            me.on('queryChanged', function () {
                if (me.query !== me.prevQuery) {
                    me.prevQuery = me.query;
                    me.loaded = 0;
                }
            })
        },
        
        activeItemId : function () {
            return sessionStorage.getItem('activeItemId');
            //return localStorage.getItem('activeItemId');
        },
        
        nonActiveItems : function () {
            var me = this;
            return me.filter(function (item) {
                return item.get('id') !== me.activeItemId();
            });
        }
    });

    app.SearchResults = new SearchResults();
}());