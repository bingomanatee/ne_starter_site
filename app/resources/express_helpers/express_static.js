var express = require('express');

module.exports = {
    init: function(server, frame, cb){
        server.use(express.static(frame.path + '/public'));
        cb();
    }
}