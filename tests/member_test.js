var web = require('./../web');
var uri = 'http://localhost:3001/';
var request = require('request');
var member_model = require('./../app/components/com_members/resources/models/model_members')();
var new_member;

module.exports = {

    setup:function (test) {
        new_member = {name:'foo', email:'foo@bar.com'};
        web({port:3001, mongoose:{db:'member_test'}}, function () {
            member_model.empty(function(){
                test.done();
            })
        })
    },

    test_member_REST:function (test) {

        request.put({uri:uri + 'members', form:new_member},
            function (e, res, body) {
                try {
                    var parsed_member = JSON.parse(body);
                } catch (err) {
                    test.ok(false, 'cannot parse ' + body + err.toString());
                    return test.done();
                }

                var id = parsed_member['_id'];
                delete parsed_member._id;
                test.deepEqual(parsed_member, new_member, 'added new member');

                request.get(uri + 'members/' + id, function (err, res, gbody) {
                    console.log('getting ' + gbody);
                    test.deepEqual(body, gbody, 'get gets same member back');
                    member_model.model.remove({}, function (err) {
                        if (err) throw err;
                        test.done();

                    });
                });

            });

    },

    test_done:function (test) {
        framework.server().close();
        test.done;
    }

}