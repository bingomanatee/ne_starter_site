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
        if (rs.req_props.id) {
            this.on_input(rs)
        } else {
            return this.on_validate_error('Cannot find ID');
        }
    },

    _on_validate_error_go:'/admin/member_roles/list',

    on_input:function (rs) {
        var self = this;

        this.models.members_roles.get(rs.req_props.id, function (err, role) {
            if (err) {
                self.on_input_error(rs, 'error getting role ' + rs.req_props.id + ': ' + err.toString());
            } else if (!role) {
                self.on_input_error(rs, 'cannot get role ' + rs.req_props.id);
            } else {
                self.on_output(rs, {role:role });
            }
        });
    },

    _on_input_error_go:'/admin/member_roles/list'

}