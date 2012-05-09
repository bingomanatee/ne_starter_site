module.exports = {
    on_process:function (rs) {
        rs.clear_session('current_member');
        this.on_output(rs);
    },

    on_output:function (rs) {
        rs.flash('info', 'Goodbye!');
        rs.go('/');
    }
}