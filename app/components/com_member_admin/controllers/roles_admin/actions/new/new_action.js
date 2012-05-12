var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {
//@TODO: validate _id presence
    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        if (!rs.req_props.role) {
            this.on_validate_error(rs, 'No Role');
        } else {
            var self = this;
            _process_tasks(rs.req_props.role);
            this.models.members_roles.validate(rs.req_props.role, function (err, role) {
                if (err) {
                    self.on_validate_error(rs, 'cannot validate role: ' + err.toString());
                } else {
                    self.on_process(rs, role);
                }
            })
        }
    },

    _on_validate_error_go:'/admin/member_roles',

    on_process:function (rs, role) {
        var self = this;
        role.save(function (err) {
            if (err) {
                self.on_process_validate_error(rs, err);
            } else {
                self.on_output(rs, role);
            }
        });
    },

    on_output:function (rs, role) {
        rs.flash('info', 'Saved Role ' + role._id);
        rs.go('/admin/member_roles/list');
    }

}


function _process_tasks(md) {
    tasks = [];
    _.each(md.tasks, function (verbs, name) {
        tasks.push({name:name, verbs:_.toArray(verbs)});
    });
    md.tasks = tasks;
}