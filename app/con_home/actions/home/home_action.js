module.exports = {

    on_process: function(rs){
        var d = new Date();
        rs.flash('info', 'time is ' + d.getHours() + ':' + d.getMinutes() + ' ' + d.getSeconds());
        this.on_output(rs, {});
    }
}