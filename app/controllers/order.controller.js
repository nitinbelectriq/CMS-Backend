const orderModule = require("../models/order.model");

const OrderSummary = orderModule.OrderSummary;
const VwOrderSummary = orderModule.VwOrderSummary;

  exports.ProcessOrders =  (req, res) => {
    if (!req.body.charger_transaction_id) {
      res.status(400).send({
        message: "Charger Transaction Id Missing!"
      });
    }

    OrderSummary.ProcessOrder(req.body.charger_transaction_id, (data) => {
      //console.lo
      res.send(data)
    });
  };


  exports.GetPendingOrderList =  (req, res) => {
   
    if (!req.body.station_id) {
      res.status(400).send({
        message: "Station Id Missing!"
      });
    }

    VwOrderSummary.getPendingOrderStationW(req.body.station_id, (data) => {
      //console.lo
      res.send(data)
    });
  };


  exports.GetUserTransactionSummary =  (req, res) => {
   
    if (!req.body.user_id) {
      res.status(400).send({
        message: "User Id Missing!"
      });
    }

    VwOrderSummary.getUserOrderSummary(req.body.user_id, (data) => {
      //console.lo
      res.send(data)
    });
  };


  exports.GetRecentTransaction =  (req, res) => {
   
    if (!req.body.user_id) {
      res.status(400).send({
        message: "User Id Missing!"
      });
    }

    OrderSummary.getRecentTransactionCW(req.body.user_id, (data) => {
      //console.lo
      res.send(data)
    });
  };


  exports.GetPaymentDailySummmaryCW =  (req, res) => {
   
    if (!req.body.user_id) {
      res.status(400).send({
        message: "User Id Missing!"
      });
    }

    OrderSummary.getPaymentSummaryCW(req.body.user_id, (data) => {
      //console.lo
      res.send(data)
    });
  };