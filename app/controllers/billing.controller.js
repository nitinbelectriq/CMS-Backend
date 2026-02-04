// app/controllers/billing.controller.js
const path = require('path');
const fs = require('fs');
const Billing = require('../models/billing.model.js');
const { generateInvoicePDF } = require('../utility/pdf.utility.js');
const { sendEmail } = require('../utility/email.utility.js');
const axios = require("axios");
const BASE_API =  "http://116.203.172.166:4100";


// ✅ Generate Bill 
// ✅ Generate Bill (FINAL & SAFE)
exports.generateBill = async (req, res) => {
  debugger
  try {
    const {
      station_id,
      tariff_id,
      state_id,
      units_consumed,
      created_by
    } = req.body;

    if (!station_id || !tariff_id || !state_id || !units_consumed) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields'
      });
    }

    // 🔒 VALIDATE STATION–TARIFF MAPPING
    const isMapped = await Billing.isStationTariffMapped(
      station_id,
      tariff_id
    );

    if (!isMapped) {
      return res.status(400).json({
        status: false,
        message: 'Selected tariff is not mapped to this station'
      });
    }

    // ✅ Tariff details
    const tariff = await Billing.getTariffDetails(tariff_id);
    if (!tariff) {
      return res.status(404).json({
        status: false,
        message: 'Tariff not found'
      });
    }

    // ✅ GST
    const gst_rate = await Billing.getGSTRateByState(state_id);

    const units = Number(units_consumed);
    const rate = Number(tariff.charging_fee) || 0;

    const base_amount = rate * units;
    const gst_amount = (base_amount * gst_rate) / 100;
    const final_amount = base_amount + gst_amount;

    const bill_id = await Billing.createBill({
      station_id,
      tariff_id,
      state_id,
      units_consumed: units,
      base_amount,
      gst_rate,
      gst_amount,
      final_amount,
      created_by
    });

    return res.status(200).json({
      status: true,
      message: 'Bill generated successfully',
      bill_id,
      base_amount,
      gst_amount,
      final_amount,
      payment_status: 'Pending'
    });

  } catch (error) {
    console.error('❌ Generate Bill Error:', error);
    return res.status(500).json({
      status: false,
      message: 'Server error'
    });
  }
};



