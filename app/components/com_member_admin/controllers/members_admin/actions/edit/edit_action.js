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
            this.on_get_validate_error(rs, 'Member ID missing');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go:'/admin/admin/home',

    on_get_input:function (rs) {
        var self = this;
        if (!rs.req_props.save_error) {
            rs.req_props.save_error = false;
        }
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            if (err) {
                self.on_get_input_error(rs, 'cannot find member with id ' + rs.req_props.id);
            } else {
                self.models.members_roles.model.active(function (err, roles) {
                    if (err) {
                        self.on_get_input_error(rs, 'cannot get roles')
                    } else {
                        self.on_get_process(rs, {roles:roles, member:member});
                    }

                })
            }
        })
    },

    _on_get_input_error_go:'/admin/admin/home',

    on_get_process:function (rs, input) {
        var checkboxes = {
            label:'Roles', checkboxes:[]
        };

        input.roles.forEach(function (role) {
            console.log('ROLE: %s', util.inspect(role));
            var checked = (input.member.roles && _.contains(input.member.roles, role.name));
            checkboxes.checkboxes.push({name:'member[roles][]', label:role.label, value:role.name, checked:checked});
        });

        this.on_output(rs, {member:input.member, active_menu:'admin_members_list',
            role_checkboxes:checkboxes,
            save_error:rs.req_props.save_error});
    },

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_input:function (rs) {
        rs.req_props.save_error = false;
        this.on_post_validate(rs);
    },

    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'Member ID missing');
        } else if (!rs.req_props.member) {
            this.on_post_validate_error(rs, 'no member datae', '/admin/member/' + rs.req_props.id + '/edit')
        } else {
            this.on_post_process(rs);
        }
    },

    _on_post_validate_error_go:'/admin/admin/home',

    on_post_process:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            //@TODO: error check
            var member_data = rs.req_props.member;
            delete member_data._id;
            console.log('member data: %s', util.inspect(member_data, false, 2))
            member.roles = [];
            member.save(function () {
                _.extend(member, member_data);
                console.log('member : %s', util.inspect(member, false, 2))

                member.save(function (err) {
                    if (err) {
                        rs.req_props.save_error = err;
                        self.on_post_process_error(rs, 'Cannot save member', member);

                    } else {
                        self.on_post_output(rs, member._id.toString());
                    }
                });
            });
        })
    },

    on_post_output:function (rs, id) {
        rs.flash('info', 'Member saved');
        rs.go('/admin/member/' + id);
    },

    _on_post_process_error_go:function (rs) {
        return '/admin/member/' + rs.req_props.id;
    }
}