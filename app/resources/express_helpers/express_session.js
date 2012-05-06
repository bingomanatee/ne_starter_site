var express = require('express');

module.exports = {
    start_server:function (server, frame, cb) {
        var session_config = { secret:'Alfred E Neuman' };

        if (frame.config.session) {
            session_config = frame.config.session;
        }

        server.use(
            express.cookieParser(session_config));
        server.use(
            express.session(session_config));
        cb();
    }

}