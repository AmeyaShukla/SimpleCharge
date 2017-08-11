/*www.backnpay.com/biztechwebapi/service.ashx?MethodName=MobileRecharge&REQTYPE=MRCH&
UID=9940181302&PWD=4302&OPCODE='A'&CMOBNO=9940181302&AMT=10&STV=0&TRNREFNO=123456



735 859 762 7


RESPTYPE=MRCH&STCODE=1&STMSG=Transaction No: 23135 is Failed&TRNID=23135&BAL=500.00&OPRREFNO=0000

RESPTYPE=MRCH&STCODE=0&STMSG=Transaction No: 23149 is Success&TRNID=23149&BAL=490.00&OPRREFNO=58934*/


    /*doRecharge(url, function(response) {
        data = {
          apiData:response,
          appData:req.body,
          trnrefno:trnrefno
        }
        if(response.res_status == "1" || response.res_status == "9"){
          console.log("only recharge")
          updateRechargeData(data,function(response){
            if(response == "success"){
            res.json({success:false,isError:false,message:"transation failed by api",doRefund:true})
          }

          })
        }
        else{
          console.log("Both")
          reduceRetailerBalance(data, function(response){
            res.json({success:true,isError:false,message:"transation successful",doRefund:false})
          });  
        }

    });*/