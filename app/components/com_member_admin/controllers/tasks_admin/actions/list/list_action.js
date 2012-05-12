module.exports = {

    on_process:function (rs) {
        this.on_output(rs, {active_menu:'admin_members_list', task:{name:'new task', label:'New Task' }})
    }
}