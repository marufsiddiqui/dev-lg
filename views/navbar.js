var app = app || {};

$(function( $ ) {
	'use strict';
    
	app.NavBarView = Backbone.View.extend({
        
        id : 'topNavbar',
	        
		className : "navbar navbar-fixed-top",
		
        template : _.template($("#navbarTemplate").html()),
        
		events : {
            'submit form' : "submitForm",
            'click #logoutBtn' : "onClickLogoutBtn"
		},
		
		initialize : function () {
            var me = this;
            _.bindAll(me, "onUserLoggedIn", "onUserLogOut", "render");
			app.on('userLoggedIn', me.onUserLoggedIn);
			app.on('userLogOut', me.onUserLogOut);
            me.model.on('change', me.render)
		},
		
		render : function () {
            var data = this.model.toJSON();
            if (!data.hasOwnProperty('userId')) {
                data.userId = 0;
                data.name = 'N/A';
            }
            this.$el.html( this.template(data) );
            return this;
		},
		
        submitForm : function (event) {
            event.preventDefault();
            app.trigger('submitForm', event, this);            
            return false;
        },

        onUserLoggedIn : function () {
            var me = this;
            
            me.$el.find('[id^=log]').hide();
            me.$el.find("#logoutBtn").css('display', 'block');
        },
        
        onUserLogOut : function () {
            var me = this;
            
            me.$el.find('[id^=log]').hide();
            me.$el.find("#loginBtn").css('display', 'block');
        },

        onClickLogoutBtn : function (e) {
            e.preventDefault();
            app.User.logout();
        }
	});
});