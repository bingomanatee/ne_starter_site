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

    _on_get_validate_error_go : '/admin/admin/home',

    on_get_input:function (rs) {
        var self = this;
        if (!rs.req_props.save_error) {
            rs.req_props.save_error = false;
        }
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            if (err) {
                self.on_get_input_error(rs, 'cannot find member with id ' + rs.req_props.id);
            } else {
                self.on_get_process(rs, member);
            }
        })
    },

    _on_get_input_error_go: '/admin/admin/home',

    on_get_process:function (rs, member) {
        this.on_output(rs, {member:member, active_menu:'admin_members_list', save_error:rs.req_props.save_error});
    },

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_input: function(rs){
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

    _on_post_validate_error_go: '/admin/admin/home',

    on_post_process:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            //@TODO: error check

            var member_data = rs.req_props.member;
            delete member_data._id;
            _.extend(member, member_data);

            member.save(function (err) {
                if (err) {
                    rs.req_props.save_error = err;
                    self.on_post_process_error(rs, 'Cannot save member', member);

                } else {
                    self.on_post_output(rs, member._id.toString());
                }
            });
        });
    },

    on_post_output:function (rs, id) {
        rs.flash('info', 'Member saved');
        rs.go('/admin/member/' + id);
    },

    _on_post_process_error_go: function(rs){
        return '/admin/member/' + rs.req_props.id;
    }
}