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
        if ((rs.req_props.id)) {
            this.on_input(rs);
        } else {
            this.on_validate_error(rs, 'no id');
        }
    },

    _on_validate_error_go: '/admin/members/list',

    on_input:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            if (err){
                self._on_input_error(rs, 'cannot get member ' + rs.req_props.id);
            } else {
                self.on_process(rs, member);
            }
        });

    },

    on_process:function (rs, member) {
        member.deleted = true;
        var self = this;
        member.save(function () {
            self.on_input(rs, member);
        })
    },

    on_input:function (rs, member) {
        rs.flash('info', util.inspect('member %s deleted', rs.req_props.id));
        rs.go('/admin/members/list');
    }

}