

var app = app || {};

(function() {
    'use strict';

    var NoteViewModel = Backbone.Model.extend({

        defaults: {
            collectionName: "app.PegboardItems",
            comment_ids: [],
            comments: 0,
            contributor_id: "",
            contributor_image: "",
            contributor_name: "N/A",
            dot: "",
            follower: 0,
            follower_ids: [],
            hostname: "N/A",
            id: "",
            like: 0,
            like_ids: [],
            name: "",
            profilePic: "img/photo-default.png",
            share: 0,
            share_ids: [],
            summary: "N/A",
            time: "N/A",
            title: "test",
            web_url: ""
        }
    });
    app.NoteDetailModel= new NoteViewModel();

}());
