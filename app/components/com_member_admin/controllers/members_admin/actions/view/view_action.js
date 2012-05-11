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
            this.on_validate_error(rs, 'Member ID missing');
        } else {
            this.on_input(rs);
        }
    },

    _on_get_validate_error: '/admin/admin/home',

    on_process:function (rs) {
        var self = this;
        rs.action.models.members_members.get(rs.req_props.id, function (err, member) {
            if (err) {
                self.on_process_error(rs, 'cannot get member with id ' + rs.req_props.id + ': ' + err.toString());
            } else if (!member) {
                self.on_process_error(rs, 'no member ' + rs.req_props.id + ' found');
            } else {
                self.on_output(rs, {member:member, active_menu:'admin_members_list'});
            }
        })
    },

    _on_process_error_go: '/admin/admin/home'

}