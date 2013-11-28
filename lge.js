var app = app || {};

(function () {
    'use strict';

    app.Models.LGE = Backbone.Model.extend({

        defaults : {
        },
        
        validate : function (attributes) {
            var attrs = attributes.lge_data;
            var errors = [];

            if (!attrs.title) {
                errors.push({name : 'lge_title', message : 'Please enter a title.'});
            }
            if (!attrs.primary_people_ids.length && !attrs.primary_org_ids.length) {
                errors.push({name : 'lge_person', message : 'Please add a person / company.'});
            }
            if (!attrs.timestamp) {
                errors.push({name : 'lge_date', message : 'Please add a date.'});
            }
            
            /*if (!attrs.lge_person_email) {
                errors.push({name : 'lge_person_email', message : 'Please enter email address.'});
            } else if (!_.isValidEmailAddress(attrs.lge_person_email)) {
                errors.push({name : 'lge_person_email', message : 'Please enter an valid email address.'});
            }*/
            
            if (!attrs.details) {
                errors.push({name : 'lge_new_post_message', message : 'Please fill summary description field.'});
            } else if (attrs.details.length > 1000) {
                errors.push({name : 'lge_new_post_message', message : 'Please fill summary description within 1000 characters.'});
            }

            if (!_.isEmpty(errors)) return errors;
            //return true;
        }
    });

}());
