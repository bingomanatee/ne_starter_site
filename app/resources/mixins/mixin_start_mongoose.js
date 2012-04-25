var mongoose = require('mongoose');

module.exports = {
    apply:function (frame, cb) {
        var con = 'mongodb://localhost/' + frame.config.mongoose.db;
        console.log('con: %s', con);
        mongoose.connect(con);

        cb();
    }
}