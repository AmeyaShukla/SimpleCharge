var mongoose = require('mongoose');
var Schema = mongoose.Schema

var operatorCode = new Schema({ 
    name: {type:String},
    code:{type:String}
    });
var circleCode = new Schema({
    name: {type:String},
    code:{type:String}
})
var typeCode = new Schema({
    name: {type:String},
    code:{type:String}
})
var Feature = new Schema({
    code: {type:String},
    content:{type:String}
})
var companyInfo = new Schema({
    number: {type:String},
    Address:{type:String},
})
var rechargeCodes = new Schema({
  api_name:{type:String},
  operatorCode: [operatorCode],
  circleCode:[circleCode],
  typeCode:[typeCode],
})
// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('rechargeCodes',rechargeCodes);

