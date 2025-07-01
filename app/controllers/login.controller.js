const { LoginUser, User,hash,updateLoginDetails } = require("../models/login.model.js");
const myModule = require("../models/vehicle.model.js");
const masterModule = require("../models/master.model");
const VehicleView = myModule.VehicleView;
const Master = masterModule.Master;

let jwt = require('jsonwebtoken');
let config = require('../config/jwt.js');

exports.authorize = (req, res) => {
    debugger;
    // Validate request
    console.log("req==================>",req.body);
    if (!req.body.user_name || !req.body.password) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        const { user_name, password,project_code } = req.body;

        if(project_code ==undefined) {
            res.status(200).send({
                status: false,
                message: 'project_code is missing.'
            });
        }

        LoginUser.findByUsername(user_name, async (err, data) => {       
            debugger;     
            if (err) {
                if (err.kind === "not_found") {
                    res.status(200).send({
                        status: false,
                        message: `Not found User with name  ` + user_name
                    });
                } else {
                    res.status(200).send({
                        status: false,
                        message: `Error retrieving User with username` + user_name
                    });
                }
            } else {

                if(data.status){
                    if (password === data.data.Password) {
                        if(data.data.is_verified=='N'){
                            res.status(200).send({
                                status: false,
                                message: 'User not verified'
                            });
                        }else{
                            let token = jwt.sign({ user_name: user_name },
                                config.secret,
                                {
                                    expiresIn: '48h' // expires in 24 hours
                                }
                            );
        
                            let data2;
                            let vehicleResult = await VehicleView.getVehiclesByUserId(data.data.Id, data2);          
                            let respProject;
                            let respNavList;
                                try {
                                    respProject = await Master.getProjectsByCode(project_code);
                                    
                                    if(respProject.data.length<=0){
                                        res.status(200).send({
                                            status: false,
                                            message: `project_code is incorrect`
                                        });
                                    }else{
                                        debugger;
                                        respNavList = await Master.getNavListByUserId(data.data.Id,respProject.data[0].id);
                                      
                                            res.json({
                                                status: true,
                                                message: 'Authentication successful!',
                                                client_id: data.data.client_id,
                                                client_name: data.data.client_name,
                                                cpo_id : data.data.cpo_id,
                                                //otp_authentication: data.data.otp_authentication,
                                                id: data.data.Id,
                                                f_Name: data.data.f_Name,
                                                l_Name: data.data.l_Name,
                                                email: data.data.email,
                                                mobile: data.data.mobile,
                                                user_name: data.data.User_Name,
                                                role_id: data.data.role_id,
                                                role_code : data.data.code,
                                                role_name : data.data.name,
                                                token: token,
                                                project_id : respProject.data[0].id,
                                                client_module_config : data.data.client_module_config,
                                                vehicles: vehicleResult.data,
                                                nav_list : !!respNavList.data ? respNavList.data :[]
                                            });
                                        // }
                                    }
                                } catch (e) {
                                    res.status(200).send({
                                        status: false,
                                        message: e.code
                                    });
                                }finally{
    
                                }
                        }
                    } else {
                        res.status(200).send({
                            status: false,
                            message: 'Incorrect username or password'
                        });
                    }
                }else{
                    res.status(200).send({
                        status: false,
                        message: data.message
                    });
                }
            }
        });
    }
};

