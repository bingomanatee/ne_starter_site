var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');

/* ***************** CLOSURE ************* */

var _admin_panels = [];

function _sort_admin_panels(admin_panels){
       return admin_panels.weight ? admin_panels.weight : 0;
}

/* ***************** MODULE *********** */

module.exports = {

    get_admin_panels: function(){
      return _admin_panels.slice(0);
    },

    add_admin_panels: function(full_path, cb){
        var admin_panels = require(full_path);

        _admin_panels = _.sortBy(_admin_panels.concat(admin_panels), _sort_admin_panels);

        cb();
    }

}