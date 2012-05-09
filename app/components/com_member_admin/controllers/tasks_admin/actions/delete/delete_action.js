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
            this.on_validate_fail(rs);
        }
        this.on_input(rs);
    },

    on_validate_fail:function (rs) {
        rs.flash('error', 'no id');
        rs.go('/admin/member_tasks');
    },

    on_input:function (rs) {

        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            if (err) {
                self.on_input_error(rs, err.toString());
            } else {
                self.on_process(rs, member);
            }
        })
    },

    on_input_error:function (rs, err) {
        rs.flash('error', err);
        rs.go('/admin/member_tasks');
    },

    on_process:function (rs, member) {
        var self = this;
        member.deleted = true;
        member.save(function () {
            self.on_output(rs);
        })
    },

    on_output:function (rs) {
        rs.flash('info', 'member deleted');
        rs.go('/admin/members/list');
    }

}