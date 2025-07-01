const { isNullOrUndefined } = require("util");
const { sql, pool } = require("./db.js");
const util = require('util');

const Token = function (token) {
    this.txttoken = this.txttoken
};

const PaymentRequest = function (payment) {
      this.id = payment.id,
      this.order_id = payment.order_id,
      this.user_id = payment.user_id,
      this.request_source = payment.request_source,
      this.payment_option = payment.payment_option,
      this.currency = payment.currency  ,
      this.amount = payment.amount,
      this.email_id = payment.email_id,
      this.mobile_no = payment.mobile_no,
      this.status = payment.status,
      this.created_date = payment.created_date,
      this.modify_date = payment.modify_date,
      this.token = payment.token
      this.charger_transaction_id = payment.charger_transaction_id
};

const TransactionDetails = function (payment) {
  
  this.txn_status = payment.txn_status,
  this.txn_message = payment.txn_message,
  this.gateway_name = payment.gateway_name,
  this.txn_date = payment.txnDate,
  this.orderId = payment.orderId  ,
  this.txnAmount = payment.txnAmount,
  this.bankName = payment.bankName,
  this.paymentMode = payment.paymentMode,
  this.txnId = payment.txnId,
  this.bank_transaction_id = payment.bankTxnId,
  this.mid = payment.mid,
  this.resultCode = payment.resultCode,
  this.gatewayName = payment.gatewayName
};
  
PaymentRequest.Create = async (payment, result) => {
    var datetime = new Date();
   
    let stmt = `INSERT INTO payment_request_log
    (order_id,user_id,charger_transaction_id,request_source,payment_option,prl_currency,prl_amount,email_id,mobile_no,prl_status,token,created_date)
    VALUES ('${payment.order_id}','${payment.user_id}','${payment.charger_transaction_id}','${payment.request_source}','${payment.payment_option}',
      '${payment.currency}','${payment.amount}','${payment.email_id}','${payment.mobile_no}','${payment.status}',
      '${payment.token}','${datetime.toISOString().slice(0, 10)}') `;
  console.log(stmt);
    let final_res = {};
    let resp;
  
    try {
      
      resp = await pool.query(stmt);
      final_res = {
        status: true,
        message: 'Request Initiated Successfully',
        data: payment
      }
  
    } catch (e) {
      final_res = {
        status: false,
        message: `ERROR : ${e.message} `,
        data: []
      }
    } finally {
      result(null, final_res);
    }
  };

  PaymentRequest.InsertPaymentResponse = async (request) => {
    
    let qry = `call proc_InsertPaymentResponse('${request.orderId}','${request.mid}','${request.txnAmount}','${request.txnId}','${request.bank_transaction_id}',
    '${request.txn_status}','${request.resultCode}','${request.txn_message}','${request.txn_date}','${request.bankName}','${request.paymentMode}','${request.gatewayName}')`
    
   let resp;
  
  try {
    resp = await pool.query(qry);
    
  } catch (e) {
    console.log(e.stack);
  
  } finally {
    
  }
    
  };

  TransactionDetails.CheckTransactionStatus = async (request) => {
    
    let qry = `call proc_InsertPaymentResponse('${request.orderId}','${request.mid}','${request.txnAmount}','${request.txnId}','${request.bank_transaction_id}',
    '${request.txn_status}','${request.resultCode}','${request.txn_message}','${request.txn_date}','${request.bankName}','${request.paymentMode}','${request.gatewayName}')`
    
   let resp;
    
    try {
      resp = await pool.query(qry);
      
    } catch (e) {
      console.log(e.stack);
    
    } finally {
      
    }
    
  };


    
  TransactionDetails.ProcessOfflinePayment = async (request, result) => {

 
    let qry = `call proc_processOfflinePayment('${request.orderId}','${request.mid}','${request.txnAmount}','${request.txnId}','${request.bank_transaction_id}',
    '${request.txn_status}','${request.resultCode}','${request.txn_message}','${request.txn_date}','${request.bankName}','${request.paymentMode}','${request.gatewayName}', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`
  

    let resp;
    let final_result;
    try {
    resp = await pool.query(qry);
      if (resp.length > 2) {
     
        final_result = {
          status: true,
          message: resp[2][0].OP_ErrorDetail,
          count: 1,
          data: resp[1][0]
        }
      } else {
      
        final_result = {
          status: false,
          message:resp[1][0].OP_ErrorDetail,
          count: 0,
          data: []
        };
      }
    } catch (e) {
      //;
      console.log(e.stack);
      final_result = {
        status: false,
        message: `ERROR : ${e.code}`,
        count: 0,
        data: []
      };
    } finally {
      result(final_result) ;
  }
};


PaymentRequest.getPaymentStatus = async (id, result) => {

  // let stmt = `SELECT order_id,user_id,charger_transaction_id, CASE payment_option  WHEN '1' THEN 'ONLINE' WHEN '2' THEN 'OFFLINE' END payment_option
  // , CASE prl_status WHEN 'PCPO' THEN 'PENDING WITH SERVICE OPERATOR'  WHEN 'Success' THEN 'SUCCESS' ELSE 'PENING' END prl_status
  //  FROM payment_request_log WHERE order_id = '${id}'`;

// let qry = `call Proc_GetPaymentStatus('${id}',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail`
   let qry = "SET @OP_ErrorCode = 0; call Proc_GetPaymentStatus('"+id+"', @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "
  

    let resp;
    let final_result;
    try {
    resp = await pool.query(qry);
      if (resp.length > 2) {
     
        final_result = {
          status: resp[3][0].OP_ErrorDetail == 'SUCCESS' ? true: false,
          message: resp[3][0].OP_ErrorDetail,
          count: 1,
          data: resp[1][0]
        }
      } else {
      
        final_result = {
          status: false,
          message:'',
          count: 0,
          data: []
        };
      }
    } catch (e) {
      //;
      console.log(e.stack);
      final_result = {
        status: false,
        message: `ERROR : ${e.code}`,
        count: 0,
        data: []
      };
    } finally {
      result(final_result) ;

  
  }
};



async function generatedInvoice(order)  {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      const content = fs.readFileSync( path.resolve(__dirname, './app/templates/invoice.html'),
          'utf-8'
      )
      var template = handlebars.compile(content)
      var data = { "station_name":  "HFCL" }
      var result = template(data);
    let pdfname = order.transaction_id + ".pdf"
      await page.setContent(result)
      const buffer = await page.pdf({
          printBackground : true,
          displayHeaderFooter : true,
          path : pdfname,
          format: 'A4',
          printBackground: true,
          margin: {
              left: '0px',
              top: '0px',
              right: '0px',
              bottom: '0px'
          }
      })
              await browser.close()
    // resp.end(buffer)
    resp.send('success');
    
}

module.exports = {
  PaymentRequest: PaymentRequest,
  TransactionDetails : TransactionDetails
 
};