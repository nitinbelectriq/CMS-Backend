const {CBR} = require("../models/call_back_request.model");
// const myModule = require("../models/vehicle.model.js");

// const VehicleView = myModule.VehicleView;
// let jwt = require('jsonwebtoken');
// let config = require('../config/jwt.js');


exports.getCallHistory = (req,res)=>{
    
    if (!req.body ) {
        res.status(200).send({
            status: false,
            message: "Invalid Input",
        });
    }else{
        CBR.getCallHistory( req.body,(err, data) => {
             res.send(data);
        });
    }
}
exports.getAllCallHistory = (req,res)=>{
    
    // if (!req.body ) {
    //     res.status(200).send({
    //         status: false,
    //         message: "Invalid Input",
    //     });
    // }else{
        CBR.getAllCallHistory( req.body,(err, data) => {
             res.send(data);
        });
    // }
}

exports.createRequest = (req,res)=>{
    
    if (!req.body ) {
        res.status(200).send({
            status: false,
            message: "Invalid Input",
        });
    }else{
        CBR.createRequest( req.body,(err, data) => {
             res.send(data);
        });
    }
}
exports.closeRequest = (req,res)=>{
    
    if (!req.body ) {
        res.status(200).send({
            status: false,
            message: "Invalid Input",
        });
    }else{
        CBR.closeRequest( req.body,(err, data) => {
             res.send(data);
        });
    }
}

exports.authorize = (req, res) => {
    // Validate request

    if (!req.body.user_name || !req.body.password) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        const { user_name, password } = req.body;
        LoginUser.findByUsername(user_name, async (err, data) => {

            if (err) {
                if (err.kind === "not_found") {
                    res.status(200).send({
                        status: false,
                        message: `Not found User with name  ` + user_name
                    });
                } else {
                    res.status(500).send({
                        status: false,
                        message: `Error retrieving User with username` + user_name
                    });
                }
            } else {
                if (password === data.Password) {
                    if(data.is_verified=='N'){
                        res.status(200).send({
                            status: false,
                            message: 'User not verified'
                        });
                    }else{
                        let token = jwt.sign({ user_name: user_name },
                            config.secret,
                            {
                                expiresIn: '24h' // expires in 24 hours
                            }
                        );
    
                        let data2;
                        let vehicleResult = await VehicleView.getVehiclesByUserId(data.Id, data2);
                        // return the JWT token for the future API calls
                        res.json({
                            status: true,
                            message: 'Authentication successful!',
                            client_id: data.client_id,
                            id: data.Id,
                            f_Name: data.f_Name,
                            l_Name: data.l_Name,
                            email: data.email,
                            mobile: data.mobile,
                            user_name: data.user_name,
                            token: token,
                            vehicles: vehicleResult.data
                        });
                    }

                    
                } else {
                    res.status(200).send({
                        status: false,
                        message: 'Incorrect username or password'
                    });
                }
            }

        });
    }
};

exports.forgotpassword = (req, res) => {

    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        f_Name: !!req.body.f_Name ? req.body.f_Name : '',
        m_Name: !!req.body.m_Name ? req.body.m_Name : '',
        l_Name: !!req.body.l_Name ? req.body.l_Name : '',
        dob: !!req.body.dob ? req.body.dob : '',
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',

        email: !!req.body.email ? req.body.email : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',

        user_type: req.body.user_type,
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        can_expire: req.body.can_expire,
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        // const { user_name, password } = req.body;
        User.forgotpassword(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Customer."
                });
            else res.send(data);
        });


    }
};

exports.Webforgotpassword = (req, res) => {

    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        f_Name: !!req.body.f_Name ? req.body.f_Name : '',
        m_Name: !!req.body.m_Name ? req.body.m_Name : '',
        l_Name: !!req.body.l_Name ? req.body.l_Name : '',
        dob: !!req.body.dob ? req.body.dob : '',
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',

        email: !!req.body.email ? req.body.email : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',

        user_type: req.body.user_type,
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        can_expire: req.body.can_expire,
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "Invalid Input"
        });
    }
    else {

        // const { user_name, password } = req.body;
        User.Webforgotpassword(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while generate the user password."
                });
            else res.send(data);
        });


    }
};
exports.updatepassword = (req, res) => {

    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        f_Name: !!req.body.f_Name ? req.body.f_Name : '',
        m_Name: !!req.body.m_Name ? req.body.m_Name : '',
        l_Name: !!req.body.l_Name ? req.body.l_Name : '',
        dob: !!req.body.dob ? req.body.dob : '',
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',

        email: !!req.body.email ? req.body.email : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',

        user_type: req.body.user_type,
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        can_expire: req.body.can_expire,
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.password) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {

        // const { user_name, password } = req.body;
        User.updatepassword(user, (err, data) => {
            if (err)
                res.status(500).send({
                    status: false,
                    message: err.message || "Some error occurred while Update the User Password."
                });
            else res.send(data);
        });


    }
};

exports.register = (req, res) => {

    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        f_Name: !!req.body.f_Name ? req.body.f_Name : '',
        m_Name: !!req.body.m_Name ? req.body.m_Name : '',
        l_Name: !!req.body.l_Name ? req.body.l_Name : '',
        dob: !!req.body.dob ? req.body.dob : '',
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',

        email: !!req.body.email ? req.body.email : '',

        address1: !!req.body.address1 ? req.body.address1 : '',
        address2: !!req.body.address2 ? req.body.address2 : '',
        PIN: !!req.body.PIN ? req.body.PIN : 0,
        landmark: !!req.body.landmark ? req.body.landmark : '',
        city_id: !!req.body.city_id ? req.body.city_id : 0,
        state_id: !!req.body.state_id ? req.body.state_id : 0,
        country_id: !!req.body.country_id ? req.body.country_id : 0,
        PAN: !!req.body.PAN ? req.body.PAN : '',
        aadhar: !!req.body.aadhar ? req.body.aadhar : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',
        user_type: req.body.user_type,
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        can_expire: req.body.can_expire,
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        User.register(user, (err, data) => {
            res.send(data);
        });


    }
};

exports.getOTP = (req, res) => {
    const user = new User({
        id: !!req.body.id ? req.body.id : req.body.userDetails[0].id,
        username: !!req.body.username ? req.body.username : req.body.userDetails[0].username,
        mobile: !!req.body.mobile ? req.body.mobile : req.body.userDetails[0].mobile,
        email: !!req.body.email ? req.body.email : req.body.userDetails[0].email,
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : ''
    });

    // Validate request
    if (!req.body.mobile && !req.body.email) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        User.getOTP(user, (err, data) => {
            res.send(data);
        });
    }
};

exports.verifyUser = (req, res) => {

    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        f_Name: !!req.body.f_Name ? req.body.f_Name : '',
        m_Name: !!req.body.m_Name ? req.body.m_Name : '',
        l_Name: !!req.body.l_Name ? req.body.l_Name : '',
        dob: !!req.body.dob ? req.body.dob : '',
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',

        email: !!req.body.email ? req.body.email : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',

        user_type: req.body.user_type,
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        can_expire: req.body.can_expire,
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.username || !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyUser(user, (err, data) => {
            if (err)
                res.status(500).send({
                    status: false,
                    message:
                        err.message || "Some error occurred while creating the Customer."
                });
            else res.send(data);
        });


    }
};

