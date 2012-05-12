var mm = require('support/mongoose_model');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name:{type:String},
    label:{type:String, required:false},
    deleted:{type: Boolean, 'default': false}
});

schema.statics.active = function(cb){
    return this.find({'deleted': {'$ne': true}}).run(cb);
}

var _model = mm.create(schema, {name:"members_tasks", type:"model"});

module.exports = function () {

    return _model;

}