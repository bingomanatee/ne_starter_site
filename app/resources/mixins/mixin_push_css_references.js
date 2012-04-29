var mongoose = require('mongoose');

module.exports = {
    init:function (frame, cb) {
        var js = frame.get_config('css', [], true);

        cb();
    }
}