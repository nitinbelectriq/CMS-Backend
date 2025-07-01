const { AlexaUser } = require("../models/alexa.model.js");
let jwt = require('jsonwebtoken');
let config = require('../config/jwt.js');
const myModule = require("../models/vehicle.model.js");
const VehicleView = myModule.VehicleView;

exports.authorize = (req, res) => {
    // Validate request

    if (!req.body.mobile && !req.body.email) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        const { mobile, email } = req.body;
        AlexaUser.findByMobileEmail(req.body, async (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(200).send({
                        status: false,
                        message: `User Not found. ` //+ mobile
                    });
                } else {
                    res.status(500).send({
                        status: false,
                        message: `Error retrieving User.` //+ mobile
                    });
                }
            }else {
                let vehicleResult = await VehicleView.getVehiclesByUserId(data.id);
                    let token = jwt.sign({ mobile: mobile },
                        config.secret,
                        {
                            expiresIn: '24h' // expires in 24 hours
                        }
                    );
                    // return the JWT token for the future API calls

                    res.json({
                        status: true,
                        message: 'Alexa Authentication successful!',
                        client_id: data.client_id,
                        id: data.id,
                        f_Name: data.f_name,
                        l_Name: data.l_name,
                        email: data.email,
                        mobile: data.mobile,
                        user_name: data.user_name,
                        token: token,
                        vehicles : vehicleResult
                    });
               
            }

        });
    }
};