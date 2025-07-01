const { sql, pool } = require("../models/db");
const { User } = require("../models/login.model.js");


let authenticateUser = async (req, res, next) => {
    const user = new User({
        id: req.body.id,
        code: !!req.body.code ? req.body.code : '',
        username: req.body.username,
        password: req.body.password,
        mobile: !!req.body.mobile ? req.body.mobile : '',
        alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
        email: !!req.body.email ? req.body.email : '',
        device_id: !!req.body.device_id ? req.body.device_id : '',
        app_version: !!req.body.app_version ? req.body.app_version : '',
        os_version: !!req.body.os_version ? req.body.os_version : '',
        client_id: !!req.body.client_id ? req.body.client_id : 0,
        employee_code: !!req.body.employee_code ? req.body.employee_code : ''
    });

    // Validate request
    if (!user.username && !user.mobile && !user.id && !user.email) {
        return res.status(200).send({
            status: false,
            message: "Invalid Input"
        });
    }

    let final_res;
    var datetime = new Date();

    let whereClause;
    if (!!user.id) !!whereClause ? (whereClause += ` and id = ${user.id}`) : (whereClause = ` where id = ${user.id}`);
    if (!!user.username) !!whereClause ? (whereClause += ` and username = '${user.username}'`) : (whereClause = ` where username = '${user.username}'`);
    if (!!user.mobile) !!whereClause ? (whereClause += ` and mobile = '${user.mobile}'`) : (whereClause = ` where mobile = '${user.mobile}'`);
    if (!!user.email) !!whereClause ? (whereClause += ` and email = '${user.email}'`) : (whereClause = ` where email = '${user.email}'`);

    let stmt = `select id ,cpo_id ,code ,username ,password ,f_Name ,m_Name ,l_Name ,dob ,mobile ,
        alt_mobile ,email ,address1 ,address2 ,PIN ,landmark ,city_id ,state_id ,country_id ,
        PAN ,aadhar ,device_id ,app_version ,os_version ,user_type ,client_id ,can_expire ,
        hint_question ,hint_answer ,last_pass_change ,last_login_date ,employee_code ,
        is_verified ,otp ,registration_origin ,
        status ,created_date ,createdby ,modify_date ,modifyby  
        from user_mst_new 
        ${whereClause}
        and status = 'Y' ; `;

    let resp;
    try {
        resp = await pool.query(stmt);
        if (resp.length > 0) {
            req.body.userDetails = resp;
            next();
        } else {
            final_res = {
                status: false,
                message: `No data found for these details.`,
                data: []
            }
            return res.send(final_res)
        }

    } catch (err) {
        final_res = {
            status: false,
            message: `ERROR : ${err.code}`,
            data: []
        }

        return res.send(final_res)
    }
};


let getUserDetails = async (req, res, next) => {
    if((!req.params.login_id || req.params.login_id=='')) {
        return  res.status(200).send({
            status: false,
            message: "User id not provided"
        });
    }

    let user_id= !!req.body.login_id ? req.body.login_id : req.params.login_id;

    let final_res;
    var datetime = new Date();

    let stmt = `select id ,cpo_id ,code ,username ,password ,f_Name ,m_Name ,l_Name ,dob ,mobile ,
        alt_mobile ,email ,address1 ,address2 ,PIN ,landmark ,city_id ,state_id ,country_id ,
        PAN ,aadhar ,device_id ,app_version ,os_version ,user_type ,client_id ,can_expire ,
        hint_question ,hint_answer ,last_pass_change ,last_login_date ,employee_code ,
        is_verified ,otp ,registration_origin ,
        status ,created_date ,createdby ,modify_date ,modifyby  
        from user_mst_new  where id = ?
        and status = 'Y' ; `;

    let resp;
    try {
        resp = await pool.query(stmt,[user_id]);
        if (resp.length > 0) {
            req.body.userDetails = resp;
            next();
        } else {
            final_res = {
                status: false,
                message: `User not found`,
                data: []
            }
            return res.send(final_res)
        }

    } catch (err) {
        final_res = {
            status: false,
            message: `ERROR : ${err.code}`,
            data: []
        }

        return res.send(final_res)
    }
};

module.exports = {
    authenticateUser,
    getUserDetails

}
