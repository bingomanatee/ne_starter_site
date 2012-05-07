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

        var admin_panel_def_handler = new NE.Path_Handler({
            name:'menu_item_def_holder',
            re:/^admin_panels.js?$/i,
            type:'file',
            execute:function (props, cb) {
                var admin_panels = frame.get_resource('model', 'admin_panels');
                if (!admin_panels) {
                    throw new Error('menu found but no admin_panels resource present');
                }
                admin_panels.add_admin_panels(props.full_path, cb);
            }
        });

        /* **************** HARVEST ADMIN PANELS **************** */

        var gate = new Gate(cb, 'rescan layouts');

        frame.get_controllers().forEach(function (con) {
            gate.task_start();
            con.reload([admin_panel_def_handler], gate.task_done_callback());
        })

        frame.get_components().forEach(function (con) {
            gate.task_start();
            con.reload([admin_panel_def_handler], gate.task_done_callback());
        })

        gate.task_start();
        frame.reload([admin_panel_def_handler], gate.task_done_callback());
        gate.start(); //

    }

}