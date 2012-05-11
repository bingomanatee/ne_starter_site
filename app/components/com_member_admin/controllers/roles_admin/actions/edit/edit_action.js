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
            this.on_get_validate_error(rs, 'Role ID missing');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go: '/admin/member_roles/list',

    on_get_input:function (rs) {
        var self = this;
        if (!rs.req_props.save_error) {
            rs.req_props.save_error = false;
        }
        this.models.members_roles.get(rs.req_props.id, function (err, role) {
            if (err) {
                self.on_get_input_error(rs, 'cannot find role with id ' + rs.req_props.id);
            } else {
                self.on_get_process(rs, role);
            }
        })
    },

    _on_get_input_error_go: '/admin/member_roles/list',

    on_get_process:function (rs, role) {
        this.on_output(rs, {role:role, active_menu:'admin_members_list', save_error:rs.req_props.save_error});
    },

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_input: function(rs){
        rs.req_props.save_error = false;
        this.on_post_validate(rs);
    },

    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'Role ID missing');
        } else if (!rs.req_props.role) {
            this.on_post_validate_error(rs, 'no role datae', '/admin/role/' + rs.req_props.id + '/edit')
        } else {
            this.on_post_process(rs);
        }
    },

    _on_post_validate_error_go: '/admin/admin/home',

    on_post_process:function (rs) {
        var self = this;
        this.models.members_roles.get(rs.req_props.id, function (err, role) {
            //@TODO: error check

            var member_data = rs.req_props.role;
            delete member_data._id;
            _.extend(role, member_data);

            role.save(function (err) {
                if (err) {
                    rs.req_props.save_error = err;
                    self.on_post_process_error(rs, 'Cannot save role', role);

                } else {
                    self.on_post_output(rs, role._id.toString());
                }
            });
        });
    },

    _on_post_process_error_go: function(rs){
        '/admin/role/' + rs.req_props.id;
    },

    on_post_output:function (rs, id) {
        rs.flash('info', 'Role saved');
        rs.go('/admin/role/' + id);
    }

}