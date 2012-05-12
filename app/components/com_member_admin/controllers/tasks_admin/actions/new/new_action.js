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
            this.on_validate_error(rs, 'No Task');
        } else  {
            var self = this;
            this.models.members_tasks.validate(rs.req_props.task, function(err, task){
                self.on_input(rs, err, task);
            })
        }
    },

    _on_validate_error_go: '/admin/member_tasks',

    on_input:function (rs, err, task) {
        if (err){
            this.on_input_error(rs, 'cannot save task: ' + err.toString());
        } else {
           this.on_process(rs, task);
        }
    },

    _on_input_error_go: '/admin/member_tasks',

    on_process:function (rs, task) {
        var self = this;
        task.save(function(){
            self.on_output(rs, task);
        });
    },

    on_output: function(rs, task){
        rs.flash('info', 'Saved Task ' + task._id.toString());
        rs.go('/admin/member_tasks/list');
    }

}