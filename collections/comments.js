var app = app || {};

(function () {
    "use strict";

    var Comments = Backbone.Collection.extend({
        model : app.Models.Comment,
        parse : function (response, xhr) {
            if (response.error) {
                return;
            }
            return _.map(response.results.data, function (obj) {
                var profilePic='images/default-user.png';

                //console.log("res ",obj);
                if(obj.user.image!=null
                    && obj.user.image.original!=null){
                    profilePic=obj.user.image.original;
                }

                var time=app.Utils.getDate(obj.timestamp);
                //console.log("nw time ",time);
                return {
                    //profilePic : obj.user ? (obj.user.image ? obj.user.image : 'images/default-user.png') : '',
                    profilePic : profilePic,
                    userId     : obj.user ? (obj.user._id.$id ? obj.user._id.$id : 'N/A') : '',
                    name       : obj.user ? (obj.user.name ? obj.user.name : 'N/A') : '',
                    //time       : obj.timestamp ? _.formatTime(obj.timestamp) : 'N/A',
                    time       : obj.timestamp ? time : 'N/A',
                    message    : obj.message ? obj.message : 'N/A'
                };
            });
        },

        initialize : function () {
            var me = this;

            me.currentLGEID = null;
            me.currentLGEEl = null;
        },

        setURL : function () {
            var me = this;
            me.url = app.SERVER_URL + '/lge/' + me.currentLGEID + '/comments?per_page=1000';
        }

    });

    app.Collections.Comments = new Comments();
}());