const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    const payment = require('../controllers/payment.controller');

    app.post('/payment/gettoken', checkToken,payment.GetToken)
    app.post('/payment/checkstatus', checkToken,payment.CheckTransactionStatus)
    app.post('/payment/history', checkToken,payment.GetPaymentHistory)
    app.post('/payment/callback',payment.callback)
    app.post('/payment/payoffline',checkToken,payment.PayOffline)
    app.post('/payment/processoffline',checkToken,payment.ProcessOffline)
    app.post('/payment/getpaymentstatus',checkToken,payment.GetPaymentStatus)
   
}