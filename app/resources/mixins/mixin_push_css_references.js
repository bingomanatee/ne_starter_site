var mongoose = require('mongoose');

module.exports = {
    apply:function (frame, cb) {
        var js = frame.get_config('css', [], true);

        cb();
    }
}