var app = app || {};

$(function ($) {
    'use strict';
    
    app.OutlineItemView = Backbone.View.extend({
            
    	className : "item",
        
        template : _.template($("#outlineItemTemplate").html()),        
    	
    	events : {
            "click #outlineItemTitle":"onTitleClick",
            "click #outlineItemContributor":"onContributorClick",
            "click #outlineItemTemplateShared":"onSharedClick",
            "click #outlineItemTemplateFollow":"onFollowClick",
            "click #outlineItemTemplateShare" :"onShareClick",
            "click #outlineItemTemplateLike" :"onLikeClick",
            "click #outlineItemTemplateComment":"onCommentClicked"

    	},

        onShareClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.shareWork(this.model,this.$("#outlineItemTemplateShare"));
        },

        onFollowClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.followWork(this.model,this.$("#outlineItemTemplateFollow"));
        },

        onLikeClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.likeWork(this.model,this.$("#outlineItemTemplateLike"));
        },

        onSharedClick:function(e){
            e.preventDefault();
            app.LGRouter
                .masterView.peopleList
                .addAllPeople("Shared List",this.model.share_ids,false);

        },

        onCommentClicked:function(e){
            e.preventDefault();
            app.LGRouter.masterView.commentFeed(this.model,this.$("#outlineItemTemplateComment"));
        },

        onTitleClick : function (e) {
            e.preventDefault();
            var url=this.model.get("web_url");

            console.log(this.model);


            console.log("ok "+url);
            if(url!=null && url!="N/A"){
                var win = window.open(url,"_blank");
            }else{
                app.LGRouter.showNote(this.model.get("id"));
            }

        },

        onContributorClick : function (e){
            console.log("asd");
            e.preventDefault();
            var model=this.model;
            console.log(model);
            if(model.get("contributor_id")!=null){
                app.LGRouter.navigate("/#graph/" + model.get("contributor_id"), true);
            }

        },



        initialize : function () {
            this.model.on('reset', this.render, this);
            this.model.on('change', this.render, this);
        },
    	
    	render : function () {
            var summary=this.model.get("summary");
            this.model.set("dot","");
            if(summary.length> 200){
                summary=summary.substring(0,200);
                summary=summary+"";
                this.model.set("dot","...");

            }
            this.$el.html("");
            this.$el.append(this.template(this.model.toJSON()));
    		return this;
    	}


    });

});