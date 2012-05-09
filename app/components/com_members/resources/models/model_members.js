var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name:{type:String, required:false},
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, require:true},
    deleted:Boolean
});

schema.statics.active = function(cb){
    return this.find('deleted', {'$ne': true}).run(cb);
}

schema.statics.inactive = function(cb){
    return this.find('deleted',true).run(cb);
}

var _model = mm.create(schema, {name:"members_members", type:"model"});

module.exports = function () {
    return _model;
}