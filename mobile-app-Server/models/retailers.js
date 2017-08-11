var mongoose = require('mongoose');
var Schema = mongoose.Schema
var retailers = new Schema({
	user_id : {type : String, index:{unique: true}},
	user_password : {type:String},
	user_role : {type:String},
	user_balance : {type:Number},
	user_num_id:{type:String},
	user_margin:{type:Number},
	user_total_amount:{type:Number}
})

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('retailers',retailers);

