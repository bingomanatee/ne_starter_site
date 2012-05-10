var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var task_schema = new mongoose.Schema(
    {_id:String, verbs:[String]}
);

var schema = new mongoose.Schema({
    _id:{type:String},
    label:{type:String, required:false},
    tasks:[task_schema],
    deleted:Boolean
});

var _model = mm.create(schema, {name:"members_roles", type:"model"});

module.exports = function () {

    return _model;

}