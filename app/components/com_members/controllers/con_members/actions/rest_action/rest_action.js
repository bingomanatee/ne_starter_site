var util = require('util');

module.exports = {

    on_get:function (rs) {
        if (!rs.req_props.hasOwnProperty('id') && (rs.req_props.id)) {
            this.rest_err(rs, "No ID provided to get");
        } else {
            var self = this;

            this.models.members_members.get(
                rs.req_props.id,
                function (err, member) {
                    if (err) {
                        self.rest_err(rs, err);
                    } else {
                        self.on_output(rs, member.toObject());
                    }
                }
            );
        }
    },

    on_put: function(rs){
        var self = this;
        var mm = this.models.members_members.model;
        console.log('mmm = %s', util.inspect(mm));
        console.log('putting member %s', util.inspect(rs.req_props));
        var new_member = new mm(rs.req_props);
        new_member.validate(function(err){
           if (err){
               self.rest_err(rs, err);
           } else {
               new_member.save(function(err){
                   if (err){
                       self.rest_err(rs, err);
                   } else {
                       self.on_output(rs, new_member.toObject());
                   }
               })
           }
        });
    },

    rest_err: function(rs, err){
        rs.send({"err": err.toString()}, 400);
    }

}