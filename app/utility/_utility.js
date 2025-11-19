var otpGenerator = require('otp-generator');
const request = require('request');
const { sql, pool } = require("../models/db");
// var moment = require("moment");

function generateOTP() {
  let newOTP = 0;

  newOTP = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

  return newOTP;
}

function generatePassword() {
  let newPassword = 0;

  newPassword = otpGenerator.generate(6, { alphabets: true, upperCase: false, specialChars: true });

  return newPassword;
}

async function sendOTP(action, otp, mobile_no, email) {

  let text;
  let entity_id = '1401366180000014430';
  // let template_id = '1407159912792781073';
  let template_id = '1007517596165453574';
  let user_id_gupshup = 2000196180;
  let password_gupshup = 'Swanswan@@1';

  // if(action == 'FORGOT_PASSWORD'){
  //     text = `Please find the OTP ${otp} to reset your password`;
  //     template_id = 1407159912792781073;
  // }else if(action == 'REGISTER'){
  //     text = `Please find your OTP ${otp} for one time registration`;
  //     template_id = 1407159912792781073;
  // }else if(action == 'RESEND'){
  //     text = `Please find your OTP ${otp} for one time registration`;
  //     template_id = 1407159912792781073;
  // }
  text = `Your OTP is ${otp} Belectriq`

  //date : 06 05 2025 : as sms api not working
  // let url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
  let url = `test`
  // let url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`

  if (action == 'RESEND') {
    //date : 06 05 2025 : as sms api not working
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&entityid=${entity_id}&templateid=${template_id}&text=${text}&rpt=1&summary=1&output=json`;
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
     url = `test`

    // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
  }


  let promise = new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }

      if (action == 'RESEND') {
        if (res.statusCode == 200) {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        } else {
          resolve({
            status: false,
            message: 'Error in sending sms'
          });
        }
      } else {
        if (body.STATUS == "ERROR") {
          if (body.RESPONSE.INFO == 'NO VALID RECEIPIENT FOUND!') {
            resolve({
              status: false,
              message: 'INVALID RECEIPIENT'
            });
          } else {
            resolve({
              status: false,
              message: 'Error in sending sms'
            });
          }

        } else {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        }
      }
    });
  });

  return await promise;
}

async function sendOTP_V1(action, otp, mobile_no, email,country_id, template_id) {

  let text;
  let entity_id = '1401366180000014430';
  let url;
  let user_id_gupshup = 2000196180;
  let password_gupshup = 'Swanswan@@1';
  text = `Your OTP is ${otp} Test`

  //date : 23 02 2022 : as sms api not working
  if(country_id==1){
  //  url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
   url = `test`
     if (action == 'RESEND') {
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
     url = `test`;
     }
  }else{
  //  url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
  url = `test`
  }

  let promise = new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }

      if (action == 'RESEND') {
        if (res.statusCode == 200) {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        } else {
          resolve({
            status: false,
            message: 'Error in sending sms'
          });
        }
      } else {
        if (body.STATUS == "ERROR") {
          if (body.RESPONSE.INFO == 'NO VALID RECEIPIENT FOUND!') {
            resolve({
              status: false,
              message: 'INVALID RECEIPIENT'
            });
          } else {
            resolve({
              status: false,
              message: 'Error in sending sms'
            });
          }

        } else {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        }
      }
    });
  });

  return await promise;
}

async function sendOTP_Anonymous_V1(action, otp, mobile_no, email, country_code, template_id) {

  let text;
  let entity_id = '1401366180000014430';
  let url;
  let user_id_gupshup = 2000196180;
  let password_gupshup = 'Swanswan@@1';
  let user_id_gupshup_international = 2000207651;
  let password_gupshup_international = 'Exicom@1234!@';
  text = `Your OTP is ${otp} Exicom`;
  let resp;

   
  //date : 23 02 2022 : as sms api not working
  if (country_code == 91) {
    // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
     url = `test`
    if (action == 'RESEND') {
      // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
       url = `test`;
    }
  } else {
    //  url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
    // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=+${country_code}${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup_international}&auth_scheme=plain&password=${password_gupshup_international}&v=1.1&format=text`
     url = `test`
  }
   
  let promise = new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }

      if (action == 'RESEND') {
        if (res.statusCode == 200) {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        } else {
          resolve({
            status: false,
            message: 'Error in sending sms'
          });
        }
      } else {
        if (body.STATUS == "ERROR") {
          if (body.RESPONSE.INFO == 'NO VALID RECEIPIENT FOUND!') {
            resolve({
              status: false,
              message: 'INVALID RECEIPIENT'
            });
          } else {
            resolve({
              status: false,
              message: 'Error in sending sms'
            });
          }

        } else {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        }
      }
    });
  });

  return await promise;
}

