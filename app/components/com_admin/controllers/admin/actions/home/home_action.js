

module.exports = {

    on_process: function(rs){
        this.on_output(rs,{
            active_menu: 'admin_home',
           panels: this.models.admin_panels.get_admin_panels()
        });
    }

}