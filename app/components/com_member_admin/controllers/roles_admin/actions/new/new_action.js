var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {
//@TODO: validate _id presence
    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        if (!rs.req_props.role){
            this.on_validate_error(rs, 'No Task');
        } else  {
            var self = this;
            console.log('PROPS: %s', util.inspect(rs.req_props,false, 4));
            rs.req_props.role._id = rs.req_props.role._id.replace(/[ ]+/g, '_').toLowerCase();
            console.log('PROPS2: %s', util.inspect(rs.req_props,false, 4));
            _process_roles(rs.req_props.role);
            this.models.members_roles.validate(rs.req_props.role, function(err, role){
                self.on_input(rs, err, role);
            })
        }
    },

    _on_validate_error_go: '/admin/member_roles',

    on_input:function (rs, err, role) {
        if (err){
            this.on_input_error(rs, 'cannot save role: ' + err.toString());
        } else {
           this.on_process(rs, role);
        }
    },

    _on_input_error_go: '/admin/member_roles/list',

    on_process:function (rs, role) {
        var self = this;
        role.save(function(){
            self.on_output(rs, role);
        });
    },

    on_output: function(rs, role){
        rs.flash('info', 'Saved Task ' + role._id.toString());
        rs.go('/admin/member_roles/list');
    }

}


function _process_roles(md){
    tasks = [];
    _.each(md.tasks, function(verbs, name){
        tasks.push({_id: name, verbs:_.toArray(verbs)});
    });
    md.tasks = tasks;
}