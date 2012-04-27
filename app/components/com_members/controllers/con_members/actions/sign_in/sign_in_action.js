var util = require('util');


module.exports = {
    on_get:function (rs) {
        //@TODO: handle old input
        this.on_get_process(rs, {});
    },

    on_post:function (rs) {
        this.on_post_validate(rs);
    },

    on_post_validate:function (rs) {
        var err = false;
        if (!rs.req_props.member) {
            this.on_get_process(rs, {});
        } else {
            if (!rs.req_props.member.password) {
                rs.flash('error', 'Password required');
                err = true;
            }
            if (!rs.req_props.member.username) {
                rs.flash('error', 'Username required');
                err = true;
            }
        }
        if (err) {
            this.on_get_process(rs, rs.req_props);
        } else {
            this.on_post_process(rs, rs.req_props);
        }
    },

    on_post_process:function (rs, input) {
        var self = this;
        var signup_member = input.member;
        console.log(util.inspect(input));

        this.models.members_members.find({password:signup_member.password},
            function (err, members) {
                if (err) {
                    self.flash('error', err.toString());
                    self.on_get_process(rs, input);
                } else {
                    var found = false;
                    members.forEach(function (m) {
                        if (
                            (m.name == signup_member.username) ||
                                (m.username == signup_member.username) ||
                                (m.email == signup_member.username)
                            ) {
                            found = m;
                        }
                        // we will return the LAST match
                        //@TODO: track multiple matches.
                    });
                    if (found) {
                        rs.req.session.member_id = found._id.toString();
                        rs.flash('info',  util.format('You are now logged in as %s (%s) ',
                             found.name, found.username));
                        rs.go('/');
                    } else {
                        rs.flash('error', 'cannot find user with that information');
                        self.on_get_process(rs, input);
                    }
                }
            });
    },

    on_get_process:function (rs, input) {
        if (!input.member) {
            input.member = {username:'', password:''};
        }
        this.on_output(rs, input);
    }
}