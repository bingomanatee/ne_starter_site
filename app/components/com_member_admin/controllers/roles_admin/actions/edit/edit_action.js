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
            this.on_get_validate_error(rs, 'No ID in rs');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go:'/admin/member_roles/list',

    on_get_input:function (rs) {
        var self = this;

        this.models.members_roles.get(rs.req_props.id, function (err, role) {
            if (err) {
                self.on_get_input_error(rs, 'cannot get role: ' + err.toString());
            } else {
                self.models.members_tasks.model.active(function (err, tasks) {
                    if (err) {
                        self.on_get_input_error(rs, 'cannot get tasks: ', +err.toString());
                    } else if (!role) {
                        self.on_get_input_error(rs, 'cannot find role ' + rs.req_props.id);
                    } else {
                        self.on_get_process(rs, {role:role, tasks:tasks});
                    }
                });
            }
        });
    },

    _on_get_input_error_go:'/admin/members/list',

    on_get_process:function (rs, input) {
        this.on_output(rs, input);
    },

    /* **************** POST RESPONSE_METHODS ************ */


    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'Role ID missing');
        } else if (!rs.req_props.role) {
            this.on_post_validate_error(rs, 'no role data', '/admin/member_roles/list')
        } else {
            this.on_post_input(rs);
        }
    },

    _on_post_validate_error_go:'/admin/member_roles/list',


    on_post_input:function (rs) {
        rs.req_props.save_error = false;

        var self = this;
        this.models.members_roles.get(rs.req_props.id, function (err, role) {

            if (err) {
                self.on_post_input_error(rs, 'cannot get role ' + rs.req_props.id + ': ' + err.toString());
            } else {
                self.on_post_process(rs, role);
            }

        })
    },

    on_post_process:function (rs, role) {
        var self = this;

        var member_data = rs.req_props.role;
        console.log(' >>>>>>>>>>>>>>> member_data: ' + JSON.stringify(member_data));
        delete member_data._id;
        _process_tasks(member_data);
        console.log(' >>>>>>>>>>>>>>> member_data, filtered: ' + JSON.stringify(member_data));

        while(role.tasks.length > 0){
            role.tasks[0].remove();
        }

        role.save(function(err){

            while (member_data.tasks.length > 0){
                role.tasks.push(member_data.tasks.shift());
            }

            delete member_data.tasks;
            _.extend(role, member_data);

            role.save(function (err) {
                if (err) {
                    rs.req_props.save_error = err;
                    console.log(util.inspect(err, true, 4));
                    self.on_post_process_error(rs, util.format('Cannot save role: %s', util.inspect(err, true)));
                } else {
                    self.on_post_output(rs, {role:role});
                }
            });

        });

    },

    _on_post_process_error_go:'/admin/member_roles/list',

    on_post_output:function (rs, input) {
        rs.flash('info', 'Role saved');
        console.log('input: %s', util.inspect(input));
        rs.go('/admin/member_role/' + input.role._id);
    }

}

function _process_tasks(role) {
    tasks = [];
    _.each(role.tasks, function (verbs, name) {
        tasks.push({task:name, verbs:_.toArray(verbs)});
    });
    console.log('tasks set to %s', util.inspect(tasks));
    role.tasks = tasks;
}