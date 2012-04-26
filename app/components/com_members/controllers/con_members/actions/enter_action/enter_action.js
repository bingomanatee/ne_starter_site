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
            this.on_get_process(rs, rs.req_props.member);
        } else {
            this.on_post_process(rs.rs.req_props.member);
        }
    },

    on_post_process:function (rs, member) {
        var self = this;

        this.models.members_members.find({password:member.password},
            function (err, members) {
                if (err) {
                    self.flash('error', err.toString());
                    self.on_get_process(rs, input);
                } else {
                    var found = false;
                    members.forEach(function (m) {
                        if (
                            (m.name == member.username) ||
                                (m.username == member.username) ||
                                (m.email == member.username)
                            ) {
                            found = m;
                        }
                        // we will return the LAST match
                        //@TODO: track multiple matches.
                    });
                    if (found){
                        rs.req.session.member_id = member._id.toString();
                        rs.flash('info', 'You are now logged in as ' + member.username);
                        rs.req.redirect('/');
                    } else {
                        self.flash('error', 'cannot find user with that information');
                        self.on_get_process(rs, member);
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