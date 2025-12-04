const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");
const PDFDocument = require("pdfkit");
const { pool } = require("../models/db.js");

async function getClientDetails(client_id) {
  try {
    const [rows] = await pool.query(
      `
      SELECT * FROM client_mst 
      WHERE status IN ('Active', 'A', 'Y')
      ${client_id ? "AND id = ?" : ""}
      ORDER BY id DESC LIMIT 1
      `,
      client_id ? [client_id] : []
    );

    const c = rows && rows.length ? rows[0] : {};
    return {
      name: c.name || "Belectriq Mobility Pvt Ltd",
      gst_no: c.gst_no || "27ABCDE1234F1Z5",
      address:
        `${c.address1 || ""} ${c.address2 || ""}, ${c.landmark || ""}`.trim() ||
        "Noida, India",
      mobile: c.mobile || "+91-9876543210",
      email: c.email || "support@belectriq.co",
      logoUrl: "https://belectriq.co/static/images/Logo.svg", // fixed link
      bank: c.bank || "HDFC Bank",
      ifsc: c.ifsc || "HDFC0000123",
      account: c.account || "000111222333",
      account_holder_name:
        c.account_holder_name || c.name || "Belectriq Mobility Pvt Ltd",
    };
  } catch (err) {
    console.error("❌ Error fetching client details:", err);
    return {
      name: "Belectriq Mobility Pvt Ltd",
      gst_no: "27ABCDE1234F1Z5",
      address: "Noida, India",
      mobile: "+91-9876543210",
      email: "support@belectriq.co",
      logoUrl: "https://belectriq.co/static/images/Logo.svg",
    };
  }
}

function drawLine(doc, y) {
  doc.strokeColor("#dcdcdc").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

// 🔹 Download SVG & Convert to PNG Buffer using Sharp
async function getLogoAsPngBuffer(svgUrl) {
  try {
    const response = await axios({ url: svgUrl, responseType: "arraybuffer" });
    const svgBuffer = Buffer.from(response.data);
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();
    return pngBuffer;
  } catch (err) {
    console.warn("⚠️ Unable to fetch/convert logo:", err.message);
    return null;
  }
}

async function generateInvoicePDF(bill, outputDir = "./invoices") {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const filename = `Invoice_${bill.bill_id}.pdf`;
    const filePath = path.join(outputDir, filename);
    const client = await getClientDetails(bill.client_id || null);

    const logoBuffer = await getLogoAsPngBuffer(client.logoUrl);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ---------------- HEADER ----------------
    if (logoBuffer) {
      doc.image(logoBuffer, 50, 45, { width: 70 });
    }
    doc.fontSize(18).fillColor("#0C5ADB").text(client.name, 130, 50);
    doc.fontSize(10).fillColor("black");
    doc.text(`GSTIN: ${client.gst_no}`, 130, 68);
    doc.text(`Phone: ${client.mobile}`, 130, 80);
    doc.text(`Email: ${client.email}`, 130, 92);
    drawLine(doc, 110);

    // ---------------- TITLE ----------------
    doc.fontSize(16).fillColor("black").text("TAX INVOICE", 0, 130, {
      align: "center",
    });
    drawLine(doc, 150);

    // ---------------- BILL DETAILS ----------------
    doc.fontSize(10).fillColor("black");
    doc.text(`Invoice #: ${bill.bill_id}`, 50, 165);
    doc.text(
      `Date: ${new Date(bill.created_date).toLocaleDateString("en-IN")}`,
      50,
      180
    );
    doc.text(`Payment Status: ${bill.payment_status}`, 50, 195);

    doc.font("Helvetica-Bold").text("Billed To:", 350, 165);
    doc.font("Helvetica");
    doc.text(bill.client_name || "-", 350, 180);
    doc.text(`${bill.address1 || ""} ${bill.address2 || ""}`, 350, 193);
    doc.text(`${bill.landmark || ""}`, 350, 206);
    doc.text(`Email: ${bill.email || ""}`, 350, 219);

    // 🔹 Station Details
    doc.font("Helvetica-Bold").text("Station Details:", 50, 215);
    doc.font("Helvetica");
    doc.text(`Station: ${bill.station_name || "-"}`, 50, 230);
    doc.text(`Code: ${bill.station_code || "-"}`, 50, 243);
    doc.text(`State: ${bill.state_name || "-"}`, 50, 256);

    drawLine(doc, 270);

    // ---------------- TABLE HEADER ----------------
    const tableTop = 285;
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Description", 55, tableTop);
    doc.text("Units (kWh)", 270, tableTop);
    doc.text("Rate (₹)", 360, tableTop);
    doc.text("Amount (₹)", 460, tableTop);
    drawLine(doc, tableTop + 15);

    // ---------------- TABLE BODY ----------------
    const baseAmount = Number(bill.base_amount || 0);
    const gstRate = Number(bill.gst_rate || 0);
    const gstAmount = Number(bill.gst_amount || 0);
    const total = Number(bill.final_amount || 0);
    const units = Number(bill.units_consumed || 0);
    const rate = units ? baseAmount / units : 0;

    const y = tableTop + 30;
    doc.font("Helvetica").fontSize(10);
    doc.text(
      `${bill.tariff_name || "Charging Tariff"} (${bill.tariff_type || ""})`,
      55,
      y
    );
    doc.text(`${units.toFixed(2)}`, 290, y, { width: 50, align: "right" });
    doc.text(`${rate.toFixed(2)}`, 380, y, { width: 50, align: "right" });
    doc.text(`${baseAmount.toFixed(2)}`, 480, y, { width: 60, align: "right" });

    drawLine(doc, y + 15);

    // ---------------- TOTALS ----------------
    const summaryY = y + 35;
    doc.text("Subtotal", 400, summaryY);
    doc.text(`${baseAmount.toFixed(2)}`, 500, summaryY, { align: "right" });

    doc.text(`GST (${gstRate}%)`, 400, summaryY + 15);
    doc.text(`${gstAmount.toFixed(2)}`, 500, summaryY + 15, { align: "right" });

    drawLine(doc, summaryY + 30);

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Total Amount (₹)", 400, summaryY + 40);
    doc.fontSize(12).fillColor("#0C5ADB");
    doc.text(`${total.toFixed(2)}`, 500, summaryY + 40, { align: "right" });

    drawLine(doc, summaryY + 60);

    // ---------------- FOOTER ----------------
    const footerY = summaryY + 80;
    doc.fontSize(10).fillColor("black");
    doc.text(`Bank: ${client.bank}`, 50, footerY);
    doc.text(`A/C No: ${client.account}`, 50, footerY + 12);
    doc.text(`IFSC: ${client.ifsc}`, 50, footerY + 24);

    doc
      .fontSize(9)
      .fillColor("gray")
      .text(
        "This is a system-generated invoice. For queries, contact billing@belectriq.co",
        50,
        footerY + 50,
        { align: "center" }
      );

    doc.end();
    await new Promise((resolve) => stream.on("finish", resolve));

    console.log("✅ Invoice generated successfully:", filePath);
    return filePath;
  } catch (err) {
    console.error("❌ Error generating invoice PDF:", err);
    throw err;
  }
}

module.exports = { generateInvoicePDF };
