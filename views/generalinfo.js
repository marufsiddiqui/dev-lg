var app = app || {};

$(function( $ ) {
	'use strict';

    app.BasicView = Backbone.View.extend({

        initialize : function () {
            var me = this;
            app.on('userLoggedIn', me.render, me);
            app.on('userLogOut', me.render, me);
            me.model.on('change', me.render, me);
        },

        render : function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    
	app.GeneralInfoView = Backbone.View.extend({
        
        id : 'generalinfo',
		
        template : _.template($("#generalInfoTemplate").html()),
        
		events : {
            'click .follow' : "onClickFollow",
            'click .contribute' : "onClickContribute"
		},
		
		initialize : function () {
            var me = this;
            app.on('userLoggedIn', me.render, me);
            app.on('userLogOut', me.render, me);
            me.model.on('change', me.render, me);
        },

        onClickFollow : function (e) {
            app.trigger('followClick', e);

        },

        onClickContribute : function (e) {
            e.preventDefault();
            if ( !app.User.isLoggedIn() ) {
                app.trigger('showLoginModal', "You need to be logged in to contribute");
                return;
            }
            sessionStorage.setItem('prefill', 1);
            //localStorage.setItem('prefill', 1);
            app.LGRouter.navigate("/#contributor/" + app.User.get('userId') + "/postnew");
        },
		
		render : function () {

            this.$el.html( this.template(this.model.toJSON()) );
            return this;
		}
	});
    
    app.Views.TimelineFollowActionBar = app.BasicView.extend({
        id : 'timelineAction',
        template : _.template($("#timelineFollowActionBarTemplate").html()),
        render : function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});