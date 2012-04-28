var web = require('./../web');
var uri = 'http://localhost:3001/';
var request = require('request');
var member_model = require('./../app/components/com_members/resources/models/model_members')();
var new_member;
var factory = require('support/mongoose_model/factory');
var fs = require('fs');
var _ = require('underscore');
var qs = require('querystring');
var util = require('util');

var find_all = {
    sEcho:1,
    iColumns:5,
    sColumns:'',
    iDisplayStart:0,
    iDisplayLength:10,
    mDataProp_0:0,
    mDataProp_1:1,
    mDataProp_2:2,
    mDataProp_3:3,
    sSearch:'',
    bRegex:false,
    sSearch_0:'',
    bRegex_0:false,
    bSearchable_0:true,
    sSearch_1:'',
    bRegex_1:false,
    bSearchable_1:true,
    sSearch_2:'',
    bRegex_2:false,
    bSearchable_2:true,
    sSearch_3:'',
    bRegex_3:false,
    bSearchable_3:true,
    iSortCol_0:0,
    sSortDir_0:'asc',
    iSortingCols:1,
    bSortable_0:true,
    bSortable_1:true,
    bSortable_2:true,
    bSortable_3:true,
    _:1335551576630
};

function _gen(index) {
    return {
        name:'Member Name' + index,
        username:'User' + index,
        email:util.format("User%s@domain%s.com", index, index),
        password:Math.round(Math.PI * index * 100)
    };
}

function _make_members(test) {
    factory(member_model, _gen, 100, function (err, result) {
        if (err) {
            if (_.isArray(err)) {
                err.forEach(function (e) {
                    process.nextTick(function () {
                        throw e;
                    });
                });
                throw new Error('errors:');
            } else {
                throw err;
            }
        }

        fs.writeFile(__dirname + '/member_stram_test.last_dataset.json', JSON.stringify(result),
            function () {
                console.log('wrote result');
                test.done();
            }
        );
    });
}

var framework;

module.exports = {

    setup:function (test) {
        new_member = {name: "Bob", username:'foo', email:'foo@bar.com'};
        framework = web({port:3001, mongoose:{db:'member_stream_test'}}, function () {
            member_model.empty(function(){
                _make_members(test);
            });
        });
    },

    test_member_listing:function (test) {

        request.get(uri + 'admin/members/list.json?' + qs.stringify(find_all),
            function (e, res, body) {
                if (e) {
                    throw e;
                }
                fs.writeFile(__dirname + '/list_10.json', body, function () {
                    test.done();
                });
            });

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
                    //    console.log('getting ' + gbody);
                    test.deepEqual(body, gbody, 'get gets same member back');
                    test.done();
                });

            });

    },

    test_done:function (test) {
        framework.server().close();
        test.done();
    }
};