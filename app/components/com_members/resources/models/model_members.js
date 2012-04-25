var mm = require('support/mongoose_model');

var _model;

module.exports = function(){

    if (!_model){
        _model = mm.create({
            "name": {type: String, required: true},
            "email" : {type: String, required: true},
            "password": {type: String, require: true}
        }, {name: "members_members", type: "model"})
    }

    return _model;

}