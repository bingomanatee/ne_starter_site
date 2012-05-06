var express = require('express');

module.exports = {
    start_server: function(server, target, cb){
        console.log('applying bp');
        server.use(express.bodyParser());
        cb();
    }
}