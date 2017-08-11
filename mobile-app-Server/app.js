var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var request = require('request');
var retailers_model = require('./models/retailers');
var recharges_model = require('./models/recharges');
var rechargeCodes_model = require('./models/rechargeCodes.js');
var bunyan = require('bunyan');

// logger for logging errors in the log file
var log = bunyan.createLogger({
  name: 'myapp',
  streams: [{level: 'error',path: 'myapp-error.log'}]
});
//var User   = require('./app/models/user'); // get our mongoose model
var apiRoutes = express.Router();
app.use(cors())
mongoose.connect(config.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected to database")
});
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
// connect to database
app.set('superSecret', config.secret); // secret variable
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

//=============================================================================================================//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                   All the Routes are written below                                        =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=============================================================================================================//
apiRoutes.get('/getOperatorAndCircleDetail', function(req, res) {


  rechargeCodes_model.findOne({"api_name":"saksham_r2"},function(err,codes){
    if(err){
      res.json({success:false,isError:true,err:err})
    }
    else{
        res.json({success:true,isError:false,codes:codes})
    }
  })
});


apiRoutes.post('/signup', function(req, res) {
    var user = new retailers_model({
        user_id: 'am@gmail.com',
        user_password: 'ameya123',
        user_role: 'retailer'
    });
    user.save(function(err) {
        if (err) console.log('Unable to save');
        else {
            console.log('saved');
            res.json({
                message: 'added success'
            })
        }
    });
});

apiRoutes.post('/authenticate', function(req, res) {
    console.log(req.body)
    retailers_model.findOne({
        'user_id': req.body.userId
    }, function(err, user) {
        if (err) {
            console.log(err)
            res.json({
                success: false,
                message: err,
                isError: true
            })
        } else {
            if (user) {
                if (user.user_password === req.body.userPassword) {
                    var token = jwt.sign(user, app.get('superSecret'), {});
                    userId = user['user_id'].split("@")[0]
                    console.log(userId)
                    res.json({
                        success: true,
                        message: 'Token provided',
                        token: token,
                        user_id: userId,
                        user_num_id:user['user_num_id'],
                        user_balance:user['user_balance'],
                        user_total_amount:user['user_total_amount'],
                        user_margin:user['user_margin'],
                        user_role:user['user_role'],
                        isError: false
                    });
                } else {
                    res.json({
                        success: false,
                        errorCode: 1,
                        isError: false
                    })
                }
            } else {
                res.json({
                    success: false,
                    errorCode:2,
                    isError: false
                })
            }
        }
    });
});


// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//=============================================================================================================//
//=                                                                                                           =//
//=                                                                                                           =//
//=                                All the Routes after checking the json web token                           =//
//=                                                                                                           =//
//=                                                                                                           =//
//=============================================================================================================//
/*------------------------route for doing the recharge----------------------*/
apiRoutes.post('/recharge', function(req, res) {
    var data = {} 
    console.log(req.body)
    reduceRetailerBalance(req.body,function(retailResponse){
        if(retailResponse.catch){
            res.json({success:false,data:{requestBody:req.body},isDisputed:false,doRefund:true})
        }
        else{
            if(retailResponse.callRechareApi){
            data = {requestBody:req.body,callRechareApi:true}
            doRecharge(data,function(apiResponse){
                if(apiResponse.catch){
                    res.json({success:false,data:data,isDisputed:false,doRefund:true})
                }
                else{
                  data.apiData = apiResponse.response;
                  if(apiResponse.response.status == "3" || apiResponse.response.status == "5" ) {
                    console.log("-------------------------------------------------------------")
                    console.log("The status is ",apiResponse.response.status)
                                        console.log("-------------------------------------------------------------")
                    refundRetailerBalance(data,function(refundResponse){
                        if(refundResponse.catch){
                            res.json({success:false,data:data,isDisputed:true,doRefund:false})
                        }
                        else{
                          updateRechargeData(data,function(rechargeResponse){
                            if(rechargeResponse.catch){
                                res.json({success:false,data:data,isDisputed:true,doRefund:false})
                            }
                            else{  
                            res.json({success:true,data:data});
                            }
                          })
                        }
                    });
                  }
                  else{
                    updateRechargeData(data,function(rechargeResponse){
                        console.log("requestData",data);
                        if(rechargeResponse.catch){
                            res.json({success:false,data:data,isDisputed:true,doRefund:false})
                        }
                        else{
                        res.json({success:true,data:data});

                        }
                    })
                  }
                }
            });
            }
            else{
            data = {requestBody:req.body,callRechareApi:false}
            updateRechargeData(data,function(rechargeResponse){
                if(rechargeResponse.catch){
                    res.json({success:false,data:data,isDisputed:true,doRefund:false})
                }
                else{
              res.json({success:false,data:data,isDisputed:false,doRefund:true});
                }
            })
            }
        }
    })

    //end of the recharge route//
});
/*------------------------route for getting today's recharge----------------------*/
apiRoutes.get('/todayrecharge/:userId', function(req, res) {
  try{
    today_date = new Date().toDateString()
    recharges_model.find({
        user_id: req.params.userId,
        recharge_dateString: today_date
    }, function(err, data) {
        if (err) {
            res.json({
                success: false,
                isError: true,
                message: err
            })
        } else {
            res.json({
                success: true,
                isError: false,
                data: data
            })
        }
    }).sort({recharge_date:"desc"})
  }
  catch(err){
    console.log(err)
  }
});

