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
            this.on_validate_error(rs, 'Cannot find ID');
        } else {
            this.on_input(rs);
        }
    },

    on_validate_error: function(rs, err){
        rs.flash('error', err);
        rs.go('/admin/member_tasks');
    },

    on_input:function (rs) {
        var self = this;
        rs.action.models.members_tasks.get(rs.req_props.id, function(err, task){
            self.on_process(rs, err, task);
        })
    },

    on_process: function(rs, err, task){
        if (err){
            this.on_process_error(rs, 'cannot find task with id ' + rs.req_props.id);
        } else {
            this.on_output(rs, {task: task, active_menu: 'admin_members_list'});
        }
    },

    on_process_error: function(rs, err){
        req.flash('error', err);
        req.go('/admin/member_tasks');
    }

}