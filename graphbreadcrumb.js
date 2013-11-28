/**
 * Created by JetBrains PhpStorm.
 * User: Maruf
 * Date: 1/16/13
 * Time: 2:53 PM
 *
 */
var app = app || {};

$(function ($) {
    'use strict';

    app.Views.GraphBreadcrumb = Backbone.View.extend({

        id : "bc",

        tagName : "ul",

        events : {
            'click a' : 'onClickLink'
        },

        initialize : function () {
            var me = this, col = me.collection;

            _.bindAll(me, 'render');

            app.on('graphNodeClick', function (d) {
                var models = col.where({id : d.id.$id.$id}), modelsToRemove;
                if (models.length) { //items already on the list so dont add it
                    var index = col.indexOf(models[0]);

                    modelsToRemove = col.filter(function (model) {
                        return col.indexOf(model) > index;
                    });

                    col.remove(modelsToRemove);
                } else {
                    col.push({
                        id    : d.id.$id.$id,
                        name  : d.name,
                        image : d.image,
                        type  : 'children'
                    });
                }
            });

            col.on('add', me.addAll, me);
            col.on('remove', me.addAll, me);
            app.on('activeItemChanged', me.addAll, me);
        },

        onClickLink : function (e) {
            app.trigger('graphNodeClick', {
                id : {
                    $id : {
                        $id : $(e.currentTarget).parent().data('id')
                    }
                }
            });
        },

        render : function () {
            var me = this;
            me.addAll();
            return me;
        },

        addOne : function (trail, i) {
            var id = trail.get('id');
/*

            //var cls = (sessionStorage.getItem('activeItemId') === id) ? "hide" : '';
            var cls = (localStorage.getItem('activeItemId') === id) ? "hide" : '';
*/


            var cls = (sessionStorage.getItem('activeItemId') === id) ? "hide" : '';
            //var cls = (localStorage.getItem('activeItemId') === id) ? "hide" : '';

            var el = "<li class='" + cls +
                    "' data-id='" + id + "'>" +
                    "<a href='" + "/#graph/" + id + "'><img src='" +
                    trail.get("image") +
                    "' alt='" +
                    trail.get("name") +
                    "' />" +
                    "</a>" +
                    "</li>";
            this.$el.append(el).show();
        },

        addAll : function () {
            var me = this;

            me.$el.html('');
            me.collection.each(me.addOne, me);
        }

    });

});

