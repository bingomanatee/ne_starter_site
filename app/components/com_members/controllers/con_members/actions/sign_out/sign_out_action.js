

module.exports = {
    on_process: function(rs){
        rs.clear_session('current_member');
        rs.flash('info','Goodbye!');
        rs.go('/');
    }
}