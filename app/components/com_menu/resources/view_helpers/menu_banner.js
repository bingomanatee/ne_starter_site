var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');

/* ***************** CLOSURE ************* */

var _banner_menu_template = _.template('<section class="grid_12 banner"><div class="box"><h1><%= title %></h1>' +
    '<% menu.forEach(function(m){%>' +
    '<a class="menu_item <% if (m.id == active_menu ){ %> active <% } %>" href="<%- m.link %>"' +
    '><%- m.label %></a>' +
    '<%}) %></div></section>');

/* ***************** MODULE *********** */

module.exports = {

    init: function(rs, input, cb){

        if (!input.helpers){
            input.helpers = {};
        }

        input.helpers.banner_menu = function(title, type, active_id){
            var menu = input.menu[type];
            if (!menu){
                throw new Error('Cannot find banner menu ' + type);
            }
            return _banner_menu_template({title: title, menu: menu, active_menu: active_id});
        }

        cb();
    }
}