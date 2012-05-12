var web = require('./../web');
var uri = 'http://localhost:3001/';
var request = require('request');
var member_model = require('./../app/components/com_members/resources/models/model_members')();
var new_member;
var new_member_no_pass_email;
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
        new_member = {name:"Bob", username:'foo', password: 'boo', email:'foo@bar.com', roles: [{name: "foo", tasks: []}], deleted: false};
        new_member_no_pass_email = {};
        _.each(new_member, function(value, key){
            switch (key){
                case 'password': break;
                case 'email': break;
                default:
                    new_member_no_pass_email[key] = value;

            }
        })
        framework = web({port:3001, mongoose:{db:'member_stream_test'}}, function () {
            member_model.empty(function () {
                _make_members(test);
            });
        });
    },

    test_invalid_member:function (test) {
        member_model.validate({}, function (v) {
            test.deepEqual(v.errors, {
                password:{
                    message:'Validator "required" failed for path password',
                    name:'ValidatorError',
                    path:'password',
                    type:'required' },
                email:{
                    message:'Validator "required" failed for path email',
                    name:'ValidatorError',
                    path:'email',
                    type:'required' },
                username:{
                    message:'Validator "required" failed for path username',
                    name:'ValidatorError',
                    path:'username',
                    type:'required' }
            }, 'blank (invalid) member errors');

            test.done();
        });
    },


    test_valid_member:function (test) {
        member_model.validate({email:'foo@nu.com', username:'boo', password: 'foo'}, function (v) {
          //  console.log('valid errors: %s', util.inspect(v))
            test.equal(v, null, 'valid member errors');
            test.done();
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
     //   console.log('new member put input: %s', util.inspect(new_member));
        request.put({uri:uri + 'members', json: new_member},
            function (e, res, body) {
                if (e) throw e;
                try {
             //       console.log('body: %s is a %s', util.inspect(body), typeof body);
                    var parsed_member = _.clone(body) ;
                } catch (err) {
                    test.ok(false, 'cannot parse body: ' + err.toString());
                    return test.done();
                }

                var id = parsed_member['_id'];
                delete parsed_member._id;
                test.deepEqual( new_member_no_pass_email, parsed_member,'added new member');

                request.get(uri + 'members/' + id, function (err, res, gbody) {
               //         console.log('getting ' + gbody);
                    if (_.isString(gbody)) gbody= JSON.parse(gbody);
                    test.deepEqual(body, gbody, 'get gets same member back');
                    test.done();
                });

            });

    },

    test_done:function (test) {
      //  member_model.empty();
        framework.server().close();
        test.done();
    }
};