//---use for send sms notification
async function sendSMSDynamic(action, txtMsg, mobile_no, email) {
  //
  let text;
  let entity_id = '1401366180000014430';
  // let template_id = '1407159912792781073';
  let template_id = '1007517596165453574';
  let user_id_gupshup = 2000196180;
  let password_gupshup = 'Swanswan@@1';


  // text = `Your OTP is ${otp} Cubenz`
  text = txtMsg;
  //date : 02 05 2025 : as sms api not working
   let url = `test`
  // let url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
  // let url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`

  if (action == 'RESEND') {
    //date : 02 05 2025 : as sms api not working
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&entityid=${entity_id}&templateid=${template_id}&text=${text}&rpt=1&summary=1&output=json`;
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
    // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
    url = `test`

    // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
  }


  let promise = new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }

      if (action == 'RESEND') {
        if (res.statusCode == 200) {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        } else {
          resolve({
            status: false,
            message: 'Error in sending sms'
          });
        }
      } else {
        if (body.STATUS == "ERROR") {
          if (body.RESPONSE.INFO == 'NO VALID RECEIPIENT FOUND!') {
            resolve({
              status: false,
              message: 'INVALID RECEIPIENT'
            });
          } else {
            resolve({
              status: false,
              message: 'Error in sending sms'
            });
          }

        } else {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        }
      }
    });
  });

  return await promise;
}

async function sendSMSDynamic_V1(action, txtMsg, mobile_no, email, country_id, template_id) {
  //
  let text;
  let entity_id = '1401366180000014430';
  let user_id_gupshup = 2000196180;
  let password_gupshup = 'Swanswan@@1';

  let url;


  // text = `Your OTP is ${otp} Exicom`
  text = txtMsg;

  //For country id = 1 => India, then logic will work as below
  if (country_id != 1) {
   // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
   url = `test`
  }else {
    // url = `https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=${mobile_no}&msg=${text}&msg_type=TEXT&userid=${user_id_gupshup}&auth_scheme=plain&password=${password_gupshup}&v=1.1&format=text`
       url = `test`
    if (action == 'RESEND') {
      // url = `http://www.onex-ultimo.in/api/pushsms?user=Exicom2019&authkey=92l5MK3SZjFJk&sender=Exichg&mobile=${mobile_no}&text="${text}"&rpt=1&summary=1&output=json&entityid=${entity_id}&templateid=${template_id}`;
       url = `test`
    }
  }

  let promise = new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }

      if (action == 'RESEND') {
        if (res.statusCode == 200) {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        } else {
          resolve({
            status: false,
            message: 'Error in sending sms'
          });
        }
      } else {
        if (body.STATUS == "ERROR") {
          if (body.RESPONSE.INFO == 'NO VALID RECEIPIENT FOUND!') {
            resolve({
              status: false,
              message: 'INVALID RECEIPIENT'
            });
          } else {
            resolve({
              status: false,
              message: 'Error in sending sms'
            });
          }

        } else {
          resolve({
            status: true,
            message: 'SUCCESS'
          });
        }
      }
    });
  });

  return await promise;
}

async function getClientIdAndRoleByUserId(user_id) {

  let final_res;
  let resp;
debugger;
  //added default role flag as if user's default role is SA only then it will be considered as SA
  let stmt = ` select umn.client_id, cm.name , urm.role_id as role_id , rm.code as role_code,
    rm.name as role_name
    from user_mst_new umn 
    left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
    left join user_role_mapping urm on umn.id = urm.user_id and urm.status = 'Y'
    left join role_mst rm on urm.role_id = rm.id and rm.status = 'Y'
    where umn.id = ${user_id} and umn.status='Y' and urm.default_role='Y' 
    order by role_id; `;
  // let stmt = ` select umn.client_id, cm.name , urm.role_id as role_id , rm.code as role_code,
  //   rm.name as role_name
  //   from user_mst_new umn 
  //   left join client_mst cm on umn.client_id = cm.id and cm.status='Y'
  //   left join user_role_mapping urm on umn.id = urm.user_id and urm.status = 'Y'
  //   left join role_mst rm on urm.role_id = rm.id and rm.status = 'Y'
  //   where umn.id = ${user_id} and umn.status='Y'  order by role_id; `;
  //;
  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    return final_res;
  }

}

function validateDate(dateString) {

  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date

  return d.toISOString().slice(0, 10) === dateString;

}

function validateYear(year) {

  let status;
  (year < 1900 || year > 2099) ? status = false : status = true;
  return status;

}

function minusMinutesToStringTime(time, minsToAdd) {
  function D(J) { return (J < 10 ? '0' : '') + J };
  var piece = time.split(':');

  var mins = piece[0] * 60 + +piece[1] - +minsToAdd;

  return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}
function addMinutesToStringTime(time, minsToAdd) {
  function D(J) { return (J < 10 ? '0' : '') + J };
  var piece = time.split(':');

  var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

  return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}


async function getAppSettingConfiguration(settingtype) {

  let final_res;
  let resp;

  let stmt = `select id,name,setting_value FROM settings where application = '${settingtype}'`;

  try {
    resp = await pool.query(stmt);

    final_res = {
      status: resp.length > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      count: resp.length,
      data: resp
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      count: 0,
      data: []
    }
  } finally {
    return final_res;
  }


}

