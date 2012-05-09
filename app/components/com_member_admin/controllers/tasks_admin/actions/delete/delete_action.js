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
            rs.flash('error', 'no id');
            rs.go('/admin/member_tasks');
        }
        this.on_input(rs);
    },

    on_input:function (rs) {

        var self = this;
        this.models.members_members.get(rs.req_props.id, function(err, member){
            if (err){
                rs.flash('error', err.toString());
                rs.go('/admin/member_tasks');
            } else {
                self.on_process(rs, member);
            }
        })
    },

    on_process:function (rs, member) {
        var self = this;
        member.deleted = true;
        member.save(function(){
            rs.flash('info', 'member deleted');
            rs.go('/admin/members/list');
        })
    }

}