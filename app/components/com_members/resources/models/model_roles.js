var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var task_schema = new mongoose.Schema({
        name: String,
        verbs:[String]
    }
);

var schema = new mongoose.Schema({
    name: {type: String, required: true},
    label:{type:String, required:false},
    tasks:[task_schema],
    deleted:Boolean
});

schema.statics.active = function(cb){
    return this.find({'deleted': {'$ne': true}}).run(cb);
}

var _model = mm.create(schema, {name:"members_roles", type:"model"});

module.exports = function () {

    return _model;

}