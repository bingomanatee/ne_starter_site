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
            rs.flash('error', 'Member ID missing');
            rs.go('/admin/admin/home');
        } else {
            this.on_get_input(rs);
        }
    },

    on_get_input:function (rs) {
        var self = this;
        if (!rs.req_props.save_err) {
            rs.req_props.save_err = false;
        }
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            self.on_get_process(rs, err, member);
        })
    },

    on_get_process:function (rs, err, member) {
        if (err) {
            req.flash('error', 'cannot find member with id ' + req_props.id);
            rs.go('/admin/admin/home');
        } else {
            this.on_output(rs, {member:member, save_err:rs.req_props.save_err, active_menu:'admin_members_list'});
        }
    },

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_validate:function (rs) {
        var self = this;
        console.log('saving member: data = %s', JSON.stringify(rs.req_props));

        this.models.members_members.validate(rs.req_props.member, function (err) {
            if (err) {
                rs.req_props.save_err = err;
                rs.flash('error', 'Cannot save member');
                self.on_get_validate(rs);
            } else {
                self.on_post_process(rs);
            }
        })
    },

    on_post_process:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member)
        {
            //@TODO: error check

            var member_data = rs.req_props.member;
            delete member_data._id;
            _.extend(member, member_data);

            member.save( function (err) {
                if (err) {
                    // this should be redundant to on_post_validate but you never know.
                    rs.req_props.err = err;
                    rs.flash('error', 'Cannot save member');
                    console.log('post process error: %s', util.inspect(err));
                } else {
                    rs.flash('info', 'Member saved');
                }
                rs.go('/admin/member/' + member._id.toString());
            });
        });

    }
}