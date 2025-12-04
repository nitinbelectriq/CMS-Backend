// app/controllers/billing.controller.js
const path = require('path');
const fs = require('fs');
const Billing = require('../models/billing.model.js');
const { generateInvoicePDF } = require('../utility/pdf.utility.js');
const { sendEmail } = require('../utility/email.utility.js');

// ✅ Generate Bill (create + PDF + optional email)
exports.generateBill = async (req, res) => {
  try {
    const {
      station_id,
      tariff_id,
      state_id,
      units_consumed,
      created_by,
      customer_email
    } = req.body;

    if (!station_id || !tariff_id || !state_id || !units_consumed) {
      return res
        .status(400)
        .json({ status: false, message: 'Missing required fields' });
    }

    // Check station–tariff mapping
    const isMapped = await Billing.isStationMapped(station_id, tariff_id);
    if (!isMapped) {
      return res
        .status(400)
        .json({ status: false, message: 'Station not mapped with tariff' });
    }

    // Get tariff & GST details
    const tariff = await Billing.getTariffDetails(tariff_id);
    if (!tariff) {
      return res
        .status(404)
        .json({ status: false, message: 'Tariff not found' });
    }

    const gst_rate = await Billing.getGSTRateByState(state_id);

    const units = Number(units_consumed);
    const rate = Number(tariff.charging_fee) || 0;
    const base_amount = rate * units;
    const gst_amount = (base_amount * gst_rate) / 100;
    const final_amount = base_amount + gst_amount;

    // Create bill in DB
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

    // Fetch full bill details for invoice
    const bill = await Billing.getBillById(bill_id);
    if (!bill) {
      return res
        .status(404)
        .json({ status: false, message: 'Bill not found after creation' });
    }

    const invoicePath = path.join(process.cwd(), `Invoice_${bill_id}.pdf`);
    await generateInvoicePDF(bill, invoicePath);

    // Optional email with invoice
    if (customer_email) {
      const html = `
        <h3>Dear Customer,</h3>
        <p>Your invoice <strong>#${bill_id}</strong> has been generated.</p>
        <p>Total Amount: <strong>₹${final_amount.toFixed(2)}</strong></p>
      `;

      await sendEmail(customer_email, `Invoice #${bill_id}`, html, [
        {
          filename: `Invoice_${bill_id}.pdf`,
          path: invoicePath,
          contentType: 'application/pdf'
        }
      ]);
    }

    // Response
    res.status(200).json({
      status: true,
      message: 'Bill generated successfully',
      bill_id,
      base_amount,
      gst_amount,
      final_amount
    });

    // Delete temp file after some time
    setTimeout(() => {
      if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);
    }, 10000);
  } catch (error) {
    console.error('❌ Billing generation error:', error);
    res.status(500).json({ status: false, message: 'Server error' });
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
