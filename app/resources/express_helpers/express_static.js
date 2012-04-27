var express = require('express');

module.exports = {
    apply: function(server, frame, cb){
        server.use(express.static(frame.path + '/public'));
        cb();
    }
}