const https = require('https');
const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path')
const handlebars = require("handlebars");


async function generatedInvoice(order)  {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const content = fs.readFileSync( path.resolve(__dirname, './app/templates/invoice.html'),
        'utf-8'
    )
    var template = handlebars.compile(content)
    var data = { "station_name":  ,"" : ""}
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
    
  };
