var express = require('express');

module.exports = {
    init: function(server, target, cb){
        console.log('applying bp');
        server.use(express.bodyParser());
        cb();
    }
}