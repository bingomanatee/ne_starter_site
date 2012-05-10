var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** GET RESPONSE METHODS ************** */

    on_get_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_get_validate_error(rs, 'ID missing');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go:'/admin/admin/home',

    on_get_input:function (rs) {
        var self = this;
        if (!rs.req_props.save_err) {
            rs.req_props.save_err = false;
        }
        this.models.members_tasks.get(rs.req_props.id, function (err, task) {
            self.on_get_process(rs, err, task);
        })
    },

    on_get_process:function (rs, err, task) {
        if (err) {
            this.on_get_process_error(rs, 'Cannot get edit task: ' + err.toString());
        } else {
            this.on_output(rs, {task:task, active_menu:'admin_member_tasks'});
        }
    },

    _on_get_process_error_go:'/admin/admin/home',

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'ID Missing');
        } else if (!rs.req_props.task) {
            this.on_post_validate_error(rs, 'Member Data Missing');
        } else {
            this.on_post_process(rs);
        }
    },

    _on_post_process_error_go:function (rs) {
        return ('/admin/member_task/' + rs.req_props.id + '/edit');
    },

    on_post_process:function (rs) {
        var self = this;
        this.models.members_tasks.get(rs.req_props.id, function (err, task) {
            //@TODO: error check

            var member_data = rs.req_props.task;
            delete member_data._id;
            _.extend(task, member_data);

            task.save(function (err) {
                if (err) {
                    // this should be redundant to on_post_validate but you never know.
                    rs.req_props.err = err;
                    self.on_post_process_error(rs, 'Cannot save task: ' + err.toString());
                } else {
                    self.on_post_output(rs, task);
                }
            });
        });

    },

    on_post_output:function (rs, task) {
        rs.flash('info', 'Task saved');
        rs.go('/admin/member_task/' + task._id.toString());
    }
}