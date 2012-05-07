var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var Gate = require('support/gate');
var NE = require('nuby-express');
var _DEBUG = false;

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {
    name: 'get_menu_items',
    init:function (frame, cb) {

        var menu_item_def_handler = new NE.Path_Handler({
            name:'menu_item_def_holder',
            re:/^menu.js?$/i,
            type:'file',
            execute:function (props, cb) {
                var menus = frame.get_resource('view_helper', 'menus');
                if (!menus) {
                    throw new Error('menu found but no menus resource present');
                }
                menus.add_menus(props.full_path, cb);
            }
        });

        /* **************** HARVEST MENUS **************** */

        var gate = new Gate(cb, 'rescan layouts');

        frame.get_controllers().forEach(function (con) {
            gate.task_start();
            con.reload([menu_item_def_handler], gate.task_done_callback());
        })

        frame.get_components().forEach(function (con) {
            gate.task_start();
            con.reload([menu_item_def_handler], gate.task_done_callback());
        })

        gate.task_start();
        frame.reload([menu_item_def_handler], gate.task_done_callback());
        gate.start(); //

    }

}