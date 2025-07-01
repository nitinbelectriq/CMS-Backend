const { checkToken } = require('../middleware/jwt.js');

module.exports = app =>{

    const orders = require('../controllers/order.controller');

    app.post('/order/processorder',checkToken,orders.ProcessOrders)
    app.post('/order/getpendingtransactionSW',checkToken,orders.GetPendingOrderList)
    app.post('/order/getusertransactionsummary',checkToken,orders.GetUserTransactionSummary)
    app.post('/order/gettransactiondetails',checkToken,orders.GetPendingOrderList)
}