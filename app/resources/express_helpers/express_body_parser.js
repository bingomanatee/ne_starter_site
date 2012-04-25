var express = require('express');

module.exports = {
    apply: function(server, target, cb){
        console.log('applying bp');
        server.use(express.bodyParser());
        cb();
    }
}