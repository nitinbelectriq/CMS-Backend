const { sql, pool,poolMG } = require("./db.js");
const _utility = require("../utility/_utility");
const _userModel = require("../models/user-management.model");
const charger = require("../models/charger.model");
const bcrypt = require('bcrypt');
const helper = require('../helper/passwordHelper');
const { sendForgotPasswordOTP } = require('../utility/email.utility');
const https = require('https')
const http = require('https')
const axios = require('axios');

//let helper = require('../helper');
const LoginUser = function (loginuser) {
  this.User_Name = loginuser.User_Name;
  this.User_Password = loginuser.User_Password;
};



const User = function (user) {
  this.id = user.id;
  this.ble_user_id = user.ble_user_id;
  this.code = user.code;
  this.username = user.username;
  this.password = user.password;
  this.f_Name = user.f_Name;
  this.m_Name = user.m_Name;
  this.l_Name = user.l_Name;
  this.dob = user.dob;
  this.mobile = user.mobile;
  this.alt_mobile = user.alt_mobile;
  this.email = user.email;
  this.address1 = user.address1;
  this.address2 = user.address2;
  this.PIN = user.PIN;
  this.landmark = user.landmark;
  this.city_id = user.city_id;
  this.state_id = user.state_id;
  this.country_id = user.country_id;
  this.PAN = user.PAN;
  this.aadhar = user.aadhar;
  this.device_id = user.device_id;
  this.app_version = user.app_version;
  this.os_version = user.os_version;
  this.user_type = user.user_type;
  this.client_id = user.client_id;
  this.can_expire = user.can_expire;
  this.hint_question = user.hint_question;
  this.hint_answer = user.hint_answer;
  this.last_pass_change = user.last_pass_change;
  this.last_login_date = user.last_login_date;
  this.employee_code = user.employee_code;
  this.is_verified = user.is_verified;
  this.otp = user.otp;
  this.otp_used = user.otp_used;
  this.otp_validity = user.otp_validity;
  this.otp_purpose = user.otp_purpose;
  this.registration_origin = user.registration_origin;
  this.project_code = user.project_code;
  this.fcm_id = user.fcm_id;
  this.status = user.status;
  this.created_date = user.created_date;
  this.created_by = user.created_by;
  this.modify_date = user.modify_date;
  this.modify_by = user.modify_by;
  this.charger_display_id = user.charger_display_id;
  this.mobile_deviceid = user.mobile_deviceid;
  this.update_status = user.update_status;
};

// LoginUser.findByUsername = (User_Name, result) => {
//  //;
//   let resp;
//   let final_resp;
//   let stmt2 = `SELECT id,client_id,booking_allowed,payment_allowed,reward_allowed,
//     penalty_allowed,otp_authentication,invoice_allowed,
//     status,created_date,created_by,modified_date,modified_by
//     FROM client_module_config where status='Y' and client_id=? `;


//   sql.query(` SELECT umn.Id,umn.username,umn.Password,umn.client_id,
//     cm.name as client_name,umn.f_Name,umn.l_Name,umn.mobile,umn.email ,
//     umn.user_type,umn.is_verified, urm.role_id,rm.code, rm.name, umn.cpo_id,umn.country_id
//     FROM user_mst_new umn left join user_role_mapping urm on umn.id=urm.user_id  and urm.status='Y' and urm.default_role = 'Y'
//     left join role_mst rm on urm.role_id = rm.id and rm.status='Y'
//     left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
//     WHERE username =? and umn.status='Y'  `, User_Name, async (err, res) => {
    
//     if (err) {
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       final_resp = res[0];
      
//       if (res[0].client_id > 0) {
//         try {
//           resp = await pool.query(stmt2, [res[0].client_id]);
//         } catch (e) {
//           resp = [];
//         }

//         if (resp.length > 0) {

//           final_resp.client_module_config = resp[0];
//           final_resp = {
//             status: true,
//             message: 'SUCCESS',
//             data: final_resp
//           };
//         } else {
//           final_resp = {
//             status: false,
//             message: 'Client module configuration is missing',
//             data: []
//           };
//         }
//       } else {
//         final_resp.client_module_config = {};
//         final_resp = {
//           status: true,
//           message: 'SUCCESS',
//           data: final_resp
//         };
//       }



//       result(null, final_resp);
//       return;
//     }
//     result({ kind: "not_found" }, null);
//   });
// };


