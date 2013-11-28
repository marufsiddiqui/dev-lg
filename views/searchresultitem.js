var app = app || {};

$(function ($) {
    'use strict';
    
    app.SearchResultItemView = Backbone.View.extend({
            
    	className : "results-item",
        
        template : _.template($("#searchResultItemTemplate").html()),        
    	
    	events : {
            "click #searchResultItemTemplateFollow":"onFollowClick",
    		'click a' : "onClickResultItem"
    	},
    	
    	initialize : function () {
            this.model.on('reset', this.render, this);
            this.model.on('change', this.render, this);
    	},

        onFollowClick:function(e){
            e.preventDefault();
            //app.LGRouter.masterView.followWork(this.model,this.$("#outlineItemTemplateFollow"));
            this.followWork(this.model,this.$("#outlineItemTemplateFollow"));
        },
    	
    	render : function () {
            //console.log("item ",this.model.toJSON());
            this.$el.html("");
            this.$el.append(this.template(this.model.toJSON()));
    		return this;
    	},

        onClickResultItem : function () {
            //sessionStorage.setItem('activeItemId', this.model.get('id'));
        },

        followWork:function(model,$curTarget){
            var options, id, url, col, entityType;

            id=model.get("id");
            entityType = 'lg';
            url = app.SERVER_URL + '/lg/follow';
            if(typeof(id)=="undefined" || id==""){
                return;
            }

            if(model.get("col")=="People"){
                col="people";
            } else{
                col="org";
            }

            options = {
                url        : url,
                data       : {
                    "id"    : id,
                    col   : col,
                    token : app.User.get('userToken')
                },
                $el        : $curTarget,
                actionType : "Follow",
                entityType : entityType
            };

            var me = this;


            $.ajax({
                type : 'post',
                url  : options.url,
                data : options.data
            })
                .done(function (response, status, jqXHR) {
                    //app.LGRouter.masterView.postSuccess(response, status, jqXHR, options);
                    console.log("mm ",me.model);
                    //me.render();
                    console.log("ff ",me.$el.find("#searchResultItemTemplateFollow"));
                    me.$el.find("#searchResultItemTemplateFollow").addClass("disabled");
                    me.$el.find("#searchResultItemTemplateFollow").html("Following");
                })
                .fail(function (jqXHR, status, errorMsg) {
                 //   app.LGRouter.masterView.postFail(jqXHR, status, errorMsg, options)
                })
                .always(function () {
                  //  app.performingAction = false;
                });

        }
    });

});