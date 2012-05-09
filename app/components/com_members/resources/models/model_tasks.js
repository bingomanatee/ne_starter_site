var mm = require('support/mongoose_model');

var _model = mm.create({
    _id:{type:String},
    label:{type:String, required:false},
    verbs:[String],
    deleted:Boolean
}, {name:"members_tasks", type:"model"});

module.exports = function () {

    return _model;

}