LoginUser.findByUsername = async (User_Name, result) => {
  //;
  const stmt2 = `SELECT id, client_id, booking_allowed, payment_allowed, reward_allowed,
    penalty_allowed, otp_authentication, invoice_allowed, status,
    created_date, created_by, modified_date, modified_by
    FROM client_module_config WHERE status='Y' AND client_id=?`;

  try {
    const res= await pool.query(`
      SELECT umn.Id, umn.username, umn.Password, umn.client_id,
        cm.name AS client_name, umn.f_Name, umn.l_Name, umn.mobile, umn.email,
        umn.user_type, umn.is_verified, urm.role_id, rm.code, rm.name,
        umn.cpo_id, umn.country_id
      FROM user_mst_new umn
      LEFT JOIN user_role_mapping urm ON umn.id = urm.user_id AND urm.status='Y' AND urm.default_role='Y'
      LEFT JOIN role_mst rm ON urm.role_id = rm.id AND rm.status='Y'
      LEFT JOIN client_mst cm ON umn.client_id = cm.id AND cm.status='Y'
      WHERE username = ? AND umn.status='Y'
    `, [User_Name]);

    if (res.length === 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    let final_resp = res[0];

    if (final_resp.client_id > 0) {
      const config = await pool.query(stmt2, [final_resp.client_id]);

      if (config.length > 0) {
        final_resp.client_module_config = config[0];
        result(null, { status: true, message: 'SUCCESS', data: final_resp });
      } else {
        result(null, {
          status: false,
          message: 'Client module configuration is missing',
          data: []
        });
      }
    } else {
      result(null, {
        status: true,
        message: 'SUCCESS',
        data: final_resp
      });
    }

  } catch (err) {
    console.error('Database error:', err);
    result(err, null);
  }
};



LoginUser.findByMobile = (mobile, result) => {
 //;
  let resp;
  let final_resp;
  let stmt2 = `SELECT id,client_id,booking_allowed,payment_allowed,reward_allowed,
    penalty_allowed,otp_authentication,invoice_allowed,
    status,created_date,created_by,modified_date,modified_by
    FROM client_module_config where status='Y' and client_id=? `;


  sql.query(` SELECT umn.Id,umn.UserName,umn.Password,umn.client_id,
    cm.name as client_name,umn.f_Name,umn.l_Name,umn.mobile,umn.email ,
    umn.user_type,umn.is_verified, urm.role_id,rm.code, rm.name, umn.cpo_id,umn.country_id
    FROM user_mst_new umn left join user_role_mapping urm on umn.id=urm.user_id  and urm.status='Y' and urm.default_role = 'Y'
    left join role_mst rm on urm.role_id = rm.id and rm.status='Y'
    left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
    WHERE umn.mobile =? and umn.status='Y'  `, mobile, async (err, res) => {
    
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      final_resp = res[0];
      
      if (res[0].client_id > 0) {
        try {
          resp = await pool.query(stmt2, [res[0].client_id]);
        } catch (e) {
          resp = [];
        }

        if (resp.length > 0) {

          final_resp.client_module_config = resp[0];
          final_resp = {
            status: true,
            message: 'SUCCESS',
            data: final_resp
          };
        } else {
          final_resp = {
            status: false,
            message: 'Client module configuration is missing',
            data: []
          };
        }
      } else {
        final_resp.client_module_config = {};
        final_resp = {
          status: true,
          message: 'SUCCESS',
          data: final_resp
        };
      }

      result(null, final_resp);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

LoginUser.findByUserId = (params, result) => {

  let resp;
  let final_resp;
  let stmt2 = `SELECT id,client_id,booking_allowed,payment_allowed,reward_allowed,
    penalty_allowed,otp_authentication,invoice_allowed,
    status,created_date,created_by,modified_date,modified_by
    FROM client_module_config where status='Y' and client_id=? `;

    let stmt3 ;

    if(!!params.user_type==1){
      stmt3 = ` SELECT umn.Id,umn.UserName,umn.Password,umn.client_id,
        cm.name as client_name,umn.f_Name,umn.l_Name,umn.mobile,umn.email ,
        umn.user_type,umn.is_verified, urm.role_id,rm.code, rm.name, umn.cpo_id
        FROM user_mst_new umn left join user_role_mapping urm on umn.id=urm.user_id  and urm.status='Y' and urm.default_role = 'Y'
        left join role_mst rm on urm.role_id = rm.id and rm.status='Y'
        left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
        WHERE umn.ble_user_id =? and user_type='SPIN_ADMIN' and umn.status='Y'  `;
    }else{
      stmt3 = ` SELECT umn.Id,umn.UserName,umn.Password,umn.client_id,
        cm.name as client_name,umn.f_Name,umn.l_Name,umn.mobile,umn.email ,
        umn.user_type,umn.is_verified, urm.role_id,rm.code, rm.name, umn.cpo_id
        FROM user_mst_new umn left join user_role_mapping urm on umn.id=urm.user_id  and urm.status='Y' and urm.default_role = 'Y'
        left join role_mst rm on urm.role_id = rm.id and rm.status='Y'
        left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
        WHERE umn.ble_user_id =? and user_type<>'SPIN_ADMIN' and umn.status='Y'  `;
    }
//;
  sql.query(stmt3, params.ble_user_id, async (err, res) => {
    
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      final_resp = res[0];
      
      if (res[0].client_id > 0) {
        try {
          resp = await pool.query(stmt2, [res[0].client_id]);
        } catch (e) {
          resp = [];
        }

        if (resp.length > 0) {

          final_resp.client_module_config = resp[0];
          final_resp = {
            status: true,
            message: 'SUCCESS',
            data: final_resp
          };
        } else {
          final_resp = {
            status: false,
            message: 'Client module configuration is missing',
            data: []
          };
        }
      } else {
        final_resp.client_module_config = {};
        final_resp = {
          status: true,
          message: 'SUCCESS',
          data: final_resp
        };
      }



      result(null, final_resp);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

//forgotpassword
User.forgotpassword = async (newUser, result) => {
  let final_result;
  var datetime = new Date();
  let otp = await _utility.generateOTP();

  let stmt = `update user_mst_new set 
      otp = '${otp}',is_verified = 'N' 
      where mobile = '${newUser.mobile}' and status = 'Y' `;

  sql.query(stmt, async (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    let response_send_otp = await _utility.sendOTP('FORGOT_PASSWORD', otp, newUser.mobile, newUser.email);
    if (response_send_otp.message == "SUCCESS") {
      final_result = {
        status: true,
        message: 'Please verify user with OTP sent'
      }
    } else {
      final_result = {
        status: false,
        message: 'Please retry'
      }
    }

    result(null, final_result);
  });
};


User.forgotPasswordNew = async (newUser, result) => {
  let final_result;
  var datetime = new Date();
  var resp;
  //let otp = await _utility.generateOTP();

  let stmt = `update user_mst_new set is_verified = 'N', modify_date=? 
    where mobile = '${newUser.mobile}' and status = 'Y' `;

  try {

    resp = await pool.query(stmt, [datetime]);

    if (resp.affectedRows > 0) {
      //registered successfully without verified
      params = {
        otp_purpose: 'FORGOT_PASSWORD',
        mobile: newUser.mobile,
        email: newUser.email
      }
      
      respOtp = await func_getOTPNew(params);
      
      if (!respOtp.status) {
        final_res = {
          status: true,
          err_code: 'ERROR : 0',
          message: 'User registered successfully. Error in sending OTP.',
          data: [{
            id: resp.insertId
          }]
        }
        result(null, final_res);
      } else {
        final_res = {
          status: true,
          err_code: 'ERROR : 0',
          message: 'SUCCESS',
          data: [{
            id: resp.insertId
          }]
        }
      }

    } else {
      final_res = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'FAILED',
        data: []
      }
      result(null, final_res);
    }
  } catch (err) {

    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }



  sql.query(stmt, async (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    let response_send_otp = await _utility.sendOTP('FORGOT_PASSWORD', otp, newUser.mobile, newUser.email);
    if (response_send_otp.message == "SUCCESS") {
      final_result = {
        status: true,
        message: 'Please verify user with OTP sent'
      }
    } else {
      final_result = {
        status: false,
        message: 'Please retry'
      }
    }

    result(null, final_result);
  });
};

//forgotpassword
// User.Webforgotpassword = async (newUser, result) => {
//   let final_result;
//   var datetime = new Date();

//   let genPass = await _utility.generatePassword();

//   let stmt = `update user_mst_new set 
//     password = '${genPass}'
//     where username = '${newUser.username}' and status = 'Y' `;

//   sql.query(stmt, async (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     let response_send_otp = await _utility.sendOTP('FORGOT_PASSWORD', otp, newUser.mobile, newUser.email);
//     if (response_send_otp.message == "SUCCESS") {
//       final_result = {
//         status: true,
//         message: 'User OTP successfully. Please verify user with OTP sent'
//       }
//     } else {
//       final_result = {
//         status: false,
//         message: 'Please retry'
//       }
//     }

//     result(null, final_result);
//   });
// };



User.Webforgotpassword = async (newUser, result) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpValidity = new Date(Date.now() + 10 * 60000); // 10 mins

    const stmt = `
      UPDATE user_mst_new
      SET otp = ?,
          otp_validity = ?,
          otp_used = 0
      WHERE username = ?
        AND email = ?
        AND status = 'Y'
    `;

    sql.query(
      stmt,
      [otp, otpValidity, newUser.username, newUser.email],
      async (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        if (res.affectedRows === 0) {
          result(null, {
            status: false,
            message: 'Invalid username or email'
          });
          return;
        }

        const mailSent = await sendForgotPasswordOTP(
          newUser.email,
          otp
        );

        if (!mailSent) {
          result(null, {
            status: false,
            message: 'OTP sending failed'
          });
          return;
        }

        result(null, {
          status: true,
          message: 'OTP sent to registered email'
        });
      }
    );
  } catch (error) {
    result(error, null);
  }
};



// User.updatepassword = (newUser, result) => {

//   let final_result;
//   var datetime = new Date();

//   let stmt = `update user_mst_new set 
//         password = '${newUser.password}',registration_origin = '${newUser.registration_origin}',     
//         modifyby = ${newUser.modify_by},modify_date = '${datetime.toISOString().slice(0, 10)}' 
//         where id=  ${newUser.id} and status = 'Y'`;

//   sql.query(stmt, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     final_result = {
//       status: true,
//       message: 'User password updated successfully.'
//     }

//     result(null, final_result);
//   });
// };

// use for ble and charger 25-03-2022

User.updatepassword = (newUser, result) => {
  const datetime = new Date();

  const stmt = `
    UPDATE user_mst_new
    SET password = ?,
        otp_used = 1,
        otp = NULL,
        otp_validity = NULL,
        modify_date = ?
    WHERE username = ?
      AND otp = ?
      AND otp_used = 0
      AND otp_validity >= NOW()
      AND status = 'Y'
  `;

  sql.query(
    stmt,
    [
      newUser.password,
      datetime,
      newUser.username,
      newUser.otp
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result(null, {
          status: false,
          message: 'Invalid or expired OTP'
        });
        return;
      }

      result(null, {
        status: true,
        message: 'Password updated successfully'
      });
    }
  );
};



User.updatePasswordNewBLE =  async(newUser, result) => {

  let final_result;
  var datetime = new Date();
 let resultID;

  let findstmt= `select ble_user_id from user_mst_new where  id='${newUser.id}'`
  try
  { 
     resultID =  await pool.query(findstmt);
     if(resultID.length <= 0)
     { 
      final_result = {
      status: false,
      message: 'user does not exist in user_mst_new',
      data: []
    }
     return result(null, final_result);
  }
     
  }

  catch (e) {
    final_res = {
      status: false,
      err_code: `ERROR : ${e.code} `,
      message: e.message,
      data: []
    }
 // return  result(null, final_result);
  }
//
  let stmt = `update user_mst_new set 
        password = '${newUser.password}',registration_origin = '${newUser.registration_origin}',     
        modifyby = ${newUser.modify_by},modify_date = '${datetime.toISOString().slice(0, 10)}' 
        where id=  ${newUser.id} and status = 'Y'`;

        // start update password field in spin database
      // hash the password here
      try {
        hash=await helper.hash(newUser.password);
       // hash = await bcrypt.hash(newUser.password, 10);
      } catch (e) {
        final_result = {
          status: false,
          err_code: `ERROR : ${e.code} `,
          message : 'Unable to hash password',
          data: []
        }
    
   //     return result(null, final_result);
      }
  
        let mgstmt=`update users set 
        password = '${hash}'  
        where id= '${resultID[0].ble_user_id}'`;

        // end update password field in spin database
    try
    { 
      await pool.query(stmt);
      await poolMG.query(mgstmt);
      final_result = {
        status: true,
        message: 'User password updated successfully.'
      }
    //  result(null, final_result);
      
    }

    catch (e) {
      final_result = {
        status: false,
        err_code: `ERROR : ${e.code} `,
        message: e.message,
        data: []
      }
     // return  result(null, final_result);
    }
    finally {
      result(null, final_result);
    }
};


User.register = async (newUser, result) => {
  let final_res;
  var datetime = new Date();
  var otp_validity = new Date();
  otp_validity.setMinutes(otp_validity.getMinutes() + 5);


  let otp = await _utility.generateOTP();
  let stmt = `insert into user_mst_new (code  ,username  ,password  ,f_Name  ,m_Name  ,l_Name  ,
        dob  ,mobile  ,alt_mobile  ,
        email,device_id,app_version,os_version,
        user_type  ,client_id  ,can_expire  ,hint_question  ,
        hint_answer ,employee_code  ,is_verified ,otp ,otp_used,otp_validity,registration_origin  ,
        address1  ,address2  ,PIN  ,landmark  ,city_id ,state_id ,country_id ,
        status,created_date,createdby )
      VALUES ('${newUser.code}','${newUser.username}','${newUser.password}','${newUser.f_Name}','${newUser.m_Name}','${newUser.l_Name}',
      '${newUser.dob}','${newUser.mobile}','${newUser.alt_mobile}',
      '${newUser.email}','${newUser.device_id}','${newUser.app_version}','${newUser.os_version}',
      '${newUser.user_type}',${newUser.client_id},'${newUser.can_expire}',${newUser.hint_question},
      '${newUser.hint_answer}','${newUser.employee_code}','N','${otp}',0,?,'${newUser.registration_origin}',
      '${newUser.address1}','${newUser.address2}',${newUser.PIN},'${newUser.landmark}',${newUser.city_id},${newUser.state_id},${newUser.country_id},
      '${newUser.status}',?,${newUser.created_by}) `;


  let resp;
  try {
    resp = await pool.query(stmt, [otp_validity, datetime]);
    final_res = {
      status: true,
      message: 'SUCCESS',
      data: [{
        id: resp.insertId
      }]
    }

    let response_send_otp = await _utility.sendOTP('REGISTER', otp, newUser.mobile, newUser.email);

  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

User.registerNew = async (newUser, result) => {
  let final_res;
  let resp;
  var datetime = new Date();
  let respOtp;
  let resp1;
  let params = {};

  let stmt = `insert into user_mst_new (code, username, password, f_Name, m_Name, l_Name, 
      dob, mobile, alt_mobile, email, device_id, app_version, os_version, user_type, 
      client_id, can_expire, hint_question,hint_answer, employee_code, is_verified,
      registration_origin,address1, address2, PIN, landmark, city_id, state_id, country_id, fcm_id,
      status, created_date, createdby )
    VALUES ('${newUser.code}','${newUser.username}','${newUser.password}','${newUser.f_Name}','${newUser.m_Name}','${newUser.l_Name}',
    '${newUser.dob}','${newUser.mobile}','${newUser.alt_mobile}','${newUser.email}','${newUser.device_id}',
    '${newUser.app_version}','${newUser.os_version}','${newUser.user_type}',${newUser.client_id},'${newUser.can_expire}',${newUser.hint_question},
    '${newUser.hint_answer}','${newUser.employee_code}','N','${newUser.registration_origin}',
    '${newUser.address1}','${newUser.address2}',${newUser.PIN},'${newUser.landmark}',${newUser.city_id},${newUser.state_id},${newUser.country_id}, '${newUser.fcm_id}',
    '${newUser.status}',?,${newUser.created_by}) `;

  try {
//
    resp = await pool.query(stmt, [datetime]);

    if (resp.insertId > 0) {
      resp1 = await _userModel.mapUserIdTag(resp.insertId,newUser.created_by);
      //registered successfully without verified
      params = {
        otp_purpose: 'REGISTER',
        user_id: resp.insertId,
        mobile: newUser.mobile,
        email: newUser.email
      }
      respOtp = await func_getOTPNew(params);

      if (!respOtp.status) {
        final_res = {
          status: true,
          err_code: 'ERROR : 0',
          message: 'User registered successfully. Error in sending OTP.',
          data: [{
            id: resp.insertId,
            user_id_tag: resp1.user_id_tag
          }]
        }
        result(null, final_res);
      } else {
        final_res = {
          status: true,
          err_code: 'ERROR : 0',
          message: 'SUCCESS',
          data: [{
            id: resp.insertId,
            user_id_tag: resp1.user_id_tag
          }]
        }
      }

    } else {
      final_res = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'FAILED',
        data: []
      }
      result(null, final_res);
    }

  } catch (err) {

    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res,resp1);
  }
  // }
};


User.registerNewBLE = async (newUser, result) => {
  let final_res;
  let resp;
  var datetime = new Date();
  let respOtp;
  let params = {};

  let stmt = `insert into user_mst_new (ble_user_id,code, username, password, f_Name, m_Name, l_Name, 
      dob, mobile, alt_mobile, email, device_id,
      app_version, os_version, user_type, client_id, can_expire, hint_question,
      hint_answer, employee_code, is_verified, registration_origin, 
      address1, address2, PIN, landmark, city_id, state_id, country_id, fcm_id,
      status, created_date, createdby )
    VALUES (${newUser.ble_user_id},'${newUser.code}','${newUser.username}','${newUser.password}','${newUser.f_Name}','${newUser.m_Name}','${newUser.l_Name}',
    '${newUser.dob}','${newUser.mobile}','${newUser.alt_mobile}','${newUser.email}','${newUser.device_id}',
    '${newUser.app_version}','${newUser.os_version}','${newUser.user_type}',${newUser.client_id},'${newUser.can_expire}',${newUser.hint_question},
    '${newUser.hint_answer}','${newUser.employee_code}','N','${newUser.registration_origin}',
    '${newUser.address1}','${newUser.address2}',${newUser.PIN},'${newUser.landmark}',${newUser.city_id},${newUser.state_id},${newUser.country_id},'${newUser.fcm_id}',
    '${newUser.status}',?,${newUser.created_by}) `;
//;
  try {

    resp = await pool.query(stmt, [datetime]);

    if (resp.insertId > 0) {

      if (resp.insertId > 0) {
        //registered successfully without verified
        resp1 = await _userModel.mapUserIdTag(resp.insertId,newUser.created_by);
        params = {
          otp_purpose: 'REGISTER',
          user_id: resp.insertId,
          mobile: newUser.mobile,
          email: newUser.email
        }
        respOtp = await func_getOTPNew(params);
  
        if (!respOtp.status) {
          final_res = {
            status: true,
            err_code: 'ERROR : 0',
            message: 'User registered successfully. Error in sending OTP.',
            data: [{
              id: resp.insertId,
              user_id_tag: resp1.user_id_tag
            }]
          }
          result(null, final_res);
        } else {
          final_res = {
            status: true,
            err_code: 'ERROR : 0',
            message: 'SUCCESS',
            data: [{
              id: resp.insertId,
              user_id_tag: resp1.user_id_tag
            }]
          }
        }
  
      } else {
        final_res = {
          status: false,
          err_code: 'ERROR : 1',
          message: 'FAILED',
          data: []
        }
        result(null, final_res);
      }
    }
  } catch (err) {

    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
  // }
};

User.getOTP = async (newUser, result) => {
  let final_res;
  var datetime = new Date();
  let otp = await _utility.generateOTP();
  let stmt = `update user_mst_new set otp = ${otp} where id = ${newUser.id} `;
  let resp;
  try {
    resp = await pool.query(stmt);
    let response_send_otp = await _utility.sendOTP('RESEND', otp, newUser.mobile, newUser.email);


    if (response_send_otp.message == "SUCCESS") {
      final_res = {
        status: true,
        message: 'OTP sent successfully.'
      }
    } else {
      final_res = {
        status: false,
        message: 'Please retry'
      }
    }
  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR : ${!!err.code ? err.code : 'System error'}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

User.getOTPNew = async (params, result) => {
  let resp = await func_getOTPNew(params);

  result(null, resp);
};

async function func_getOTPNew(params) {

  let final_res;
  var datetime = new Date();
  var otp_validity = new Date();
  otp_validity.setMinutes(otp_validity.getMinutes() + 5);

  let stmtUser;
  let stmtCharger;
  let resp;
  let respUser;
  let respCharger;
  let user_id;
  let mobile;
  let charger_id;
debu
  let stmt = `insert into otp_authentication (user_id,charger_id,otp_purpose,otp, validity, is_used,
    status, created_date, createdby) values (?,?,?,?,?,?,?,?,?) `;

  otp = await _utility.generateOTP();

  try {
    if (params.otp_purpose == 'START_CHARGING') {
      user_id = params.id;
      stmtUser = `select mobile from user_mst_new where id = ? and status = 'Y' ; `;
      stmtCharger = `select id from charger_serial_mst where name = ? and status = 'Y' ; `;
      respUser = await pool.query(stmtUser, [user_id]);
      respCharger = await pool.query(stmtCharger, [params.charger_display_id]);

      if (respUser.length <= 0) {
        final_res = {
          status: false,
          err_code: 'ERROR : 1',
          message: 'User not found',
          count: 0,
          data: []
        }

        return final_res;
      } else {
        mobile = respUser[0].mobile;
      }

      if (respCharger.length <= 0) {
        final_res = {
          status: false,
          err_code: 'ERROR : 1',
          message: 'Charger not found',
          count: 0,
          data: []
        }
        return final_res;
      } else {
        charger_id = respCharger[0].id;
      }

    } else if (params.otp_purpose != 'REGISTER') {
      stmtUser = `select id from user_mst_new where mobile = ? and status = 'Y' ; `;
      respUser = await pool.query(stmtUser, [params.mobile]);

      if (respUser.length <= 0) {
        final_res = {
          status: false,
          err_code: 'ERROR : 1',
          message: 'Mobile number not registered',
          count: 0,
          data: []
        }
        return final_res;
      } else {
        user_id = respUser[0].id;
        charger_id = 0;
      }
    } else if (params.otp_purpose == 'REGISTER') {
      if (params.user_id) {
        user_id = params.user_id;
      } else {
        stmtUser = `select id from user_mst_new where mobile = ? and status = 'Y' ; `;
        respUser = await pool.query(stmtUser, [params.mobile]);
        if (respUser.length <= 0) {
          final_res = {
            status: false,
            err_code: 'ERROR : 1',
            message: 'Mobile number not registered',
            count: 0,
            data: []
          }
          return final_res;
        } else {
          user_id = respUser[0].id;
          //charger_id = 0;
        }
      }

      charger_id = 0;
    }
    resp = await pool.query(stmt, [user_id, charger_id, params.otp_purpose, otp, otp_validity, 0,
      'Y', datetime, user_id]);

    response_send_otp = await _utility.sendOTP(params.otp_purpose, otp, params.mobile, params.email);
    if (response_send_otp.status) {
      final_res = {
        status: true,
        message: response_send_otp.message
      }
    } else {
      final_res = {
        status: false,
        message: response_send_otp.message
      }
    }

  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR : ${!!err.code ? err.code : 'System error'}`,
      data: []
    }
  } finally {
    return final_res;
  }
}

// User.getOTPRemoteStart = async (newUser, result) => {
//   let final_res;
//   var datetime = new Date();
//   let otp = await _utility.generateOTP();
//   let stmt = `update user_mst_new set otp = ${otp} where id = ${newUser.id} `;
//   let resp;
//   try {
//     resp = await pool.query(stmt);
//     let response_send_otp = await _utility.sendOTP('RESEND',otp, newUser.mobile, newUser.email);

//     if (response_send_otp.message == "SUCCESS") {
//       final_res = {
//         status: true,
//         message: 'OTP sent successfully.'
//       }
//     } else {
//       final_res = {
//         status: false,
//         message: 'Please retry'
//       }
//     }
//   } catch (err) {
//     final_res = {
//       status: false,
//       message: `ERROR : ${!!err.code ? err.code : 'System error'}`,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// };

User.getOTPAnonymous = async (newUser, result) => {
  let final_res;
  var datetime = new Date();
  let otp = await _utility.generateOTP();
  let resp;
  try {
//;
    let response_send_otp = await _utility.sendOTP('OTP_FOR_ANONYMOUS', otp, newUser.mobile, newUser.email);

    if (response_send_otp.message == "SUCCESS") {
      final_res = {
        status: true,
        message: 'OTP sent successfully.'
      }
    } else {
      final_res = {
        status: false,
        message: 'Please retry'
      }
    }
  } catch (err) {
    final_res = {
      status: false,
      message: `ERROR : ${err.code}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

User.verifyUser = async (newUser, result) => {
  let final_result;
  var datetime = new Date();
  let user_id;

  let stmt = `select otp,id,otp_used,otp_validity from user_mst_new 
  where mobile = '${newUser.mobile}' and status = 'Y' and otp='${newUser.otp}' 
  and otp_used=0 and otp_validity>=now() 
  order by id desc limit 1`;


  sql.query(stmt, async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }


    if (res.length > 0) {
      let stmt = `update user_mst_new set 
      is_verified = 'Y' , otp_used=1
      where mobile = '${newUser.mobile}' and status = 'Y'`;

      sql.query(stmt, async (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        final_result = {
          status: true,
          message: 'User verified successfully.',
          data: {
            user_id: user_id
          }
        }
        result(null, final_result);
      });
    } else {
      final_result = {
        status: false,
        message: 'Wrong OTP.'
      }
      result(null, final_result);
      return;
    }

  });
};


User.verifyUserNew = async (newUser, result) => {
  let final_res;
  let resp;
  let respValidate;
  var datetime = new Date();
  let message = 'OTP is validated';
  let status = false;
  let stmtValidate;

  let stmt = `select oa.otp, oa.id, oa.is_used, oa.validity , umn.is_verified, umn.id as user_id
  from otp_authentication oa inner join user_mst_new umn on oa.user_id=umn.id and umn.status='Y' 
  where umn.mobile = ?  order by oa.id desc limit 1;`;

  try {
    resp = await pool.query(stmt, [newUser.mobile]);

    if (resp.length > 0) {

      if (resp[0].is_verified == 'Y') {
        message = 'User already verified';
      } else if (resp[0].otp == newUser.otp) {
        if (resp[0].is_used == 1) {
          message = 'OTP is already used';
        } else if (resp[0].validity < datetime) {
          message = 'OTP is expired';
        } else {
          status = true;
        }
      } else {
        message = 'Invalid OTP';
      }

      if (status) {
        stmtValidate = `update user_mst_new set is_verified = 'Y' ,modify_date=?,modifyby=? where id = ? `;
        respValidate = await pool.query(stmtValidate, [datetime, resp[0].user_id, resp[0].user_id]);

        message = 'User verified successfully';

        stmtValidate = `update otp_authentication set is_used = 1, status='N',modify_date=?,modifyby=? where user_id = ? and otp_purpose = 'REGISTER' `;
        respValidate = await pool.query(stmtValidate, [datetime, resp[0].user_id, resp[0].user_id]);

        final_res = {
          status: status,
          err_code: 'ERROR : 0',
          message: message,
          data: []
        }
      } else {
        final_res = {
          status: status,
          err_code: 'ERROR : 1',
          message: message,
          data: []
        }
      }

    } else {
      final_res = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'User not registered for this mobile number or OTP is not generated.',
        data: []
      }
    }

  } catch (e) {
    final_res = {
      status: false,
      err_code: `ERROR : ${e.code} `,
      message: e.message,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};


User.verifyUserNewBLE = async (newUser, result) => {
  let final_res;
  let resp;
  let respValidate;
  var datetime = new Date();
  let message = 'OTP is validated';
  let status = false;
  let stmtValidate;
  let stmtBLE;
  let respBLE;
  let stmtUserDetails;
  let respUserDetails;

  let stmt = `select oa.otp, oa.id, oa.is_used, oa.validity , umn.is_verified, umn.id as user_id
  from otp_authentication oa inner join user_mst_new umn on oa.user_id=umn.id and umn.status='Y' 
  where umn.mobile = ?  order by oa.id desc limit 1;`;

  stmtBLE = `update users set is_verified=1 where mobile= ? ;`;

  stmtUserDetails = `select email,password,app_version,device_id,mobile,fcm_id from users where mobile =${newUser.mobile} ;`;

  try {
    respUserDetails= await poolMG.query(stmtUserDetails, [newUser.mobile]);

    resp = await pool.query(stmt, [newUser.mobile]);

    if (resp.length > 0) {

      if (resp[0].is_verified == 'Y') {
        message = 'User already verified';
      } else if (resp[0].otp == newUser.otp) {
        if (resp[0].is_used == 1) {
          message = 'OTP is already used';
        } else if (resp[0].validity < datetime) {
          message = 'OTP is expired';
        } else {
          status = true;
        }
      } else {
        message = 'Invalid OTP';
      }

      if (status) {
        stmtValidate = `update user_mst_new set is_verified = 'Y' ,modify_date=?,modifyby=? where id = ? `;
        respValidate = await pool.query(stmtValidate, [datetime, resp[0].user_id, resp[0].user_id]);

        //added for BLE sync
        //;
        respBLE = await poolMG.query(stmtBLE, [ newUser.mobile]);
        //added for BLE sync

        message = 'User verified successfully';

        stmtValidate = `update otp_authentication set is_used = 1, status='N',modify_date=?,modifyby=? where user_id = ? and otp_purpose = 'REGISTER' `;
        respValidate = await pool.query(stmtValidate, [datetime, resp[0].user_id, resp[0].user_id]);


        //;
        //call login api spin
        respLoginApi = await callSPINLoginApi(respUserDetails,newUser);
        //;

        final_res = {
          status: status,
          err_code: 'ERROR : 0',
          message: message,
          data: respLoginApi
        }
      } else {
        final_res = {
          status: status,
          err_code: 'ERROR : 1',
          message: message,
          data: []
        }
      }

    } else {
      final_res = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'User not registered for this mobile number or OTP is not generated.',
        data: []
      }
    }

  } catch (e) {
    final_res = {
      status: false,
      err_code: `ERROR : ${e.code} `,
      message: e.message,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};


User.verifyOTP = async (newUser, result) => {
  let final_result;
  let user_id;

  let stmt = `select otp,id from user_mst_new where 
    mobile = '${newUser.mobile}' and status = 'Y' order by id desc limit 1`;

  sql.query(stmt, async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    user_id = res[0].id;
    if (newUser.otp != res[0].otp) {
      final_result = {
        status: false,
        message: 'Wrong OTP.'
      }
      result(null, final_result);
      return;
    }

    final_result = {
      status: true,
      message: 'OTP verified successfully.',
      data: {
        user_id: user_id
      }
    }
    result(null, final_result);
  });
};

User.verifyOTPNew = async (newUser, result) => {
  let final_res;
  let resp;
  let respValidate;
  var datetime = new Date();
  let message = 'OTP is validated';
  let status = false;
  let stmtValidate;

  let stmt = `select oa.otp, oa.id, oa.is_used, oa.validity, umn.id as user_id
  from otp_authentication oa inner join user_mst_new umn on oa.user_id=umn.id and umn.status='Y' 
  where umn.mobile = ?  order by oa.id desc limit 1;`;

  try {

    resp = await pool.query(stmt, [newUser.mobile]);

    if (resp.length > 0) {
      if (resp[0].otp == newUser.otp) {
        if (resp[0].is_used == 1) {
          message = 'OTP is already used';
        } else if (resp[0].validity < datetime) {
          message = 'OTP is expired';
        } else {
          status = true;
        }
      } else {
        message = 'Invalid OTP';
      }

      if (status) {
        stmtValidate = `update otp_authentication set is_used = 1, status='N',modify_date=?,modifyby=? where user_id = ? and otp_purpose <> 'REGISTER' `;
        respValidate = await pool.query(stmtValidate, [datetime, resp[0].user_id, resp[0].user_id]);

        final_res = {
          status: status,
          err_code: 'ERROR : 0',
          message: message,
          data: [
            { user_id: resp[0].user_id }
          ]
        }
      } else {
        final_res = {
          status: status,
          err_code: 'ERROR : 1',
          message: message,
          data: []
        }
      }

    } else {
      final_res = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'User not registered for this mobile number or OTP is not generated.',
        data: []
      }
    }

  } catch (e) {
    final_res = {
      status: false,
      err_code: `ERROR : ${e.code} `,
      message: e.message,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

generatePassword = () => {
  var length = 8,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

callSPINLoginApi = async (params,params2) => {
 
  let resp;
  let resp1;
  
  //;
  resp = await axios.post('https://spinapistaging.in/v1/api/v1/loginNew', {
    email: params[0].email,
    password: params[0].password,
    app_version: params2.app_version,
    mobile_deviceid: params2.mobile_deviceid,
    fcm_id: params2.fcm_id,
    update_status :params2.update_status,
    project_id: 4,
    checkPassword:0
  })
  .then(function (response) {
    //
    resp1=response;
  })
  .catch(function (error) {
    //;
    console.log(error);
  });

  return resp1.data;
};


updateLoginDetails = async (params,id) => {
  let final_res;
  let resp;
  
  var datetime = new Date();
 

  let stmt = `update user_mst_new set device_id = '${params.device_id}', fcm_id='${params.fcm_id}' , 
  app_version = '${params.app_version}' where id = ${id}`;
  
  try {

    resp = await pool.query(stmt);
//;

if(resp.affectedRows>0){
  final_res = {
    status: true,
    err_code: 'ERROR : 0',
    message: 'User details updated',
    data: []
  }
}else{
  final_res = {
    status: fasle,
    err_code: 'ERROR : 0',
    message: 'User not found',
    data: []
  }
}

  } catch (e) {
    final_res = {
      status: false,
      err_code: `ERROR : ${e.code} `,
      message: e.message,
      data: []
    }
  } finally {
    return final_res;
  }
};

module.exports = { LoginUser, User,hash,updateLoginDetails};