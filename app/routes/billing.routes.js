const { checkToken } = require('../middleware/jwt.js');
const billingController = require('../controllers/billing.controller.js');

module.exports = (app) => {
  // Generate Bill
  app.post('/billing/generate', checkToken, billingController.generateBill);

  // Billing list (role-based)
  app.get('/billing/list/:login_id', checkToken, billingController.getBillingList);

  // View Bill by ID ✅ (for View Dialog)
  app.get('/billing/view/:bill_id', checkToken, billingController.getBillById);

  // Update Bill ✅ (for Edit Dialog)
  app.put('/billing/update', checkToken, billingController.updateBill);

  // Download Invoice PDF
  app.get('/billing/invoice/:bill_id', checkToken, billingController.downloadInvoice);

  // GST list
  app.get('/gst/list/:login_id', checkToken, billingController.getGSTList);

  // GST update
  app.put('/gst/update', checkToken, billingController.updateGST);
};