// route for getting the recharge history //
apiRoutes.get('/history/:userId', function(req, res) {
  try{
    recharges_model.find({
        user_id: req.params.userId
    }, function(err, data) {
        if (err) {
            res.json({
                success: false,
                isError: true,
                message: err
            })
        } else {
            res.json({
                success: true,
                isError: false,
                data: data
            })
        }
    }).sort({recharge_date:"desc"})
  }
  catch(err){
    console.log(err)
  }
});



//route for getting the balance of a user//
apiRoutes.get('/getBalance/:userId', function(req, res) {
  try{ 
    retailers_model.findOne({user_id:req.params.userId},function(err, data){
        console.log(data)
      if(err){
        res.json({
          success:false,
          isError:true,
          message:err
        })
      }
      else{
        res.json({
          success:true,
          isError:false,
          user_balance:data.user_balance,
          user_total_amount:data.user_total_amount,
          user_margin:data.user_margin,
          user_role:data.user_role
        })
      }
    })
  }
  catch(err){
    console.log(err)
  }
});

//route for getting the balance of a user//
apiRoutes.get('/getEarnings/:userId', function(req, res) {
  try{ 
    retailers_model.findOne({user_id:req.params.userId},function(err, data){
        console.log(data)
      if(err){
        res.json({
          success:false,
          isError:true,
          message:err
        })
      }
      else{
        if(data.user_total_amount >= 0 && data.user_total_amount < 100000){
                myEarning = (data.user_total_amount *2.2)/100
            }else if(data.user_total_amount >= 100000 && data.user_total_amount < 200000){
                myEarning = ((100000*2.2)/100) +(((data.user_total_amount - 100000)*2.5)/100)
            }else if(data.user_total_amount >= 200000){
                myEarning = ((100000*2.2)/100) +(((100000)*2.5)/100) +(((data.user_total_amount - 200000)*2.75)/100)
            }
        res.json({
          success:true,
          isError:false,
          user_balance:data.user_balance,
          user_total_amount:data.user_total_amount,
          earnings:myEarning
        })
      }
    })
  }
  catch(err){
    console.log(err)
  }
});


