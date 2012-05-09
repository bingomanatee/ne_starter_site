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
        if (!rs.req_props.task){
            rs.flash('error', 'no task found for new task');
            rs.go('/admin/member_tasks');
        } else  {
            var self = this;
            rs.req_props.task._id = rs.req_props._id.replace(/[ ]+/g, '_').toLowerCase();
            this.models.members_tasks.validate(rs.req_props.task, function(err, task){
                self.on_input(rs, err, task);
            })
        }
    },

    on_input:function (rs, err, task) {
        if (err){
            rs.flash('error', 'cannot save task: ', task.toString());
            rs.go('/admin/member_tasks');
        } else {
           this.on_process(rs, task);
        }
    },

    on_process:function (rs, task) {
        var self = this;
        task.save(function(){
            rs.flash('info', 'Saved Task ' + task._id.toString());
            rs.go('/admin/member_tasks/list');
        });
    }

}