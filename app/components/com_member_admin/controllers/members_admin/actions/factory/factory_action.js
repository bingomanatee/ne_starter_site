var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var factory = require('support/mongoose_model/factory');

/* *************** MODULE ********* */

module.exports = {

    on_process:function (rs, input) {
        var d = new Date();

        function _gen(index) {
            index += d.getTime();
            return {
                name:'Member Name' + index,
                username:'User' + index,
                email:util.format("User%s@domain%s.com", index, index),
                password:Math.round(Math.PI * index * 100)
            };
        }

        var self = this;
        factory(this.models.members_members, _gen, input.count, function(err, result){
            if (err){
                return self.on_output(rs, err.toString());
            }
            self.on_output(rs, result);
        })
    }

}