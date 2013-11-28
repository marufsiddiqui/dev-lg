var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

var app = app || {};
app.Utils = {
    prettyDate : function (date_str) {
        var time_formats = [
            [60, 'just now', 1],
            // 60
            [120, '1 minute ago', '1 minute from now'],
            // 60*2
            [3600, 'minutes', 60],
            // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'],
            // 60*60*2
            [86400, 'hours', 3600],
            // 60*60*24, 60*60
            [172800, 'yesterday', 'tomorrow'],
            // 60*60*24*2
            [604800, 'days', 86400],
            // 60*60*24*7, 60*60*24
            [1209600, 'last week', 'next week'],
            // 60*60*24*7*4*2
            [2419200, 'weeks', 604800],
            // 60*60*24*7*4, 60*60*24*7
            [4838400, 'last month', 'next month'],
            // 60*60*24*7*4*2
            [29030400, 'months', 2419200],
            // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'last year', 'next year'],
            // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400],
            // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'last century', 'next century'],
            // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];
        var time = ('' + date_str).replace(/-/g, "/").replace(/[TZ]/g, " ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if (time.substr(time.length - 4, 1) == ".") time = time.substr(0, time.length - 4);

        var seconds = (new Date - new Date(time)) / 1000;
        var token = 'ago', list_choice = 1;
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }

        /*var tmp=new Date().getTimezoneOffset();
        seconds = seconds + (tmp*60);*/
        var i = 0, format;

        if(seconds>=86400 || seconds<0){
            var temp=new Date();
            temp.getUTCSeconds(time);
            return temp.toDateString();
        }


        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    },
    getDate : function (timestamp) {

        var time_formats = [
            [60, 'just now', 1],
            // 60
            [120, '1 minute ago', '1 minute from now'],
            // 60*2
            [3600, 'minutes', 60],
            // 60*60, 60
            [7200, '1 hour ago', '1 hour from now'],
            // 60*60*2
            [86400, 'hours', 3600],
            // 60*60*24, 60*60
            [172800, 'yesterday', 'tomorrow'],
            // 60*60*24*2
            [604800, 'days', 86400],
            // 60*60*24*7, 60*60*24
            [1209600, 'last week', 'next week'],
            // 60*60*24*7*4*2
            [2419200, 'weeks', 604800],
            // 60*60*24*7*4, 60*60*24*7
            [4838400, 'last month', 'next month'],
            // 60*60*24*7*4*2
            [29030400, 'months', 2419200],
            // 60*60*24*7*4*12, 60*60*24*7*4
            [58060800, 'last year', 'next year'],
            // 60*60*24*7*4*12*2
            [2903040000, 'years', 29030400],
            // 60*60*24*7*4*12*100, 60*60*24*7*4*12
            [5806080000, 'last century', 'next century'],
            // 60*60*24*7*4*12*100*2
            [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
        ];


        if (timestamp === 0) {
            return "N/A";
        }
        var date, today, diff;
        if ( timestamp / 10000 > 1 ) {
            date = new Date(timestamp * 1000);
        } else {
            date = new Date(timestamp,1,1,1,1,1);
        }

        date.setTime(date.getTime());

        today = new Date();

        var diff= today  - date;

        var seconds=diff/1000;
        var i = 0, format;

        return date.toDateString();

        if(seconds>=86400 || seconds<0){
            return date.toDateString();
        }

        var token = 'ago', list_choice = 1;
        if (seconds < 0) {
            seconds = Math.abs(seconds);
            token = 'from now';
            list_choice = 2;
        }

        while (format = time_formats[i++])
            if (seconds < format[0]) {
                if (typeof format[2] == 'string')
                    return format[list_choice];
                else
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
            }
        return time;
    },
    strPad:function pad(str, len, pad, dir) {
        if (typeof(len) == "undefined") {
            var len = 0;
        }
        if (typeof(pad) == "undefined") {
            var pad = ' ';
        }
        if (typeof(dir) == "undefined") {
            var dir = STR_PAD_RIGHT;
        }

        if (len + 1 >= str.length) {

            switch (dir) {

                case STR_PAD_LEFT:
                    str = Array(len + 1 - str.length).join(pad) + str;
                    break;

                case STR_PAD_BOTH:
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                    break;

                default:
                    str = str + Array(len + 1 - str.length).join(pad);
                    break;

            } // switch

        }

        return str;


    }
};
/**
 * Underscorejs mixin
 */
_.mixin({
    /**
     * Simple Function for capitalize
     * 
     * @param string
     * @return {String}
     */
    capitalize : function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    },

    /**
     * Helper function for getting location
     * 
     * @param href
     * @return {HTMLElement}
     */
    getLocation : function (href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    },

    /**
     * Helper function for determining if a specific action has been taken already
     * 
     * @param haystack
     * @param app
     * @return {Number}
     */
    isActionTaken : function (haystack, app) {
        //var userId = sessionStorage.getItem('userId'), obj;
        var userId = localStorage.getItem('userId'), obj;

        if ( !_.isEmpty(userId) ) {
            obj = _.find(haystack, function (item) {
              //  console.log(item);
               // var id = _.isUndefined(item.$id) ? item._id.$id : item.$id;
                //var id = _.isUndefined(item.$id) ? item.id.$id : item.$id;

                if(! _.isUndefined(item.$id)){
                    id=item.$id;
                }else if(! _.isUndefined(item._id)
                    && ! _.isUndefined(item._id.$id)){
                    id=item._id.$id;
                } else {
                    id=item.id.$id;
                }
                return userId === id;
            });
        }

        return _.isObject(obj) ? 1 : 0;
    },

    /**
     * Another helper function for checking is user is following a specific entity
     * 
     * @param app
     * @return {Boolean}
     */
    isFollowing : function (app) {
        var follower_ids = app.LGRouter.masterView.generalInfoView.model.toJSON().follower_ids;
        //console.log("followers");
        return _.isActionTaken(follower_ids, app);
    },

    /**
     * Returns a pretty date
     *
     * @param timestamp
     * @return string {*}
     */
    formatTime : function (timestamp) {
        if (timestamp === 0) {
            return "N/A";
        }
        var date, today;
        if ( timestamp / 10000 > 1 ) {
            date = new Date(timestamp * 1000);
        } else {
            date = new Date(timestamp,1,1,1,1,1);
        }
        today = new Date();
        date = date > today ? today : date; //temporary hack for not showing future dates recommended @Shah
        return app.Utils.prettyDate(date.toJSON());
    },

    /**
     * Helper function for 
     * 
     * @param obj
     * @param graph
     * @return {String}
     */
    getProfilePic : function (obj, graph) {
        var defaultImages = {
            company      : 'images/default-company.png',
            organization : 'images/default-company.png',
            school       : 'images/default-education.png',
            people       : 'images/default-user.png'
        }, ref;
        
        if (graph) {
            obj.node_type = obj.node_type ? obj.node_type : 'people';
            return obj.image || defaultImages[obj.node_type.toLowerCase()];
        }
        
        var image_urls = obj.image_urls, imageUrl;

        if (_.isValid(image_urls) || (_.isArray(image_urls) && image_urls.length)) {
            imageUrl = (ref = image_urls[0]["original"]) ? ref : image_urls[0];
        } else {
            if (obj.hasOwnProperty('type')) {
                imageUrl = _.isEmpty(obj.type)
                        ? defaultImages['organization']
                        : defaultImages[obj.type.toLowerCase()];

            } else {
                imageUrl = defaultImages['people'];
            }
        }
        
        return imageUrl;
    },

    /**
     * Helper function for getting hostname
     * 
     * @param hostname
     * @return {String}
     */
    getHostName : function (hostname) {
        var host = _(hostname).getLocation();
        return host.hostname;
    },

    /**
     * 
     * @param career
     * @return {Object}
     */
    getJob : function (career) {
        return {
            title    : career.position,
            location : career.location.city + ", " + career.location.state
        }
    },
        
    isValid : function (entity) {
        return !(_.isUndefined(entity) || _.isEmpty(entity) || entity === null);
    },

    /**
     * Function for making equal height
     * @param group
     */
    equalHeight : function (group) {
        var tallest = 0, thisHeight;
        group.each(function () {
            thisHeight = $(this).height();
            if (thisHeight > tallest) {
                tallest = thisHeight;
            }
        });
        group.height(tallest);
    },
    
    getDefaultJob : function (data) {
        /**
         * career is a array of object. so we are assuming that the
         * first item in the array is the current job
         */
        var job = {
            title    : '',
            location : ''
        };
        if (typeof data.career !== 'undefined' && data.career.length) {
            if (_.isArray(data.career)) {
                job = _.getJob(data.career[0]);
            } else if (_.isObject(data.career)) {
                job = _.getJob(data.career);
            }
        }
        return job;
    },
    
    isValidArray : function (obj) {
        return _.isValid(obj) && _.isArray(obj) && obj.length;        
    },

    parse : function (response) {

        var me=this;
        return _.map(response.data, function (obj) {
            var _ref;

            var tmp,name="N/A",time;

            time="N/A";
            if(obj.timestamp!=null && obj.timestamp>0 ){
                time = app.Utils.getDate(obj.timestamp);
            }


            var contributor_id=null,
                contributor_image="img/photo-default.png",
                contributor_name="";

            if(obj.source_org!=null){
                if(obj.source_org._id!=null){
                    contributor_id=obj.source_org._id.$id;
                }

                if(obj.source_org.image_urls!=null
                    && obj.source_org.image_urls.length > 0){

                    if(obj.source_org.image_urls[0].original!=null){

                        contributor_image=obj.source_org.image_urls[0].original;
                    }

                }

                if(obj.source_org.name!=null){
                    contributor_name=obj.source_org.name;
                }
            }


            var isEditable=false;

            if(localStorage.hasOwnProperty("userId")
                && contributor_id==localStorage.getItem("userId")){
                isEditable=true;
            }



            return {//TODO : add validation here so that it doesn't break
                "profilePic" : _.getLGEImage(obj), //todo change in css to make min height of image to 100px
                "id"         : _.isValid(_ref = obj._id.$id) ? _ref : '0',
                "title"      : _.isValid(_ref = obj.title) ? _ref : 'N/A',
                "summary"    : _.isValid(_ref = obj.summary) ? _ref : 'N/A',
                "comments"   : _.isValidArray(_ref = obj.comments) ? _ref.length : 0,
                "name"       : _.isValid(_ref = obj.subject_name) ? _ref : 'N/A',
                //"time"       : _.isValid(_ref = obj.timestamp) ? _.formatTime(_ref) : 'N/A',
                "current_time"       : _.isValid(_ref = obj.timestamp) ? _ref : 'N/A',
                "time"       : time,
                "like"       : _.isValidArray(_ref = obj.like_ids) ? _ref.length : 0,
                "share"      : _.isValidArray(_ref = obj.shares) ? _ref.length : 0,
                "follower"   : _.isValidArray(_ref = obj.follower_ids) ? _ref.length : 0,
                "web_url"    : _.isValidArray(_ref = obj.web_urls) ? _ref[0] : 'N/A',
                "hostname"   : _.isValidArray(_ref = obj.web_urls) ? _.getHostName(_ref[0]) : 'N/A',
                follower_ids : _.isValidArray(_ref = obj.follower_ids) ? _ref : [],
                like_ids     : _.isValidArray(_ref = obj.like_ids) ? _ref : [],
                share_ids    : _.isValidArray(_ref = obj.shares) ? _ref : [],
                comment_ids  : _.isValidArray(_ref = obj.comments) ? _ref : [],

                "contributor_id":contributor_id,
                "contributor_image":contributor_image,
                "contributor_name":contributor_name,
                "editable":isEditable,
                "showEditable":false

            };
        });
    },
    
    getLGEImage : function (obj) {
        var _ref;
        if (_.isValidArray(_ref = obj.image_urls)) {
            return (_ref = obj.image_urls[0]["original"]) ? _ref : obj.image_urls[0];
        } else {
            return 'img/photo-default.png';
        }
    },

    parseUser : function (data) {
        var job, _ref;
        job = _.getDefaultJob(data);
        return {
            image            : _.getProfilePic(data),
            name             : _.isValid(_ref = data.name) ? _ref : 'N/A',
            email_address    : _.isValid(_ref = data.email_address) ? _ref : '',
            bio_summary      : _.isValid(_ref = data.bio_summary) ? _ref : '',
            phone_number     : _.isValid(_ref = data.phone_number) ? _ref : '',
            physical_address : _.isValid(_ref = data.physical_address) ? _ref : '',
            jobTitle         : job.title,
            jobLocation      : job.location,
            follower         : _.isValidArray(_ref = data.follower_ids) ? _ref.length : 0,
            follower_ids     : _.isValidArray(_ref = data.follower_ids) ? _ref : [],
            entityType       : data.entityType,
            isClaimed        : _.isClaimed(data)
        }
    },
    
    isClaimed : function (data) {
        var _ref = data.social_ids;
        return (_.isArray(_ref) && _ref.length > 1) || (_.isObject(_ref) && _ref.linkedin) ? 1 : 0;
    },
    
    disableForm : function ($form) {
        $(':input:not(:file)', $form).attr('disabled', true);
    },
    
    enableForm : function ($form) {
        $(':input', $form).removeAttr('disabled');
    },

    isValidEmailAddress : function (emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    }
});