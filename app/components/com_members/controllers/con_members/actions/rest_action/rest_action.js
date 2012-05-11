var util = require('util');

module.exports = {

    on_get:function (rs) {
        if (!rs.req_props.hasOwnProperty('id') && (rs.req_props.id)) {
            this.rest_err(rs, "No ID provided to get");
        } else {
            this.on_get_process(rs);
        }
    },

    on_get_process:function (rs) {
        var self = this;

        this.models.members_members.get(
            rs.req_props.id,
            function (err, member) {
                if (err) {
                    self.rest_err(rs, err);
                } else {
                    var json = member.toJSON();
                    delete json.password;
                    delete json.email;
                    self.on_output(rs, json);
                }
            }
        );
    },

    on_put:function (rs) {
        var self = this;
        var mm = this.models.members_members.model;
    //    console.log('MEMBER REST ACTION: >> req: %s', util.inspect(rs.req, true, 1));
      //  console.log('putting member %s', util.inspect(rs.req_props));
        var new_member = new mm(rs.req_props);
        new_member.validate(function (err) {
            if (err) {
                self.rest_err(rs, err);
            } else {
                new_member.save(function (err) {
                    if (err) {
                        self._on_put_process_error(rs, err.toString());
                    } else {
                        var json = new_member.toJSON();
                        delete json.password;
                        delete json.email;
                    //    console.log('new member JSON: %s', JSON.stringify(json));
                        self.on_output(rs, json);
                    }
                })
            }
        });
    }

}