// ✅ Billing list (role-based, like tariff.getAll)
exports.getBillingList = async (req, res) => {
  try {
    const login_id = req.params.login_id;
    const data = await Billing.getBillingList(login_id);
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching billing list:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Download invoice PDF
// ✅ Download invoice PDF (fixed and final)
exports.downloadInvoice = async (req, res) => {
  try {
    const { bill_id } = req.params;

    const bill = await Billing.getBillById(bill_id);
    if (!bill) {
      return res.status(404).json({ status: false, message: 'Bill not found' });
    }

    // 🔹 Correct path — directory only, not a file path
    const invoiceDir = path.join(process.cwd(), 'invoices');
    const invoiceFileName = `Invoice_${bill_id}.pdf`;
    const invoicePath = path.join(invoiceDir, invoiceFileName);

    // 🔹 Pass only the directory, not a full .pdf path, to utility
    await generateInvoicePDF(bill, invoiceDir);

    console.log('✅ Invoice generated at:', invoicePath);

    // ✅ Ensure PDF exists before download
    if (!fs.existsSync(invoicePath)) {
      throw new Error(`Invoice PDF not found at ${invoicePath}`);
    }

    res.download(invoicePath, invoiceFileName, (err) => {
      if (err) {
        console.error('❌ Invoice download error:', err);
      }
      try {
        if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);
      } catch (unlinkErr) {
        console.warn('⚠️ Unable to delete temp file:', unlinkErr.message);
      }
    });
  } catch (error) {
    console.error('❌ Error downloading invoice:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// ✅ GST list (for dropdown)
exports.getGSTList = async (req, res) => {
  try {
    // login_id is available if later you want role-based rules
    const data = await Billing.getGSTList();
    res.status(200).json({ status: true, data });
  } catch (error) {
    console.error('❌ Error fetching GST list:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ GST upsert
exports.updateGST = async (req, res) => {
  try {
    const { state_id, gst_rate, user_id } = req.body;

    if (!state_id || gst_rate === undefined) {
      return res
        .status(400)
        .json({ status: false, message: 'state_id and gst_rate required' });
    }

    await Billing.updateGST(state_id, gst_rate, user_id);
    res
      .status(200)
      .json({ status: true, message: 'GST updated successfully' });
  } catch (error) {
    console.error('❌ Error updating GST:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Get Bill by ID
exports.getBillById = async (req, res) => {
  try {
    const { bill_id } = req.params;

    const bill = await Billing.getBillById(bill_id);
    if (!bill) {
      return res.status(404).json({ status: false, message: 'Bill not found' });
    }

    res.status(200).json({ status: true, data: bill });
  } catch (error) {
    console.error('❌ Error fetching bill by ID:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ✅ Update Bill (Edit existing bill)
exports.updateBill = async (req, res) => {
  try {
    const { bill_id, station_id, tariff_id, state_id, units_consumed, modified_by } = req.body;

    if (!bill_id || !station_id || !tariff_id || !state_id || !units_consumed) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields'
      });
    }

    // Verify bill exists
    const existingBill = await Billing.getBillById(bill_id);
    if (!existingBill) {
      return res.status(404).json({ status: false, message: 'Bill not found' });
    }

    // Get tariff & GST details again for recalculation
    const tariff = await Billing.getTariffDetails(tariff_id);
    if (!tariff) {
      return res.status(404).json({ status: false, message: 'Tariff not found' });
    }

    const gst_rate = await Billing.getGSTRateByState(state_id);

    const units = Number(units_consumed);
    const rate = Number(tariff.charging_fee) || 0;
    const base_amount = rate * units;
    const gst_amount = (base_amount * gst_rate) / 100;
    const final_amount = base_amount + gst_amount;

    await Billing.updateBill({
      bill_id,
      station_id,
      tariff_id,
      state_id,
      units_consumed: units,
      base_amount,
      gst_rate,
      gst_amount,
      final_amount,
      modified_by
    });

    res.status(200).json({
      status: true,
      message: 'Bill updated successfully',
      base_amount,
      gst_amount,
      final_amount
    });
  } catch (error) {
    console.error('❌ Error updating bill:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

exports.payBill = async (req, res) => {
  try {
    const { bill_id, amount } = req.body;
    const user_id = req.body.userid;

    if (!bill_id || !user_id || !amount) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields (bill_id, userid, amount)"
      });
    }

    const rawToken = req.headers["authorization"];
    if (!rawToken) {
      return res.status(403).json({
        status: false,
        message: "Auth token missing"
      });
    }

    const safeToken = rawToken.startsWith("Bearer ")
      ? rawToken
      : `Bearer ${rawToken}`;

   console.log("👉 payBill called, payload:", req.body);

let paymentRes;
try {
  paymentRes = await axios.post(
    `${BASE_API}/payment/initiatetransaction`,
    {
      userid: user_id,
      amount,
      bill_id,
      type: req.body.type ?? "CURRENT",
      source: req.body.source ?? "WEB_PORTAL",
      serial_no: req.body.serial_no ?? "cms",
      mobileno: req.body.mobileno,
      activity_id: req.body.activity_id,
      paymentmode: "paytm"
    },
    {
      headers: { Authorization: safeToken },
      timeout: 15000   // 👈 ADD TIMEOUT
    }
  );

  console.log("✅ paymentRes received:", paymentRes.data);

} catch (err) {
  console.error("❌ AXIOS FAILED:", err.message);
  console.error("❌ AXIOS RESPONSE:", err.response?.data);

  return res.status(200).json({
    status: false,
    message: "Payment service not responding",
    error: err.response?.data || err.message
  });
}


 if (!paymentRes.data.status) {
  return res.status(200).json(paymentRes.data);
}


    const paytmData = paymentRes.data.data;

    // ✅ HARD VALIDATION
    if (!paytmData?.token || !paytmData?.orderid || !paytmData?.mid) {
      return res.status(500).json({
        status: false,
        message: "Invalid Paytm transaction data received"
      });
    }

    // ✅ FIX CALLBACK URL
    //paytmData.callbackurl =
     // `https://penological-ascertainably-laquanda.ngrok-free.dev/payment/callback?ORDER_ID=${paytmData.orderid}`;

    await Billing.updateBillPaymentOrder(bill_id, paytmData.orderid, "paytm");

    return res.status(200).json({
      status: true,
      message: "Payment Initiated",
      data: paytmData
    });

  } catch (error) {
    console.error("❌ payBill Error:", error?.response?.data || error);
    return res.status(500).json({
      status: false,
      message: "Server error"
    });
  }
};



