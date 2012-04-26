var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');


var _flash_view_helper = new NE.helpers.View({
    name:'menu',

    render:function () {
        var menu_items = [];
        if (this._req_state.req.session.member_id) {
            this._add_member_menu_items(menu_items);
        } else {
            this.add_signin_items(menu_items);
        }
    },

    _add_member_menu_items:function (mi, cb) {
        var members_members = this._res_state.framework.models.members_members;
        var member = members_members.get(this._req_state.req.session.member_id, function (err, member){

        });
    }
});

module.exports = function () {
    return _flash_view_helper;
}