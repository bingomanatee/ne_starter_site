var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        if (!rs.req_props.id){
            rs.flash('error', 'Member ID missing');
            rs.go('/admin/member_tasks');
        } else {
            this.on_route(rs);
        }
    },

    on_input:function (rs) {
        var self = this;
        rs.action.models.members_tasks.get(rs.req_props.id, function(err, task){
            self.on_process(rs, err, task);
        })
    },

    on_process: function(rs, err, task){
        if (err){
            req.flash('error', 'cannot find task with id ' + req_props.id);
            req.go('/admin/member_tasks');
        } else {
            this.on_output(rs, {task: task, active_menu: 'admin_members_list'});
        }
    }

}