// route for getting the recharge history //
apiRoutes.get('/rechargestatus/:rechargeId', function(req, res) {
  try{
    recharges_model.findOne({recharge_api_trnid:req.params.rechargeId},function(err,recharge){
        if(err){

        }
        else{
            if(recharge !=  null){
                console.log("THe user is",recharge);
                url = "http://mobilerechargeapi.in:8090/httpapi/status?email=ameya.shukla4@gmail.com&api_key="+config.recharge_api.api_key+"&transaction_id="+req.params.rechargeId
                request(url, function(error, response, body) {
                    if (!error) {
                        body= JSON.parse(body)
                        recharge.recharge_status = body.status
                        recharge.save(function(err,updatedRecharge){
                            if(err){

                            }else{
                                if(body.status == "3"){
                                    console.log("123");
                                    requestData = {requestBody:{userId:recharge.user_id,rechargeData:{amount:body.dr}}}
                                    refundRetailerBalance(requestData,function(refundResponse){
                                    console.log(refundResponse);
                                    if(!refundResponse.catch){
                                        res.json({success:true,response:body})
                                    }
                                    else{
                                        res.json({success:false,isDisputed:true})
                                    }
                                    })
                            }else{
                                res.json({success:true,response:body})
                            }

                            }

                        })
                        
                        
                    } else {
                        //console.log("req rechagre",error)
                    }
                })
            }
        }
    })
    //console.log("The recharge_id",req.params.rechargeId)
  //try finished
  }
  catch(err){

  }
});


// route for getting the account information //
apiRoutes.get('/account/:userId', function(req, res) {
  try{


    retailers_model.findOne({
        user_id: req.params.userId
    }, function(err, data) {
        if (err) {
            res.json({
                success: false,
                isError: true,
                message: err
            })
        } else {
            res.json({
                success: true,
                isError: false,
                data: data
            })
        }
    })
  }
  catch(err){
    console.log(err)
  }
});


//*****************************************************************************************************************//

/*--------------------------------------------functions for various operation---------------------------------*/

//*****************************************************************************************************************//

// doRecharge function will call the recharge api and return the response //
var doRecharge = function(requestData, callback) {
  try{
  //console.log("The Do Recharge input is:"+JSON.stringify(requestData));
    /*url =  "http://mobilerechargeapi.in:8090/httpapi_r2/recharge-request?"
         +"email="+config.recharge_api.user_id
         +"&api_key="+config.recharge_api.api_key
         +"&recharge_operator="+requestData.requestBody.rechargeData["operator"]
         +"&recharge_circle="+requestData.requestBody.rechargeData["circle"]
         +"&recharge_number="+requestData.requestBody.rechargeData["phoneNumber"]
         +"&amount="+requestData.requestBody.rechargeData["amount"]
         +"&recharge_type="+requestData.requestBody.rechargeData["type"];
        
        request(url, function(error, response, body) {
        if (!error) {
            callback({catch:false,response:JSON.parse(body)})
        } else {
            console.log("req rechagre",error.code)
            response = {
                "_id": "0000",
                "status": "5",
                "message": error.code,
                "operator_id": "",
              }
            callback({catch:false,response:response})
        }
    })*/
    setTimeout(function(){
        response = {
                    "_id": "58ac7558dbe245605f250d792",
                    "status": "1",
                    "message": "success",
                    "operator_id": "",
                    "cr": 0.24,
                    "dr": 8
                  };
         callback({catch:false,response:response})     
    },2000);
    }
    catch(err){
        requestData.errorMessage = err
        requestData.errorFunction = "doRecharge"
        log.error({data:requestData});
        callback({catch:true})
        
    }  
}

var refundRetailerBalance = function(requestData, callback) {
  try{
  console.log("the request Data is for Refund:"+requestData.requestBody.userId,requestData.requestBody.rechargeData.amount)
    retailers_model.findOne({user_id:requestData.requestBody.userId},function(err,user){
      if(err){
        console.log("Eror"+err)
      }
      else{
        if(user.user_total_amount >= 0 && user.user_total_amount < 100000){
            margin = 2.2;
        }else if(user.user_total_amount >= 100000 && user.user_total_amount < 200000){
            margin = 2.5;
        }else if(user.user_total_amount >= 200000){
            margin = 2.75;
        }
        console.log(user.user_balance)
        user.user_balance = user.user_balance + Number(requestData.requestBody.rechargeData.amount) - ((Number(requestData.requestBody.rechargeData.amount)*margin)/100);
        user.user_total_amount = user.user_total_amount - Number(requestData.requestBody.rechargeData.amount)
        user.save(function(err,updatedUser){
          if(err){
            console.log(err);
          }
          else{
            console.log(updatedUser.user_balance);
            callback({catch:false,refund:true});
          }
        });       
        }
    });
  }
  catch(err){
    console.log(err)
    requestData.errorMessage = err
    requestData.errorFunction = "refundRetailerBalance"
    log.error({data:requestData});
    callback({catch:true})
    
  }
}

