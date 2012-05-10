var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id:{type:String},
    label:{type:String, required:false},
    tasks: [{name: String, verbs: [String]}],
    deleted:Boolean
});




var _model = mm.create(schema, {name:"members_roles", type:"model"});

module.exports = function () {

    return _model;

}