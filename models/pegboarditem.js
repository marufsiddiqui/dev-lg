var app = app || {};

$(function ($) {
    'use strict';
    
    app.PegboardItemView = Backbone.View.extend({
            
    	className : "item noteboard span4",
        
        template : _.template($("#pegboardItemTemplate").html()),        
    	

        events : {
            "click #pegboardItemTemplateTitle":"onTitleClick",
            "click #pegboardItemTemplateContributor":"onContributorClick",
            "click #pegboardItemTemplateShared":"onSharedClick",
            "click #pegboardItemTemplateFollow":"onFollowClick",
            "click #pegboardItemTemplateShare" :"onShareClick",
            "click #pegboardItemTemplateLike" :"onLikeClick",
            "click #pegboardItemTemplateComment":"onCommentClicked",

            "click #pegboardItemTemplateEdit":"onEditClicked"

        },

        onEditClicked:function(e){
            e.preventDefault();
            console.log("md ",this.model.get("id"));
            app.LGRouter.editNote(this.model.get("id"));
        },

        onShareClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.shareWork(this.model,this.$("#pegboardItemTemplateShare"));
        },

        onFollowClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.followWork(this.model,this.$("#pegboardItemTemplateFollow"));
        },

        onLikeClick:function(e){
            e.preventDefault();
            app.LGRouter.masterView.likeWork(this.model,this.$("#pegboardItemTemplateLike"));
        },

        onSharedClick:function(e){
            e.preventDefault();
            app.LGRouter
                .masterView.peopleList
                .addAllPeople("Shared List",this.model.share_ids,false);

        },

        onCommentClicked:function(e){
            e.preventDefault();
            app.LGRouter.masterView.commentFeed(this.model,this.$("#pegboardItemTemplateComment"));
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
            //$("#tabbarTemplate").remove();
            if(!this.model.editable){
                this.model.editable=false;
            }
            this.$el.html("");
            this.$el.append(this.template(this.model.toJSON()));
    		return this;
    	}
    	
    });

});