module.exports = {

    on_input:function (rs) {
        var self = this;
        self.models.members_tasks.model.active(function (err, tasks) {
            if (err) {
                self.on_get_input_error(rs, 'cannot get tasks: ' + err.toString());
            } else {
                self.on_output(rs, {active_menu:'admin_roles_list', tasks: tasks, role:{_id:'new role', label:'New Role' }})
            }
        });
    },

    _on_get_input_error_go: '/admin/admin/home'

}