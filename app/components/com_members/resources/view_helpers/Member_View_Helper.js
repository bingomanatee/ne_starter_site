var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');

var _flash_view_helper = new NE.helpers.View( {
    name: 'flash',

    weight: -1,

    init: function(rs, input, cb){
        var id = rs.session('member_id');

        if (id){
            var self = this;
            var members_model = this.framework.models.members_members;
            members_model.get(id, function(err, member){
                if (member){
                    input.current_member = member;
                } else {
                    input.current_member = false;
                }
                cb(null, self.name);
            });
        } else {
            cb(null, this.name);
        }

    }

});

module.exports = function () {
    return _flash_view_helper;
}