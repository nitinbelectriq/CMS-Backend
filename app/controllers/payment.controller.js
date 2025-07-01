const https = require('https');
const PaytmChecksum = require('../helper/PaytmChecksum');
const config = require('../config/path-config');
const paymentModel = require("../models/payment.model");
const { TransactionDetails } = require('../models/payment.model');
const _utility = require("../utility/_utility");

const PaytmConfig = config.PaytmConfig;

const PaymentRequest = paymentModel.PaymentRequest;




  // Save Customer in the database
  
  exports.GetToken = (req, res) => {
  
  
    var paytmParams = {};
   

  paytmParams.body = {
    "requestType" : "Payment",
    "mid"           : PaytmConfig.mid,
    "websiteName"   : "WEBSTAGING",
    "orderId"       : "TEST_" + new Date().getTime(),
    "callbackUrl"   : '',
    "txnAmount"     : {
        "value"     : req.body.amount,
        "currency"  : "INR",
    },
    "userInfo"      : {
    "custId"    : req.body.userid,
    },
};
paytmParams.body.callbackUrl = PaytmConfig.callbackUrl + `ORDER_ID=${paytmParams.body.orderId}`
let final_res;
let token = PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), PaytmConfig.key).then(function (checksum) {


      paytmParams.head = {
          "signature": checksum
      };
     
      var post_data = JSON.stringify(paytmParams);
  
      var options = {
  
          /* for Staging */
          //hostname: 'securegw-stage.paytm.in',
          hostname : PaytmConfig.host,
  
          /* for Production */
          // hostname: 'securegw.paytm.in',
  
          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=${PaytmConfig.mid}&orderId=${paytmParams.body.orderId}`,
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': post_data.length
          }
      };
  
      var response = "";
      
     
      var post_req = https.request(options, function (post_res) {
          post_res.on('data', function (chunk) {
              response += chunk;
          });
  
          post_res.on('end', function () {
              response = JSON.parse(response)
          //  console.log('txnToken:', );
           final_res = {
                status: true,
                message:  response.body.txnToken.length > 0 ? 'Request Initiated' : 'Error',
                count: res.length,
                data: {
                   "token" : response.body.txnToken,
                   "orderid" : paytmParams.body.orderId,
                   "mid" : paytmParams.body.mid,
                   "amount" : req.body.amount,
                   "callbackurl" : paytmParams.body.callbackUrl
                }
              }

    
              let request = new PaymentRequest({
                order_id : paytmParams.body.orderId,
                user_id : req.body.userid,
                amount : req.body.amount,
                token : response.body.txnToken,
                currency : "INR",
                status : response.body.resultInfo.resultMsg,
                mobile_no : req.body.mobileno,
                payment_option : 1,
                request_source : 'App',
                email_id : '',
                charger_transaction_id :  req.body.transactionid,
              });
              PaymentRequest.Create(request, (err, data) => {
                if (err)
                res.status(500).send({
                  message:
                    err.message || "Some error occurred."
                });
              });
              console.log(response.body.txnToken);
              res.send(final_res);
         });
      });

     
      post_req.write(post_data);
      post_req.end();

      

  })

   
  };

  exports.CheckTransactionStatus = (req, res) => {
      //res.send("Success");

      if (!req.body.orderid) {
        res.status(400).send({
          message: "Order Id Missing!"
        });
      }

      var paytmParams = {};

/* body parameters */
    paytmParams.body = {

      "mid" : PaytmConfig.mid,
      "orderId" : req.body.orderid
    };

  //  console.log(paytmParams);
      PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), PaytmConfig.key).then(function(checksum){
        /* head parameters */
        paytmParams.head = {
    
            /* put generated checksum value here */
            "signature"	: checksum
        };
    
        /* prepare JSON string for request */
        var post_data = JSON.stringify(paytmParams);
    
       
        var options = {
    
           // hostname: 'securegw-stage.paytm.in',
           hostname : PaytmConfig.host,
            port: 443,
            path: '/v3/order/status',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
    
        // Set up the request
        var response = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });
    
            post_res.on('end', function(){
                response = JSON.parse(response);
                
                let request = new TransactionDetails({
                  txn_status : response.body.resultInfo.resultMsg,
                  resultCode :response.body.resultInfo.resultCode,
                  txn_message : response.body.resultInfo.resultMsg,
                  gateway_name : response.body.gatewayName,
                  orderId : response.body.orderId,
                  txnAmount : response.body.txnAmount,
                  txnDate:  response.body.txnDate,
                  bankName:response.body.bankName,
                  paymentMode: response.body.paymentMode,
                  bankTxnId :response.body.bankTxnId,
                  mid:response.body.mid,
                  
                  gatewayName : response.body.gatewayName,
                  txnId :  response.body.txnId
                  
                });
                PaymentRequest.InsertPaymentResponse(request);

                final_res = {
                  status: request.resultCode == '01' ? true : false,
                  message: request.resultCode == '01' ? 'Success' : 'Fail',
                  count: res.length,
                  data: request
                }
                res.send(final_res);
            });
        });
    
        // post the data
        post_req.write(post_data);
        post_req.end();
    });

   // res.send('Ok');
  }

  exports.GetPaymentHistory = (req, res) => {
    res.send("Success");
  }

  exports.callback = (req, res) => {
    let request = new TransactionDetails({

      txn_status : '',
      resultCode : '',
      txn_message :  '',
      gateway_name :  '',
      orderId : 'testing',
      txnAmount :  '',
      txnDate:   '',
      bankName:  '',
      paymentMode:  '',
      bankTxnId :  '',
      mid: '',
      gatewayName : '',
      txnId :   '',
      
    });
    PaymentRequest.InsertPaymentResponse(request);
    res.send("Success");
  }


  exports.PayOffline = (req, res) => {
  
    let request = new PaymentRequest({
      order_id : "TEST_" + new Date().getTime(),
      user_id : req.body.userid,
      amount : req.body.amount,
      token : '',
      currency : "INR",
      status : 'PCPO',
      mobile_no : req.body.mobileno,
      payment_option : 2,
      request_source : 'App',
      email_id : '',
      charger_transaction_id :  req.body.transactionid,
      
    });
    PaymentRequest.Create(request, (err, data) => {
      if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      });
      data.message = "Request Initiated Successfully, Pending with Service Operator for approval."
      data.data = request;
      res.send(data);
    });
  
   
  };


exports.ProcessOffline =  (req, res) => {

  if (!req.body.orderid) {
    res.status(400).send({
      message: "Order Id Missing!"
    });
  }

  if (!req.body.updatedBy) {
    res.status(400).send({
      message: "Update by Id Missing!"
    });
  }
  // paytmParams.body = {

  //   // "station_id" : station_id,
  //    "orderId" : req.body.orderid,
  //    "action" : req.body.action,
  //    "remark" : req.body.remark,
  //    "cpo_id" :  req.body.cpo_id,
  //    "amount" : req.amount,
  //  };

  //let orderIds =  _utility.getArraytoSingleQuoteString(req.body.orderid)

  let request = new TransactionDetails({
    txn_status :  req.body.action == 'A' ? 'SUCCESS' : 'REJECT',
    orderId : req.body.orderid[0],
    resultCode : '01',
    txn_message :  req.body.action == 'A' ? 'Cash Payment accepted By Service Operator' : 'Payment Rejected By Service Operator',
    gateway_name : 'Offline',
    txnDate:  new Date().getTime(),
    bankName:'',
    paymentMode:'CASH',
    bankTxnId :'',
    txnAmount : req.body.amount,
    mid:'',
    gatewayName : 'CASH',
    txnId :  ''
  });

  TransactionDetails.ProcessOfflinePayment(request, (data) => {
    //console.lo
    res.send(data)
  });
};




exports.GetPaymentStatus = (req, res) => {
  
  if (!req.body.orderid) {
    res.status(400).send({
      message: "Order Id Missing!"
    });
  }

  let request = new PaymentRequest({
    order_id : req.order_id,
    charger_transaction_id :  req.charger_transaction_id,
  });
  PaymentRequest.getPaymentStatus(req.body.orderid, data => {
    if (err)
    // res.status(500).send({
    //   message:
    //     err.message || "Some error occurred."
    // });

    res.send(data)
  });

 
};

exports.GetPaymentStatus =  (req, res) => {
  if (!req.body.orderid) {
    res.status(400).send({
      message: "Order Id Missing!"
    });
  }

  PaymentRequest.getPaymentStatus(req.body.orderid, (data) => {
    //console.lo
    res.send(data)
  });
};