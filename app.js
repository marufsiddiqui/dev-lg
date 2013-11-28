var ENTER_KEY = 13;

_.extend(app, Backbone.Events, {});
app.SERVER_URL = 'http://dev-api.lg.horoppa.com';
app.WP_URL = 'http://stage-wp.lg.horoppa.com';

$(function(){
    //new app.HomeView();
    app.LGRouter.start();
});