//  reduceRetailerBalance will update the retailers current balance after getting the reponse from the recharge api //
var reduceRetailerBalance = function(requestData, callback) {
    try{
    console.log("reduce is",requestData.userId)
    retailers_model.findOne({user_id:requestData.userId},function(err,user){
      if(err){
        console.log("Eror"+err)
      }
      else{
        console.log(user.user_balance,Number(requestData.rechargeData.amount))
        if(user.user_total_amount >= 0 && user.user_total_amount < 100000){
            margin = 2.2;
        }else if(user.user_total_amount >= 100000 && user.user_total_amount < 200000){
            margin = 2.5;
        }else if(user.user_total_amount >= 200000){
            margin = 2.75;
        }
        if(user.user_balance >=  Number(requestData.rechargeData.amount) )
        {
        user.user_balance = user.user_balance - Number(requestData.rechargeData.amount) + ((Number(requestData.rechargeData.amount)*margin)/100);
        
        user.user_total_amount = user.user_total_amount + Number(requestData.rechargeData.amount);
        user.save(function(err,updatedUser){
          if(err){
            console.log(err);
          }
          else{
            console.log(updatedUser);
            callback({catch:false,callRechareApi:true});
          }
        });       
        }
        else{
          callback({catch:false,callRechareApi:false});
        }
      }
    });
  }
  catch(err){
    console.log(err)
    requestData.errorMessage = err
    requestData.errorFunction = "reduceRetailerBalance"
    log.error({data:requestData});
    callback({catch:true});
    

  }
}
// updateRechargeData will create a record in the recharge table //
var updateRechargeData = function(requestData, callback){
  try{
  console.log("The updateRechargeData: "+JSON.stringify(requestData))
  var d = new Date()
  var trnrefno = requestData.requestBody.userId+""+d.getTime();
  requestData.requestBody.rechargeData['recharge_dateString'] = new Date().toDateString()
  if(requestData.callRechareApi){
    var user = new recharges_model({ 
      user_id: requestData.requestBody.userId,
      phone_number : requestData.requestBody.rechargeData['phoneNumber'],
      operator : requestData.requestBody.rechargeData['operator'],
      recharge_type : requestData.requestBody.rechargeData['type'],
      recharge_amount: requestData.requestBody.rechargeData['amount'],
      recharge_date:new Date(),
      recharge_dateString:requestData.requestBody.rechargeData['recharge_dateString'],
      recharge_status:requestData.apiData['status'],
      recharge_api_trnid:requestData.apiData['_id'],
      recharge_simplecharge_id:trnrefno,
      recharge_api_operator_id:requestData.apiData['operator_id'],
      recharge_api_message:requestData.apiData['message']
    });
    user.save(function(err) {
      if(err){
        console.log("user ki maaka")
      }
      else{
        console.log('saved');
        msg = "success"
        callback({catch:false,msg:msg})
      }
    });  
  }
  else{
    var user = new recharges_model({ 
      user_id: requestData.requestBody.userId,
      phone_number : requestData.requestBody.rechargeData['phoneNumber'],
      operator : requestData.requestBody.rechargeData['operator'],
      recharge_type : requestData.requestBody.rechargeData['type'],
      recharge_amount: requestData.requestBody.rechargeData['amount'],
      recharge_date:new Date(),
      recharge_status:'4',
      recharge_simplecharge_id:trnrefno,
      recharge_dateString:requestData.requestBody.rechargeData['recharge_dateString'],
      recharge_error:"Insufficient Balance"
    });
    user.save(function(err) {
      if(err){
        console.log("kamal kaka",err);
      }
      else{
        console.log('saved');
        errorMessage  = "inSufficientBalance"
        callback({catch:false,errorMessage: errorMessage})
      }
    });  
  }
    }
    catch(err){
        console.log(err);
        requestData.errorMessage = err
        requestData.errorFunction = "updateRechargeData"
        log.error({data:requestData});
        callback({catch:true})
        
    }
  }
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);