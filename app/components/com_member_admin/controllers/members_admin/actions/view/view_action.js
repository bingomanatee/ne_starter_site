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
        if (!rs.req_props.id){
            rs.flash('error', 'Member ID missing');
            rs.go('/admin/admin/home');
        } else {
            this.on_route(rs);
        }
    },

    on_input:function (rs) {
        var self = this;
        rs.action.models.members_members.get(rs.req_props.id, function(err, member){
            self.on_process(rs, err, member);
        })
    },

    on_process: function(rs, err, member){
        if (err){
            req.flash('error', 'cannot find member with id ' + req_props.id);
            req.go('/admin/admin/home');
        } else {
            this.on_output(rs, {member: member, active_menu: 'admin_members_list'});
        }
    }

}