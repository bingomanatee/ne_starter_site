var express = require('express');

module.exports = {
    start_server: function(server, frame, cb){
        server.use(express.static(frame.path + '/public'));
        cb();
    }
}