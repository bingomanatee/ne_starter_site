var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** GET RESPONSE METHODS ************** */

    on_get_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_get_validate_error(rs, 'No ID in rs');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go: '/admin/admin/home',

    on_get_input:function (rs) {
        var self = this;

        this.models.members_members.get(rs.req_props.id, function(err, member){
            if (err){
                self.on_get_input_error(rs, 'cannot get member: ' + err.toString());
            } else {
                self.models.members_tasks.all(function(err, tasks){
                    if (err){
                        self.on_get_input_error(rs, 'cannot get tasks: ', + err.toString());
                    } else if (!member){
                        self.on_get_input_error(rs, 'cannot find member ' + rs.req_props.id);
                    } else {
                        self.on_get_process(rs, {member: member, tasks: tasks});
                    }
                });
            }
        });
    },

    _on_get_input_error_go: '/admin/members/list',

    on_get_process:function (rs, input) {
        console.log('output: %s', util.inspect(input));
        this.on_output(rs, input);
    },

    /* **************** POST RESPONSE_METHODS ************ */

    on_post_input: function(rs){
        rs.req_props.save_error = false;
        this.on_post_validate(rs);
    },

    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'Member ID missing');
        } else if (!rs.req_props.member) {
            this.on_post_validate_error(rs, 'no member data', '/admin/members/list')
        } else {
            this.on_post_process(rs);
        }
    },

    _on_post_validate_error_go: '/admin/admin/home',

    on_post_process:function (rs) {
        var self = this;
        this.models.members_members.get(rs.req_props.id, function (err, member) {
            //@TODO: error check

            var member_data = rs.req_props.member;
            delete member_data._id;
            _process_tasks(member_data);
            console.log('member data: %s', util.inspect(member_data, true, 3));
            _.extend(member, member_data);
            console.log('final member: %s', JSON.stringify(member.toJSON()))

            member.save(function (err) {
                if (err) {
                    rs.req_props.save_error = err;
                    self.on_post_process_error(rs, util.format('Cannot save member: %s', util.inspect(err, true)), member);

                } else {
                    self.on_post_output(rs, {member: member} );
                }
            });
        });
    },

    _on_post_process_error_go: '/admin/members/list',

    on_post_output:function (rs, input) {
        rs.flash('info', 'Member saved');
        console.log('input: %s', util.inspect(input));
        rs.go('/admin/member/' + input.member._id);
    }

}

function _process_tasks(md){
    tasks = [];
    _.each(md.tasks, function(verbs, name){
       tasks.push({task: name, verbs:_.toArray(verbs)});
    });
    console.log('tasks set to %s', util.inspect(tasks));
    md.tasks = tasks;
}