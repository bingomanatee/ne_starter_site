module.exports = {

    on_input:function (rs) {
        var self = this;
        self.models.members_tasks.all(function (err, tasks) {
            if (err) {
                self.on_get_input_fail(rs, 'cannot get tasks: ' + err.toString());
            } else {
                self.on_output(rs, {active_menu:'admin_roles_list', tasks: tasks, role:{_id:'new role', label:'New Role' }})
            }
        });
    },

    on_get_input_fail: function(rs, msg){
        rs.flash('error', msg);
        rs.go('/admin/admin/home');
    }
}