function getTimeDifference(current_date, to_time, from_time) {
  //;
  from_time = new Date(current_date + ' ' + from_time);
  to_time = new Date(current_date + ' ' + to_time);

  return ((to_time - from_time) / 1000) / 60;
}

function getArraytoString(arrary_data) {
  return arrary_data.map(x => x);
}

function getDayDifference(f_date, t_date) {
  const date1 = new Date(f_date);
  const date2 = new Date(t_date);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getYYYYMMDDHHMMSSfromDate() {
  //;
  const date = new Date();
  const currentTime = date.getFullYear() + '' + (date.getMonth() + 1)
    + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();

  return currentTime;
}

function convertDatetimeToStringYYYYMMDDHHMMSS() {
  //;
  const date = new Date();
  const currentTime = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return currentTime;
}


function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isLessThan24Hrs(startDate) {
  let msIn24Hrs = 86400000;
  let differenceInMs;
  let result = false;
  //;

  differenceInMs = (new Date() - new Date(startDate));

  if (differenceInMs <= msIn24Hrs) result = true;

  return result;
}

async function callExternalApi(url, method, params) {
   
  const options = {
    url: url,
    method: method,
    body: params,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': params.length
      // 'Authorization': apiKey
    }
  };
  // return new Promise((resolve,reject)=>{
  //     const options = {
  //         url: url,
  //         method: method,
  //         body:params,
  //         json: true,
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Content-Length': params.length
  //             // 'Authorization': apiKey
  //         }
  //        };
  //     request(options).then(function (response){
  //         resolve(response);
  //     })
  //     .catch(function (err) {
  //         console.log(err);
  //         reject(err);
  //     })
  // });

  let promise = new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        resolve({
          status: false,
          message: err.code
        });
        return console.log('errrrrrr', err);
      }


      if (res.statusCode == 200) {
        resolve({
          status: true,
          message: 'SUCCESS'
        });
      } else {
        resolve({
          status: false,
          message: 'Error in sending sms'
        });
      }

    });
  });

  return await promise;
}

// async function getCoordinatesFromAddress(address){
//   
//  let final_resp;
//   let API_KEY='AIzaSyAdN0t0O5t1oBjeyZWGlGQ_3XVFWFarpmI';
//   let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
//   try{
//   let resp = await axios.get(url) ;
//   if (resp.data.results.length>0) {
//     final_resp={
//       status: true,
//       err_code:resp.data.results.length>0 ? 'ERROR:0' :'ERROR:1',
//       message: resp.data.results.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
//       count: resp.data.results.length,
//       data: resp.data.results[0].geometry.location
//     }
//   } else {
//     final_resp = {
//       status: false,
//       message: "ERROR",
//       count: 0,
//       data: []
//     }
// }
// }catch(err){
//   final_resp = {
//     status: false,
//     message: "ERROR",
//     count: 0,
//     data: []
//   }
// }
//    
//   return final_resp;

//   }

async function getCoordinatesFromAddress(address_data) {
  let final_resp;
  let resp, url;
  array = [];
  let location_data = {};
  let API_KEY = 'AIzaSyAdN0t0O5t1oBjeyZWGlGQ_3XVFWFarpmI';
  try {
    for (let i = 0; i < address_data.length; i++) {
      const ele = address_data[i];
      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${ele.address}&key=${API_KEY}`;
      resp = await axios.get(url);
      location_data = {
        location: ele.address,
        dimension: resp.data.results[0].geometry.location
      }
      array.push(location_data);
    }
    if (resp.data.results.length > 0) {
      final_resp = {
        status: true,
        err_code: resp.data.results.length > 0 ? 'ERROR:0' : 'ERROR:1',
        message: resp.data.results.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
        count: resp.data.results.length,
        data: array
      }
    } else {
      final_resp = {
        status: false,
        message: "ERROR",
        count: 0,
        data: []
      }
    }
  } catch (err) {
    final_resp = {
      status: false,
      message: "ERROR",
      count: 0,
      data: []
    }
  }
  return final_resp;

}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}


module.exports = {

    generateOTP,
    sendOTP,
    generatePassword,
    getClientIdAndRoleByUserId,
    validateDate,
    validateYear,
    minusMinutesToStringTime,
    addMinutesToStringTime,
    getTimeDifference,
    getArraytoString,
    getDayDifference,
    getAppSettingConfiguration,
    isValidEmail,
    getYYYYMMDDHHMMSSfromDate,
    sendSMSDynamic,
    convertDatetimeToStringYYYYMMDDHHMMSS,
    isLessThan24Hrs,  
  sendSMSDynamic_V1,
  sendOTP_V1,
  callExternalApi,
  getCoordinatesFromAddress,
  sendOTP_Anonymous_V1,
  formatDate
}