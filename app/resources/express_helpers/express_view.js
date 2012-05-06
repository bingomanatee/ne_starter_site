var ejs = require('ejs');


module.exports = {
    start_server: function(server, frame, cb){
        server.register('html', ejs);
        var view_dir = frame.path + '/views';
       // console.log('view dir: %s', view_dir);
        server.set('views', view_dir);
        cb();
    }
}