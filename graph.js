var app = app || {};

$(function ($) {
    'use strict';

    app.GraphView = Backbone.View.extend({

        className : 'row-fluid',

        id : 'graphview',

        events : {

        },

        initialize : function () {
            var me = this;
            app.on('generalInfoLoaded', function () {

                //it should only work if the user is not logged in
                if (!app.User.isLoggedIn() && app.activeView === 'Graph') {

                    // check if the loaded profile claimed?
                    var userAccount = app.LGRouter.masterView.generalInfoView.model.toJSON();

                    //if not claimed then show the popup
                    if (!userAccount.isClaimed) {
                        //Show popup;
                        //this.showOnboardModal();
                        window.onboardTimer = setTimeout(me.showOnboardModal, 5000);
                    }
                }
            });
        },

        showOnboardModal : function () {
            if (app.activeView !== 'Graph') {
                clearTimeout(window.onboardTimer);
                return;
            }
            // check if the loaded profile claimed?
            var userAccount = app.LGRouter.masterView.generalInfoView.model.toJSON();

            var onboardView = new app.Views.Onboard({ //TODO : Memory hog
                model : new Backbone.Model({
                    name : userAccount.name
                })
            });
            
            var view = (userAccount.entityType === 'Organization') ?
                    'orgTemplate' : undefined;
            
            $("#mm").html(onboardView.render(view).el).modal({
                backdrop : 'static',
                keyboard : 'false',
                show : 'true'
            });
        },

        render : function () {
            var me = this;

            me.$el.html("<div id='chart' class='span10'></div>");
            me.createOutline();
            me.createBreadcrumb();

            return me;
        },

        createBreadcrumb : function () {
            app.GraphBreadcrumbCollection = new Backbone.Collection();

            var breadcrumb = new app.Views.GraphBreadcrumb({
                collection : app.GraphBreadcrumbCollection
            });

            this.$el.find("#chart").append(breadcrumb.render().el);
        },

        createOutline : function () {
            var outlineView = new app.OutlinesView({
                collection : app.PegboardItems
            });
            this.$el.append(outlineView.render().el);
        },


        generateGraph : function (options) {
/*

            //var graph_url = app.SERVER_URL + '/graph/?id=' + sessionStorage.getItem('activeItemId');
            var graph_url = app.SERVER_URL + '/graph/?id=' + localStorage.getItem('activeItemId');
            var w = 900,
                h = 600,
                node,
                link,
                root,
                colorscale = d3.scale.category10(),
                anchorNode;
*/

            var graph_url = app.SERVER_URL + '/graph/?id=' + sessionStorage.getItem('activeItemId');
            //var graph_url = app.SERVER_URL + '/graph/?id=' + localStorage.getItem('activeItemId');
            var w = 630,
                h = 530,
                node,
                link,
                root,
                colorscale = d3.scale.category10(),
                anchorNode;

            var labelAnchors = [],
                labelAnchorLinks = [];



            // Here we chosse force layout and setup some basic things
            var force = d3.layout.force()
                    .on("tick", tick)
                    .charge(function (d) {
                        return d.center ? -220 : -920;
                    })
                    .gravity(0.1)
                    .friction(0.55)
                    .linkDistance(140)
                    .size([w, h]);

            var vis = null, charSvg = $("#chart").find("svg");

            // if there's already a svg remove it
            if (charSvg || charSvg.length) {
                charSvg.remove();
            }

            var w = 960,
                h = 800


            // now we are adding the svg and set its width and height
            vis = d3.select("#chart").append("svg")

            //zooming capability
              .append("svg:svg")
                .attr("width", w)
                .attr("height", h)
                .attr("pointer-events", "all")
              .append('svg:g')
                .call(d3.behavior.zoom().scaleExtent([0.5, 100]).on("zoom", redraw))
              .append('svg:g');

            vis.append('svg:rect')
                .attr('width', w)
                .attr('height', h)
                .attr('fill', 'none')

                    //.attr("width", w)
                    //.attr("height", h);

            //allows for responsive design http://stackoverflow.com/questions/11942500/how-to-make-force-layout-graph-in-d3-js-responsive-to-screen-browser-size
            .attr("viewBox", "0 0 " + w + " " + h )
            .attr("preserveAspectRatio", "xMidYMid meet");


            //part of zooming
            function redraw() {

              vis.attr("transform",
                  "translate(" + d3.event.translate + ")"
                  + " scale(" + d3.event.scale + ")");
            }


            // we add a clipPath element to show images as circular
            vis.append("svg:clipPath")
                    .attr("id", "auxAvatarClip")
                    .append("svg:circle")
                    .style("stroke", "#FFF")
                    .attr("cx", "0")
                    .attr("cy", "0")
                    .attr("r", 20);

            // if we have a graph url we then fetch graph json data and update svg
            if (graph_url != '') {
                d3.json(graph_url, function (json) {

                    // Remove duplicate nodes
                    json.children = _.map(_.groupBy(json.children,function(doc){
                        // return doc.name // Get rid of duplicates if name is same
                        //return doc.image + " " + doc.name; // Get rid of duplicates if picture + name is the same

                        //return doc.image

                        if(doc.id!=null){
                            return doc.id.$id.$id;
                        }
                        return doc.image + " " + doc.name;
                    }),function(grouped){
                        return grouped[0];
                    });



                    root = json;

                    if (root.id) {
                        app.GraphBreadcrumbCollection.add({
                            id    : root.id.$id.$id,
                            name  : root.name,
                            image : _.getProfilePic(root, true),
                            type  : 'root'
                        });
                    }

                    root.fixed = true;
                    root.x = w / 2;
                    root.y = h / 2;
                    update();
                });
            }


            function update() {

                // Remove loading image
                $("#chart").css("background-image", "none");

                var nodes = flatten(root),
                        links = d3.layout.tree().links(nodes);

                // Restart the force layout.
                force
                        .nodes(nodes)
                        .links(links)
                        .start();

                // Update the links…
                link = vis.selectAll("line.link")
                        .data(links, function (d) {
                            return d.target.id;
                        });

                // Enter any new links.
                link.enter().insert("line", ".node")
                        .attr("class", "link")
                        .style("stroke-width", function (d) {
                            return 2
                            //return d.target.strength / 2;
                        })
                        .attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });

                // Exit any old links.
                link.exit().remove();

                // nodes / circles updates
                node = vis.selectAll("g.node")
                        .data(force.nodes());

                // add a group to group circle and image
                node.enter().append("svg:g")
                        /*.attr("transform", function (d) {
                            return "translate(10,10)";
                        })
                        */
                        .attr("class", "node")
                        .on('click', click)
                        /*.call(force.drag)*/;

                /*
                node.append("text")
                        .attr("dx", 20)
                        .attr("dy", "-10")
                        .text(function (d) {
                            return d.name
                        });
                */

                // set up circle portrait with clipping just to the pic
                var circle_portrait = node.append("g").attr("class", "circle-portrait");

                // adding the user/company image and set up basic things
                circle_portrait.append("image")
                        .attr("clip-path", "url(#auxAvatarClip)")
                        .attr("xlink:href", function (d) {
                            return _.getProfilePic(d, true);
                        })
                        .attr("x", -40)
                        .attr("y", -40)
                        .attr("width", "80px")
                        .attr("height", "80px");

                // adding the circle and set up basic things
                circle_portrait
                        .append("svg:circle")
                        .attr("class", "aux-border")
                        .attr("cx", "0")
                        .attr("cy", "0")
                        .attr("r", 20)
                        .style("stroke", color);

                node.exit().remove();


                //// Make label force layout

                _.each(node[0], function(row) {
                    labelAnchors.push({node: row.__data__})
                    labelAnchors.push({node: row.__data__})

                    labelAnchorLinks.push({
                        source: row.__data__.index * 2,
                        target: row.__data__.index * 2 + 1,
                        weight: 1
                    })

                })

                //console.log("labelAnchors", labelAnchors)



                var force2 = d3.layout.force()
                .gravity(0.15)
                .linkDistance(1)
                .linkStrength(0.99)
                .charge(function(d,i){
                    if(i % 2 == 0){
                        return 0
                    }
                    else {
                        return -625
                    }

                })
                .size([w,h])
                .friction(0.35)

                force2
                .nodes(labelAnchors)
                .links(labelAnchorLinks)
                .start();

                anchorNode = vis.selectAll("g.anchorNode")
                .data(force2.nodes())
                .enter()
                .append("svg:g")
                .attr("class", "anchorNode")
                .attr("transform", "translate(40, 50)")

                anchorNode.append("svg:rect")
                .style("fill", "#333333")
                .style("opacity", 0.8)
                .attr("rx", 4)
                .attr("ry", 4)

                anchorNode.append("svg:text").text(function(d, i) {
                    return i % 2 == 0 ? "" : d.node.name
                })
                .style("text-shadow", "0 1px 0 #333333")
                .style("fill", "#ffffff")
                .style("font-family", "Arial")
                .style("font-size", 8)
                .style("text-anchor", "middle")
                .style("font-weight", "normal")

                .each(function(d) { var bbox = this.getBBox(); d.bbox = bbox; });


                anchorNode.selectAll("rect")
                .attr("width", function(d){  if(d.bbox.width > 2) { return d.bbox.width + 4} })
                .attr("height", function(d){ if(d.bbox.width > 2) { return d.bbox.height + 4} })
                .attr("transform", function(d) { return "translate("+(-(d.bbox.width/2) - 2)+", -10)" } )

            }

            function tick() {
                link.attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                var updateNode = function() {
                    this.attr("transform", function(d) {
                        return "translate(" + ( d.x ) + "," + ( d.y + 10 ) + ")";
                    });
                }


                anchorNode.each(function(d,i){
                    //console.log("anchorNode>", d)
                    //console.log("THIS", this)

                    if(i % 2 == 0) {
                        d.x = d.node.x;
                        d.y = d.node.y;
                    } else {
                        var b = this.getBBox();

                        var diffX = d.x - d.node.x;
                        var diffY = d.y - d.node.y;

                        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                        var shiftX = b.width * (diffX - dist) / (dist * 2);
                        shiftX = Math.max(-b.width, Math.min(0, shiftX));
                        var shiftY = 10;
                        this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                    }


                })

                anchorNode.call(updateNode);

            }

            // Color leaf nodes orange, and packages white or blue.
            function color(d) {
                var mapping = {
                    "employer"           : "#31bd6c",
                    "employee"           : "#31bd6c",
                    "officer"            : "#31bd6c",
                    "founder"            : "#31bd6c",
                    "student"            : "#31bd6c",
                    "teacher"            : "#31bd6c",
                    "investor"           : "#31bd6c",
                    "inventor"           : "#31bd6c",
                    "board of directors" : "#31bd6c",
                    "partner"            : "#31bd6c",
                    "principal"          : "#31bd6c",
                    "associate"          : "#31bd6c",
                    "owner"              : "#31bd6c",
                    "organizer"          : "#31bd6c",
                    "sponsor"            : "#31bd6c",
                    "donor"              : "#31bd6c",
                    "venture capitalist" : "#31bd6c",
                    "vc"                 : "#31bd6c",
                    "angel investor"     : "#31bd6c",
                    "angel"              : "#31bd6c",
                    "director"           : "#31bd6c",
                    "contributor"        : "#31bd6c",
                    "co-founder"         : "#31bd6c",
                    "blogger"            : "#31bd6c",
                    "reporter"           : "#31bd6c"
                };
                return (!_.isEmpty(d.type) && !_.isEmpty(mapping[d.type.toLowerCase()]))  ?
                        mapping[d.type.toLowerCase()] : "#3182bd";
            }

            // Toggle children on click.
            function click(d) {
                // d.center only true for root element
                if (d.center === undefined) {
                    app.LGRouter.navigate('/#graph/' + d.id.$id.$id, true);
                    app.trigger('graphNodeClick', d);
                }

                //update();
            }

            // Returns a list of all nodes under the root.
            function flatten(root) {
                var nodes = [], i = 0;


                function recurse(node) {

                    node.image =  _.getProfilePic(node, true);
                    if (node.children) node.size = node.children.reduce(function (p, v) {

                        return p + recurse(v);
                    }, 0);


                    if (!node.id) node.id = ++i;
                    nodes.push(node);


                    return node.size;
                }


                root.size = recurse(root);
                return nodes;
            }
        }
    });
});
