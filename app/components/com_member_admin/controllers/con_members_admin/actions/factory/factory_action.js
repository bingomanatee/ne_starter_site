var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var factory = require('support/mongooose_model/factory');
function _gen(index) {
    return {
        name:'Member Name' + index,
        username:'User' + index,
        email:util.format("User%s@domain%s.com", index, index),
        password:Math.round(Math.PI * index * 100)
    };
}

/* *************** MODULE ********* */

module.exports = {

    on_process: function(rs){

    },

}