var web = require('./../web');
var uri = 'http://localhost:3001/';
var request = require('request');
var task_model = require('./../app/components/com_members/resources/models/model_tasks')();
var role_model = require('./../app/components/com_members/resources/models/model_roles')();
var new_role;
var factory = require('support/mongoose_model/factory');
var fs = require('fs');
var _ = require('underscore');
var qs = require('querystring');
var util = require('util');

var verbs = ['create', 'update', 'view', 'delete'];
function _random_verbs() {
    var out_verbs = _.filter(verbs, function () {
        return (Math.random() > 0.5) ? true : false
    });
}

function _gen_task(index) {
    return {
        name:'task_' + index,
        label:'Task ' + index
    };
}

var tasks;

function _make_models(test) {
    factory(task_model, _gen_task, 8, function (err, result) {
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

        tasks = result;

        fs.writeFile(__dirname + '/tasks.last_dataset.json', JSON.stringify(result),
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
        new_member = {name:"Bob", username:'foo', email:'foo@bar.com'};
        framework = web({port:3001, mongoose:{db:'role_test'}}, function () {
            task_model.empty(function () {
                role_model.empty(function () {
                    _make_models(test);
                });
            })
        });
    },

    test_make_role:function (test) {
        var role_data = {name: 'role_1', label: 'Role 1' };
        var task_data = tasks[0].toJSON();
        delete task_data._id;
        role_data.tasks = [task_data];
        role_model.put(role_data, function(err, role){
            test.deepEqual(role.toJSON(), role_data);
            test.done();
        })
    },

    test_done:function (test) {
        task_model.empty();
        role_model.empty();
        framework.server().close();
        test.done();
    }
};