exports.loginViaMobile = async (req, res) => {
    debugger;
    
    //verify OTP function

    const user = new User({
        mobile: !!req.body.mobile ? req.body.mobile : '',
        otp: !!req.body.otp ? req.body.otp : ''
    });
    debugger;
    const { project_code } = req.body;

    // Validate request
    if ( !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyOTPNew(user, (err, data) => {
            //res.send(data);
            //do on success
            debugger;
            if (data.status) {
                //START in part 2=====================
                LoginUser.findByMobile(user.mobile, async (err, data) => {       
                   debugger;     
                   if (err) {
                       if (err.kind === "not_found") {
                           res.status(200).send({
                               status: false,
                               message: `Not found User with mobile  ` + user.mobile
                           });
                       } else {
                           res.status(200).send({
                               status: false,
                               message: `Error retrieving User with mobile` + user.mobile
                           });
                       }
                   } else {
       
                       if(data.status){
                           // if (password === data.data.Password) {
                               if(data.data.is_verified=='N'){
                                   res.status(200).send({
                                       status: false,
                                       message: 'User not verified'
                                   });
                               }else{
                                   let token = jwt.sign({ user_name: data.data.UserName },
                                       config.secret,
                                       {
                                           expiresIn: '48h' // expires in 24 hours
                                       }
                                   );
               
                                   let data2;
                                   let vehicleResult = await VehicleView.getVehiclesByUserId(data.data.Id, data2);          
                                   let respProject;
                                   let respNavList;
                                       try {
                                           respProject = await Master.getProjectsByCode(project_code);
                                           
                                           if(respProject.data.length<=0){
                                               res.status(200).send({
                                                   status: false,
                                                   message: `project_code is incorrect`
                                               });
                                           }else{
                                               debugger;
                                               respNavList = await Master.getNavListByUserId(data.data.Id,respProject.data[0].id);
                                             
                                                   res.json({
                                                       status: true,
                                                       message: 'Authentication successful!',
                                                       client_id: data.data.client_id,
                                                       client_name: data.data.client_name,
                                                       cpo_id : data.data.cpo_id,
                                                       //otp_authentication: data.data.otp_authentication,
                                                       id: data.data.Id,
                                                       f_Name: data.data.f_Name,
                                                       l_Name: data.data.l_Name,
                                                       email: data.data.email,
                                                       mobile: data.data.mobile,
                                                       user_name: data.data.user_name,
                                                       role_id: data.data.role_id,
                                                       role_code : data.data.code,
                                                       role_name : data.data.name,
                                                       token: token,
                                                       project_id : respProject.data[0].id,
                                                       client_module_config : data.data.client_module_config,
                                                       vehicles: vehicleResult.data,
                                                       nav_list : !!respNavList.data ? respNavList.data :[]
                                                   });
                                               // }
                                           }
                                       } catch (e) {
                                           res.status(200).send({
                                               status: false,
                                               message: e.code
                                           });
                                       }finally{
           
                                       }
                               }
                           // } else {
                           //     res.status(200).send({
                           //         status: false,
                           //         message: 'Incorrect username or password'
                           //     });
                           // }
                       }else{
                           res.status(200).send({
                               status: false,
                               message: data.message
                           });
                       }
                   }
               });
               //END in part 2=====================
            } else {
                res.status(200).send({
                    status: false,
                    message: data.message
                });
            }
        });
    }



              


               
            
        
    
};


