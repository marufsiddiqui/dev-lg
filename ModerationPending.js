var app = app || {};

(function () {
    "use strict";

    var ModerationPendingCollection = Backbone.Collection.extend({
        model : app.Models.ModerationRequestItem,

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
            if ( this._fetching) return;

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

        },

        url : function () {
            return app.SERVER_URL + '/lge/moderation_outgoing?token='
            //return app.SERVER_URL + '/lge/all?token='
                + app.User.get('userToken')
                + "&per_page=11"
                + "&page_num=" + this.pageNum;
        }
    });
    app.Collections.ModerationPending = new ModerationPendingCollection();
}());