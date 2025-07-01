require('dotenv').config();
const express = require("express");
const { sql } = require("./app/models/db.js");
const bodyParser = require("body-parser");
const cors = require('cors');
const nocache = require("nocache");

const environmentModule = require("./app/utility/environment.js");
const environment = environmentModule.environment;

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// === Swagger Configuration ===
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS API',
      version: '1.0.0',
      description: 'CMS API documentation',
      contact: { name: 'BELECTRIQ' }
    },
    servers: [{ url: "http://localhost:5500" }]
  },
  apis: ["./app/routes/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === Middlewares ===
app.use(nocache());
app.use(cors()); // If you want to restrict, pass corsOptions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === CORS Whitelist Option (Not used currently) ===
/*
const whitelist = ['http://localhost:5300','http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
*/

// === Base Route ===
app.get("/", (req, res) => {
  res.json({ message: "Backend" });
});

// === Load Routes ===
// require("./app/routes/customer.routes")(app);
 require("./app/routes/brand.routes")(app);
require("./app/routes/vehicle.routes")(app);
require("./app/routes/charger.routes")(app);
require("./app/routes/connector.routes")(app);
require("./app/routes/client.routes")(app);
require("./app/routes/cpo.routes")(app);
require("./app/routes/charging-station.routes")(app);
require("./app/routes/charging-model.routes")(app);
require("./app/routes/current-type.routes")(app);
require("./app/routes/io-type.routes")(app);
require("./app/routes/manufacturer.routes")(app);
require("./app/routes/communication-protocol.routes")(app);
require("./app/routes/charger-model-type.routes")(app);
require("./app/routes/login.routes")(app);
require("./app/routes/charger-type.routes")(app);
// require("./app/routes/charger-batch.routes")(app);
 require("./app/routes/version.routes")(app);
// require("./app/routes/charger-monitoring.routes")(app);
 require("./app/routes/rf-id.routes")(app);
// require("./app/routes/user-management.routes")(app);
// require("./app/routes/role-management.routes")(app);
 require("./app/routes/master.routes")(app);
// require("./app/routes/alexa.routes")(app);
// require("./app/routes/sub-client.routes")(app);
// require("./app/routes/analytics.routes")(app);
// require("./app/routes/call_back_request.routes")(app);
// require("./app/routes/report.routes")(app);
// require("./app/routes/error_log.routes")(app);
// require("./app/routes/menu.routes")(app);
// require("./app/routes/payment.route")(app);
// require("./app/routes/ble.routes")(app);
// require("./app/routes/order.route")(app);
// require("./app/routes/booking.routes")(app);
require("./app/routes/brand-model.routes")(app);
// require("./app/routes/ev-component-dealer.routes")(app);
// require("./app/routes/subsidy.routes")(app);
// require("./app/routes/ev-dealer.routes")(app);


// === App Port ===
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);

  const query = `SELECT id, name, setting_value FROM settings WHERE application = 'CMS'`;
  sql.query(query, (err, result) => {
    if (err) {
      console.error("Error retrieving setting data:", err);
      return;
    }

    let config = {
      base_url: '',
      fileuploadpath: '',
      fileuploadtemppath: '',
      fileserverurl: ''
    };

    result.forEach(({ name, setting_value }) => {
      switch (name) {
        case 'base_url': config.base_url = setting_value; break;
        case 'fileuploadpath': config.fileuploadpath = setting_value; break;
        case 'fileuploadtemppath': config.fileuploadtemppath = setting_value; break;
        case 'fileserverurl': config.fileserverurl = setting_value; break;
      }
    });

    environment.baseUrl = config.base_url;
    environment.fileuploadpath = config.base_url + config.fileuploadpath;
    environment.fileuploadtemppath = config.base_url + config.fileuploadtemppath;
    environment.fileuploadUri = config.fileuploadpath;
    environment.fileserverurl = config.fileserverurl;

    console.log("Environment loaded:", environment);
  });
});

module.exports = app;
