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
        if (!rs.req_props.id) {
            this.on_validate_error(rs);
        }
        this.on_input(rs);
    },

    _on_validate_error_go: '/admin/member_tasks',

    on_input:function (rs) {

        var self = this;
        this.models.members_tasks.get(rs.req_props.id, function (err, task) {
            if (err) {
                self.on_input_error(rs, err.toString());
            } else {
                self.on_process(rs, task);
            }
        })
    },

    _on_input_error_go: '/admin/member_tasks',

    on_process:function (rs, task) {
        var self = this;
        task.deleted = true;
        task.save(function () {
            self.on_output(rs);
        })
    },

    on_output:function (rs) {
        rs.flash('info', 'task deleted');
        rs.go('/admin/member_tasks/list');
    }

}