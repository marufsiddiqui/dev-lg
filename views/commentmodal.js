var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Comment = Backbone.View.extend({

        tagName : 'li',
        
        className : 'clearfix',

        template : _.template($("#commentItemTemplate").html()),

        render : function () {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        }

    });

    app.Views.CommentsCollection = Backbone.View.extend({

        initialize : function () {
            var me = this, collection = me.collection;

            collection.on('add', me.addAll, me);
            collection.on('reset', me.addAll, me);
        },

        render : function () {
            this.addAll();
            return this;
        },

        addOne : function (comment) {
            var view = new app.Views.Comment({ model : comment });
            this.$el.append(view.render().el);
        },

        addAll : function () {
            var me = this;

            me.$el.html('');

            if (me.collection.length) {
                me.collection.each(this.addOne, this);
            } else {
                me.$el.html('<li style="list-style:none;">No Comments Yet</li>');
            }
        }

    });

    app.Views.CommentModal = Backbone.View.extend({
        
        className : "modal hide fade",
        
        id : 'commentsModal',
        
        template : _.template($("#commentsModalTemplate").html()),

        events : {
            'click #postComment'             : "onClickPostComment",
            'keypress #appendedInputButtons' : 'onEnterPostComment'
        },

        initialize : function () {
            var me = this;
            _.bindAll(me, 'onClickPostComment', 'onEnterPostComment', 'postComment', 'onShow', 'render');
            me.$el.on('show', me.onShow);
            me.$el.on('hide', me.onHide);
            me.model.on('change', me.render);
            //me.render();
        },

        onHide : function () {
            app.performingAction = false;
        },

        onShow : function () {
            var me = this;

            //only instanciate it once
            if (!me.commentsList) {
                me.commentsList = new app.Views.CommentsCollection({
                    collection : app.Collections.Comments,
                    el         : me.$el.find('ul')
                });
            }

            me.commentsList.$el.html('<li style="text-align: center">Loading.....</li>');

            //setup collection URL
            me.commentsList.collection.setURL();

            //now fetch
            me.commentsList.collection.fetch();
        },

        render : function () {
            var data = this.model.toJSON();
            if (!data.hasOwnProperty('image') ) {
                data.image = 'images/default-user.png';
            }
            this.$el.html(this.template(data));
            return this;
        },

        onEnterPostComment : function (e) {
            if (e.which === ENTER_KEY ) {
                this.postComment(e);
            }
        },

        onClickPostComment : function (e) {
            e.preventDefault();
            this.postComment(e);
        },

        lastMessage:"",

        postComment : function (e) {
            var me = this, data, collection = me.collection, url;
            var $input = me.$el.find('input');
            var message = $.trim($input.val());

            if (_.isEmpty(message)) {
                alert('Please write something');
            } else if(this.lastMessage!=message) {
                this.lastMessage=message;
                _.disableForm(me.$el);
                //prepare the data
                
                data = new app.Models.Comment();
                
                data.set('userId', localStorage.getItem("userId"));
                data.set('message', message);

                data.set('id', this.collection.currentLGEID);
                data.set('token', app.User.get('userToken'));
                data.set('profilePic', app.User.get('image'));
                data.set('name', app.User.get('name'));


                url = app.SERVER_URL + '/lge/comment';

                //now post it to server
                $.ajax({
                    type : 'POST',
                    url  : url,
                    data : data.toJSON()
                })
                    .done(function (response, textStatus, jqXHR) {
                        me.lastMessage="";
                        _.enableForm(me.$el);
                        response = _.isObject(response) ? response : $.parseJSON(response);
                        if (response.success) {
                            delete data.id; //TODO: very nasty thing. I'm removing the id as collection thinks its duplicate data

                            console.log("inn");
                            app.LGRouter.masterView.updateTimeLine();
                            $input.val("");
                            //add the message to collection
                            me.commentsList.collection.add(data);
                            
                            app.trigger('newCommentAdded', response, textStatus, jqXHR, {
                                $el : me.collection.currentLGEEl,
                                actionType : 'comment' 
                            });


                            //reset input
                            $input.val('');
                        } else {
                            console.log('error');
                        }

                    })
                    .fail(me.postFail)
                    .always(me.postAlways);
            }
        },

        postFail : function (jqXHR, textStatus) {
            alert('error occured');
        },

        postAlways : function () {
            app.performingAction = false;

        }
    });
});