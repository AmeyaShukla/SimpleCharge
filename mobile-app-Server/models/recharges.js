var mongoose = require('mongoose');
var Schema = mongoose.Schema
var recharge = new Schema({
	user_id:{type:String},
	phone_number : {type : String},
    operator : {type:String},
    recharge_type : {type:String},
    recharge_amount:{type:String},
    recharge_status:{type:String},
    recharge_date:{type:Date},
    recharge_dateString:{type:String},
    recharge_api_trnid:{type:String},
    recharge_simplecharge_id:{type:String},
    recharge_api_operator_id:{type:String}
})

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('recharges',recharge);
