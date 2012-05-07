

module.exports = {

    on_process: function(rs){
        this.on_output(rs,{
           panels: this.models.admin_panels.get_admin_panels()
        });
    }

}