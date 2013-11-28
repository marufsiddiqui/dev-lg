var app = app || {};

$(function ($) {
    'use strict';

    app.Views.Contributor.ModerationItem = Backbone.View.extend({

        className : "item noteboard span4",

        template : _.template($("#moderationItemTemplate").html()),


        events : {
            "click #moderationItemTemplateTitle":"onTitleClick",
            "click #moderationItemTemplateAccept":"onAcceptClick",
            "click #moderationItemTemplateReject":"onRejectClick"

        },

        onAcceptClick : function (e) {
            e.preventDefault();

            var url=app.SERVER_URL +"/lge/moderation_update_status/"+
                //localStorage.getItem("userId")+
                this.model.get("id")+
                "/?token="+app.User.get('userToken')+
                "&accept=1";
            this.ajaxCall(url);


        },

        onRejectClick : function (e) {
            e.preventDefault();

            var url=app.SERVER_URL +"/lge/moderation_update_status/"+
                //localStorage.getItem("userId")+
                this.model.get("id")+
                "/?token="+app.User.get('userToken')+
                "&accept=0";
            this.ajaxCall(url);

        },

        ajaxCall:function(urlCall){
            var me=this;
            $.ajax({
                type : 'post',
                url  : urlCall
            })
                .done(function (response, status, jqXHR) {
                    me.el.remove();
                })
                .fail(function (jqXHR, status, errorMsg) {

                })
                .always(function () {

                });

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