exports.authorizeBLE = (req, res) => {
    // Validate request
    if (!req.body.ble_user_id ) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        const { ble_user_id ,user_type,fcm_id,device_id ,app_version } = req.body;

        // if(project_code ==undefined) {
        //     res.status(200).send({
        //         status: false,
        //         message: 'project_code is missing.'
        //     });
        // }

        LoginUser.findByUserId(req.body, async (err, data) => { 
            debugger;           
            if (err) {
                if (err.kind === "not_found") {
                    res.status(200).send({
                        status: false,
                        message: `User not found  ` + ble_user_id
                    });
                } else {
                    res.status(200).send({
                        status: false,
                        message: `Error retrieving User with user_id ` + ble_user_id
                    });
                }
            } else {

                if(data.status){

                    debugger;
                    //update device id fcm id in users table
                    let resp_updateUser = await updateLoginDetails(req.body,data.data.Id);
                   
                            debugger;
                            let token = jwt.sign({ ble_user_id: ble_user_id },
                                config.secret,
                                {
                                    expiresIn: '48h' // expires in 24 hours
                                }
                            );
        
                            let data2;
                            let vehicleResult = await VehicleView.getVehiclesByUserId(data.data.Id, data2);          
                            let respProject;
                            let respNavList;
                                try {
                                    //respProject = await Master.getProjectsByCode(project_code);
                                    
                                    // if(respProject.data.length<=0){
                                    //     res.status(200).send({
                                    //         status: false,
                                    //         message: `project_code is incorrect`
                                    //     });
                                    // }else{
                                        //respNavList = await Master.getNavListByUserId(data.data.Id,respProject.data[0].id);
                                      
                                            res.json({
                                                status: true,
                                                message: 'Authentication successful!',
                                                // client_id: data.data.client_id,
                                                // client_name: data.data.client_name,
                                                // cpo_id : data.data.cpo_id,
                                                //otp_authentication: data.data.otp_authentication,
                                                id: data.data.Id,
                                                f_Name: data.data.f_Name,
                                                l_Name: data.data.l_Name,
                                                email: data.data.email,
                                                mobile: data.data.mobile,
                                                user_name: data.data.user_name,
                                                role_id: data.data.role_id,
                                                role_code : data.data.code,
                                                role_name : data.data.name,
                                                token: token,
                                                // project_id : respProject.data[0].id,
                                                // client_module_config : data.data.client_module_config,
                                                vehicles: vehicleResult.data,
                                                // nav_list : !!respNavList.data ? respNavList.data :[]
                                            });
                                        // }
                                    // }
                                } catch (e) {
                                    res.status(200).send({
                                        status: false,
                                        message: e.code
                                    });
                                }finally{
    
                                }
                        // }
                    // } else {
                    //     res.status(200).send({
                    //         status: false,
                    //         message: 'Incorrect username or password'
                    //     });
                    // }
                }else{
                    res.status(200).send({
                        status: false,
                        message: data.message
                    });
                }
            }
        });
    }
};

