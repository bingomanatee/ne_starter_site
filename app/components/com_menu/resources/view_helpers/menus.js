var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');

/* ***************** CLOSURE ************* */

var _menus = [];

var _grouped_menus = {};

function _by_type(gm, menu_item){
    if (!menu_item.type){
        menu_item.type = 'main';
    }

    if (!gm[menu_item.type]){
        gm[menu_item.type] = [];
    }

    gm[menu_item.type].push(menu_item);

    return gm;
}

function _sort_menus(menus, type){
    _grouped_menus[type] = _.sortBy(menus, function(menu){
       return menu.weight ? menu.weight : 0;
    });
}

/* ***************** MODULE *********** */

module.exports = {

    init:function (rs, input, cb) {
        input.menu = _grouped_menus;
        if (!input.active_menu){
            input.active_menu = false;
        }
    },

    add_menus: function(full_path, cb){
        var menus = require(full_path);

        _menus = _menus.concat(menus);

        _grouped_menus = {};

        _.reduce(_menus, _by_type, _grouped_menus);
        _.each(_grouped_menus, _sort_menus);

        cb();
    }

}