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
        if ((rs.req_props.id)){
            this.on_input(rs);
        } else {
            rs.flash('error', 'no id');
            rs.go('/admin/members/list')
        }
    },

    on_input:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function(err, member){
            self.on_process(rs, member);
        });

    },

    on_process:function (rs, member) {
        member.deleted = true;
        member.save(function(){
            rs.flash('info', util.inspect('member %s deleted', rs.req_props.id));
            rs.go('/admin/members/list');
        })
    }

}