exports.loginCustom = (req, res) => {
    // Validate request

    if (!req.body.user_name || !req.body.password) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        
        const { user_name, password,project_code } = req.body;

        if(project_code ==undefined) {
            res.status(200).send({
                status: false,
                message: 'project_code is missing.'
            });
        }

        LoginUser.findByUsername(user_name, async (err, data) => {

            if (err) {
                if (err.kind === "not_found") {
                    res.status(200).send({
                        status: false,
                        message: `Not found User with name  ` + user_name
                    });
                } else {
                    res.status(200).send({
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
                        
                        let respProject;
                        let respNavList;
                        // if(!!project_code){
                            try {
                                respProject = await Master.getProjectsByCode(project_code);
                                
                                
                                if(respProject.data.length<=0){
                                    res.status(200).send({
                                        status: false,
                                        message: `project_code is incorrect`
                                    });
                                }else{
                                    respNavList = await Master.getNavListByUserId(data.Id,respProject.data[0].id);
                                    // if(respNavList.data.length<=0){
                                    //     res.status(200).send({
                                    //         status: false,
                                    //         message: `No activity is assigned to this user`
                                    //     });
                                    // }else{
                                        res.json({
                                            status: true,
                                            message: 'Sign in successfull!',
                                            client_id: data.client_id,
                                            id: data.Id,
                                            f_Name: data.f_Name,
                                            l_Name: data.l_Name,
                                            email: data.email,
                                            mobile: data.mobile,
                                            user_name: data.user_name,
                                            token: token,
                                            project_id : respProject.data[0].id,
                                            vehicles: vehicleResult.data,
                                            nav_list : !!respNavList.data ? respNavList.data :[]
                                        });
                                    // }
                                }      
                                
                            } catch (e) {
                                
                                res.status(200).send({
                                    status: false,
                                    message: e.code
                                });

                            }finally{

                            }
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
          //  User.updatePasswordNewBLE(user, (err, data) => {
            if (err)
                res.status(500).send({
                    status: false,
                    message: err.message || "Some error occurred while Update the User Password."
                });
            else res.send(data);
        });


    }
};
//use for ble and charger 25-03-2022
exports.updatePasswordNewBLE = (req, res) => {
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
           // User.updatepassword(user, (err, data) => {
                User.updatePasswordNewBLE(user, (err, data) => {
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

exports.registerNew = (req, res) => {
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
        fcm_id: !!req.body.fcm_id?req.body.fcm_id :'',
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
        User.registerNew(user, (err, data) => {
            res.send(data);
        });


    }
};

exports.registerNewBLE = (req, res) => {
    const user = new User({
        id: req.body.id,
        ble_user_id: req.body.ble_user_id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: !!req.body.password? req.body.password :'',
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
        can_expire: !!req.body.can_expire ? req.body.can_expire : 'Y',
        hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
        hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
        last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
        last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
        otp: !!req.body.otp ? req.body.otp : '',
        registration_origin: req.body.registration_origin,
        fcm_id: !!req.body.fcm_id?req.body.fcm_id :'',
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: !!req.body.created_by ? req.body.created_by : 0,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
    });


    // Validate request
    if (!req.body.username) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        User.registerNewBLE(user, (err, data) => {
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
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        otp_purpose : !!req.body.otp_purpose ? req.body.otp_purpose : '',
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


exports.getOTPNew = (req, res) => {
 // Validate request
 if (!req.body.mobile && !req.body.email && !req.body.otp_purpose) {
    res.status(200).send({
        status: false,
        message: "Invalid Input"
    });
}

    const user = new User({
        id: !!req.body.id ? req.body.id : 0,
        username: !!req.body.username ? req.body.username : '',
        mobile: req.body.mobile ,
        email: req.body.email ,
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',
        employee_code: !!req.body.employee_code ? req.body.employee_code : '',
        otp_purpose : req.body.otp_purpose,
        charger_display_id : req.body.charger_display_id,
    });

        
        User.getOTPNew(user, (err, data) => {
            res.send(data);
        });
    
};

exports.getOTPAnonymous = (req, res) => {
    
    const user = new User({
        mobile: !!req.body.mobile ? req.body.mobile : req.body.mobile,
        email: !!req.body.email ? req.body.email : req.body.email
    });

    // Validate request
    if (!req.body.mobile && !req.body.email) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }
    else {
        User.getOTPAnonymous(user, (err, data) => {
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

exports.verifyUserNew = (req, res) => {

    const user = new User({
        id: req.body.id,
        username: req.body.username,
        mobile: !!req.body.mobile ? req.body.mobile : '',
        email: !!req.body.email ? req.body.email : '',
        otp: !!req.body.otp ? req.body.otp : ''
    });


    // Validate request
    if (!req.body.username || !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyUserNew(user, (err, data) => {
            
            res.send(data);
        });


    }
};

exports.verifyUserNewBLE = (req, res) => {

    const user = new User({
        id: req.body.id,
        username: req.body.username,
        mobile: !!req.body.mobile ? req.body.mobile : '',
        email: !!req.body.email ? req.body.email : '',
        otp: !!req.body.otp ? req.body.otp : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        mobile_deviceid: !!req.body.mobile_deviceid ? req.body.mobile_deviceid : '',
        fcm_id: !!req.body.fcm_id ? req.body.fcm_id : '',
        update_status: !!req.body.update_status ? req.body.update_status : ''
    });

    // Validate request
    if ( !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyUserNewBLE(user, (err, data) => {
            res.send(data);
        });


    }
};

exports.verifyOTP = (req, res) => {

    const user = new User({
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
        email: !!req.body.email ? req.body.email : '',
        otp: !!req.body.otp ? req.body.otp : ''
    });

    // Validate request
    if ( !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyOTP(user, (err, data) => {
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

exports.verifyOTPNew = (req, res) => {

    const user = new User({
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
        email: !!req.body.email ? req.body.email : '',
        otp: !!req.body.otp ? req.body.otp : ''
    });

    // Validate request
    if ( !req.body.mobile) {
        res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    } else {
        // const { user_name, password } = req.body;
        User.verifyOTPNew(user, (err, data) => {
            res.send(data);
        });


    }
};

