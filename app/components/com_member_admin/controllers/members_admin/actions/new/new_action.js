var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** GET RESPONSE METHODS ************** */

    on_get: function(rs){
      this.get_validate(rs);
    },

    get_validate:function (rs) {
        this.on_get_input(rs);
    },

    on_get_input:function (rs) {
        if (!rs.req_props.member){
            rs.req_props.member = {_id: '', name: '', email: '', username: '', password: ''}
        }
        if (!rs.req_props.save_error){
            rs.req_props.save_error = false;
        }
        this.on_get_process(rs, rs.req_props);
    },

    on_get_process:function (rs, input) {
        console.log('------- NEW INPUT: ------ %s', util.inspect(input));
        this.on_output(rs, input);
    },

    /* *************** POST RESPONSE METHODS ************** */

    on_post_validate:function (rs) {
        this.on_get_input(rs);
    },

    on_post_input:function (rs) {
        this.on_post_process(rs, rs.req_props);
    },

    on_post_process:function (rs, input) {
        this.on_output(rs, input);
    }

}