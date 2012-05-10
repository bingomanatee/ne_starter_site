var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var task = new mongoose.Schema({
    task: String,
    verbs: [String]
})

var schema = new mongoose.Schema({
    name:{type:String, required:false},
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    deleted: {type: Boolean, "default": false},
    tasks: [{
        _id: String,
        verbs: [String]
    }],
    roles: [{
        _id: String,
        verbs: [String]
    }],

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