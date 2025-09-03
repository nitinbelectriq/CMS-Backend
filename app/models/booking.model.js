const { sql, pool } = require("./db.js");
const _utility = require("../utility/_utility");
// const charger = require("../models/charger.model");

const booking_status = [
  {status : 'P',description : 'Pending'},
  {status : 'A',description : 'Accepted'},
  {status : 'R',description : 'Rejected'},
  {status : 'C',description : 'Cancelled'},
  {status : 'F',description : 'Finished'},
  {status : 'PP',description : 'Payment_Pending'},
  {status : 'D',description : 'Deleted'},
  {status : 'N',description : 'Inactive'},
];


const Booking = function (booking) {
  this.id = booking.id;
  this.booking_number = booking.booking_number;
  this.user_id = booking.user_id;
  this.mobile = booking.mobile;
  this.vehicle_id = booking.vehicle_id;
  this.registration_no = booking.registration_no;
  this.station_id = booking.station_id;
  this.charger_id = booking.charger_id;
  this.connector_no = booking.connector_no;
  this.connector_type_id = booking.connector_type_id;
  this.booking_date = booking.booking_date;
  this.start_time = booking.start_time;
  this.end_time = booking.end_time;
  this.duration = booking.duration;
  this.adv_booking_amt = booking.adv_booking_amt;
  this.booking_valid_upto = booking.booking_valid_upto;
  this.is_tnc_read = booking.is_tnc_read;
  this.status = booking.status;
  this.created_date = booking.created_date;
  this.created_by = booking.created_by;
  this.modified_date = booking.modified_date;
  this.modified_by = booking.modified_by;
};
const BookingConfig =function(bookingConfig){
  this.id = bookingConfig.id;
  this.station_id = bookingConfig.station_id;
  this.buffer_time = bookingConfig.buffer_time;
  this.booking_validity_time = bookingConfig.booking_validity_time;
  this.min_charging_duration = bookingConfig.min_charging_duration;
  this.max_charging_duration = bookingConfig.max_charging_duration;
  this.booking_cancellation_time = bookingConfig.booking_cancellation_time;
  this.adv_booking_time = bookingConfig.adv_booking_time;
  this.adv_booking_amount = bookingConfig.adv_booking_amount;
  this.status = bookingConfig.status;
  this.created_date = bookingConfig.created_date;
  this.created_by = bookingConfig.created_by;
  this.modified_date = bookingConfig.modified_date;
  this.modified_by = bookingConfig.modified_by;
  this.stations = bookingConfig.stations;

}

Booking.create = async (params, result) => {
  var datetime = new Date();
  let final_res;
  let resp;
  let stmt;
  let stmt_config;
  let resp_config;
  let resp_validation;
  let values = [];
  let booking_number = ('0' + (datetime.getDate())).slice(-2) + '' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '' + datetime.getFullYear() + '' + ('0' + (datetime.getHours())).slice(-2) + '' + ('0' + (datetime.getMinutes())).slice(-2) + '' + ('0' + (datetime.getSeconds())).slice(-2);
  let booking_valid_upto = new Date(params.booking_date + ' ' + params.start_time); //user can temper this field
  let end_time_with_buffer; //user can temper this field


  // do validations before insert
  // check time available 
  // user valid or not
  // charger valid or not
  // adv_booking amount
  // booking valid upto
  // previous date check

  resp_validation = await validate_booking_request(params);


  stmt_config = `select id,station_id,buffer_time,booking_validity_time,min_charging_duration,max_charging_duration,booking_cancellation_time,adv_booking_amount,adv_booking_time,status
  from booking_config where station_id=${params.station_id}  and status='Y'; `;

  stmt = `insert into booking_log (booking_number,user_id,mobile,vehicle_id,registration_no,station_id,charger_id,
    connector_no,connector_type_id,booking_date,start_time,end_time,end_time_with_buffer,duration,adv_booking_amt,
    booking_valid_upto,is_tnc_read,status,created_date,created_by ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `;


  try {
    resp_config = await pool.query(stmt_config);

    if (resp_config.length > 0) {

      booking_valid_upto.setMinutes(booking_valid_upto.getMinutes() + resp_config[0].booking_validity_time); //user can temper this field
      end_time_with_buffer = _utility.addMinutesToStringTime(params.end_time, resp_config[0].buffer_time); //user can temper this field


      values = [booking_number, params.user_id, params.mobile, params.vehicle_id, params.registration_no, params.station_id, params.charger_id,
        params.connector_no, params.connector_type_id, params.booking_date, params.start_time, params.end_time, end_time_with_buffer,
        params.duration, params.adv_booking_amt, booking_valid_upto, params.is_tnc_read, params.status, datetime, params.created_by];

      resp = await pool.query(stmt, values);

      if (resp.insertId > 0) {
        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: 1,
          data: [{ id: resp.insertId }]
        }
      } else {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'FAILED',
          count: 0,
          data: []
        }
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Booking configuration not found for this station',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
};


async function validate_booking_request() {


}

Booking.getAvailableTimeInterval = async (params, result) => {

  let final_res;
  let resp;
  let available_intervals = [];
  let interval;
  let o_time;
  let c_time;
  let to_time;
  let time_difference;
  let buffer_time;
  let datetime = new Date();
  // let current_date = datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate(); 
  let current_date = datetime.getFullYear() + '-' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '-' + ('0' + datetime.getDate()).slice(-2);
  let today_remaining_time = `${('0' + datetime.getHours()).slice(-2)}:${('0' + datetime.getMinutes()).slice(-2)}`;
  let first_slot_start_time = today_remaining_time;
  let min_charging_duration;


  let stmt = `select csm.o_time as station_open_time ,csm.c_time as station_close_time ,bc.buffer_time,bc.booking_validity_time, bc.min_charging_duration, bc.max_charging_duration, bc.booking_cancellation_time, 
  bc.adv_booking_amount, bc.adv_booking_time, bc.status as booking_config_status , 
  bl.id as booking_id ,bl.booking_number,  bl.start_time ,bl.end_time,bl.end_time_with_buffer ,cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) as booking_date_with_end_buffer_time
  from  charging_station_mst csm left join booking_config bc on csm.id=bc.station_id and bc.status='Y'
  left join booking_log bl on csm.id = bl.station_id and bl.status in ('P','A') and bl.booking_date = '${params.date}' and charger_id = ${params.charger_id} and connector_no=${params.connector_no} -- and cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) > now()
  where csm.id=${params.station_id} and csm.status ='Y' 
  order by start_time ; `;


  //06 01 2021 : commented as it was not seems appropriate

  // let stmt = `select csm.o_time as station_open_time ,csm.c_time as station_close_time ,bc.buffer_time,bc.booking_validity_time, bc.min_charging_duration, bc.max_charging_duration, bc.booking_cancellation_time, 
  // bc.adv_booking_amount, bc.adv_booking_time, bc.status as booking_config_status , 
  // bl.id as booking_id ,bl.booking_number,  bl.start_time ,bl.end_time,bl.end_time_with_buffer 
  // from  charging_station_mst csm left join booking_config bc on csm.id=bc.station_id and bc.status='Y'
  // left join booking_log bl on csm.id = bl.station_id and bl.status in ('P','A') and bl.booking_date = '${params.date}' and charger_id = ${params.charger_id} and connector_no=${params.connector_no} and cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) > now()
  // where csm.id=${params.station_id} and csm.status ='Y' 
  // order by start_time ; `;
  //

  try {

    resp = await pool.query(stmt);


    if (resp.length > 0) {
      o_time = resp[0].station_open_time;
      c_time = resp[0].station_close_time;


      if (!resp[0].buffer_time) {
        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: 'Booking configuration not found for this station',
          count: 0,
          data: []
        }
      } else {
        buffer_time = resp[0].buffer_time;
        min_charging_duration = resp[0].min_charging_duration;

        //set start time for slots : if current date then it would start from current time otherwise it would take open time od station
        if (current_date != params.date) {
          first_slot_start_time = o_time;
        } else {
          if (first_slot_start_time < o_time) {
            first_slot_start_time = o_time;
          }
        }

        if (!!resp[0].booking_id) {

          for (let i = 0; i < resp.length; i++) {
            const e = resp[i];
            const e1 = !!resp[i+1] ? resp[i+1] : 0;

            if(e1==0){
              //this is last row
              
              if (e.start_time==o_time ) {
                if(first_slot_start_time<=e.end_time){
                  interval = {
                    from_time: e.end_time_with_buffer,
                    to_time: c_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                }else if(first_slot_start_time>e.end_time){
                  interval = {
                    from_time: first_slot_start_time,
                    to_time: c_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                }
                
              } else {
                
                if(first_slot_start_time<=e.start_time){
                  interval = {
                    from_time: first_slot_start_time,
                    to_time: e.start_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                }else if(first_slot_start_time<=e.end_time){
                  interval = {
                    from_time: e.end_time_with_buffer,
                    to_time: c_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                }else if(first_slot_start_time>e.end_time){
                  interval = {
                    from_time: first_slot_start_time,
                    to_time: c_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                }
              }

            }else{
              if(i==0){
                //1st row
              }else if(i==resp.length-1){
                //last row
              }else{
                //any row between 1st and last row
              }
            }

            // if(i==0){
            //   //1st item
            //   if(e1==0){
            //     //there is only 1 row

            //   }else{

            //   }

            // }else if(i==resp.length-1){
            //   //last row
            //   if(e1==0){
            //     //there is only 1 row

            //   }else{

            //   }
            // }

            
          }


        } else {

          interval = {
            from_time: today_remaining_time,
            to_time: c_time,
            station_open_time: o_time,
            station_close_time: c_time
          }
        }

      }


      //================================================================================
      if (!resp[0].buffer_time) {//done
        final_res = {//done
          status: false,
          err_code: `ERROR : 1`,
          message: 'Booking configuration not found for this station',
          count: 0,
          data: []
        }
      } else {

        buffer_time = resp[0].buffer_time;//done
        min_charging_duration = resp[0].min_charging_duration;//done

        if (!!resp[0].booking_id) {
          for (let i = 0; i < resp.length; i++) {
            const e = resp[i];

            if (i == 0) {

              if (today_remaining_time < o_time) {

                to_time = !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time);
                time_difference = _utility.getTimeDifference(current_date, to_time, o_time);

                if (min_charging_duration < time_difference) {
                  interval = {
                    from_time: o_time,
                    to_time: to_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }

                  available_intervals.push(interval);
                }

              } else if (today_remaining_time < e.start_time.substring(0, 5)) {

                to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
                time_difference = _utility.getTimeDifference(current_date, to_time, today_remaining_time);

                if (min_charging_duration < time_difference) {
                  interval = {
                    from_time: today_remaining_time,
                    to_time: to_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }

                  available_intervals.push(interval);
                }


                if (i == resp.length - 1) {
                  if (c_time != e.end_time_with_buffer.substring(0, 5)) {

                    to_time = e.end_time_with_buffer;
                    time_difference = _utility.getTimeDifference(current_date, to_time, e.end_time_with_buffer);

                    if (min_charging_duration < time_difference) {
                      interval = {
                        from_time: e.end_time_with_buffer.substring(0, 5),
                        to_time: to_time,
                        station_open_time: o_time,
                        station_close_time: c_time
                      }
                      available_intervals.push(interval);
                    }
                  }
                }

              } else if (today_remaining_time < e.end_time_with_buffer.substring(0, 5)) {
                if (c_time != e.end_time_with_buffer.substring(0, 5)) {

                  to_time = !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time);
                  time_difference = _utility.getTimeDifference(current_date, to_time, e.end_time_with_buffer);

                  if (min_charging_duration < time_difference) {
                    interval = {
                      from_time: e.end_time_with_buffer.substring(0, 5),
                      to_time: to_time,
                      station_open_time: o_time,
                      station_close_time: c_time
                    }

                    available_intervals.push(interval);
                  }
                }

              }
              // else{
              //   interval = {
              //     from_time: today_remaining_time,
              //     to_time:  _utility.minusMinutesToStringTime(c_time, buffer_time),
              //     station_open_time: o_time,
              //     station_close_time: c_time
              //   }

              //   available_intervals.push(interval);
              // }

              // }

            } else if (i == resp.length - 1) {

              if (today_remaining_time >= e.end_time_with_buffer.substring(0, 5)) {

                to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
                time_difference = _utility.getTimeDifference(current_date, to_time, today_remaining_time);

                if (min_charging_duration < time_difference) {
                  interval = {
                    from_time: today_remaining_time,
                    to_time: to_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }

                  available_intervals.push(interval);
                }
              }


              if (c_time != e.end_time_with_buffer.substring(0, 5)) {

                to_time = _utility.minusMinutesToStringTime(c_time, buffer_time);
                time_difference = _utility.getTimeDifference(current_date, to_time, e.end_time_with_buffer);

                if (min_charging_duration < time_difference) {
                  interval = {
                    from_time: e.end_time_with_buffer.substring(0, 5),
                    to_time: to_time,
                    station_open_time: o_time,
                    station_close_time: c_time
                  }
                  available_intervals.push(interval);
                }
              }

            } else {

              to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
              time_difference = _utility.getTimeDifference(current_date, to_time, resp[i - 1].end_time_with_buffer);

              if (min_charging_duration < time_difference) {
                interval = {
                  from_time: resp[i - 1].end_time_with_buffer.substring(0, 5),
                  to_time: to_time,
                  station_open_time: o_time,
                  station_close_time: c_time
                }
                available_intervals.push(interval);
              }

            }
          }
        } else {


          if (current_date == params.date) {
            if (today_remaining_time > o_time) {
              interval = {
                from_time: today_remaining_time,
                to_time: c_time,
                station_open_time: o_time,
                station_close_time: c_time
              }
            } else {
              interval = {
                from_time: o_time,
                to_time: c_time,
                station_open_time: o_time,
                station_close_time: c_time
              }
            }
          } else {
            interval = {
              from_time: o_time,
              to_time: c_time,
              station_open_time: o_time,
              station_close_time: c_time
            }
          }
          available_intervals.push(interval);
        }


        final_res = {
          status: true,
          err_code: `ERROR : 0`,
          message: 'SUCCESS',
          count: available_intervals.length,
          data: {
            booking_config: resp,
            available_intervals: available_intervals
          }
        }

      }
    } else {
      //no station found
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'Station not found',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
};

//06 01 2021
// Booking.getAvailableTimeInterval = async (params, result) => {

//   let final_res;
//   let resp;
//   let available_intervals = [];
//   let interval;
//   let o_time;
//   let c_time;
//   let to_time;
//   let time_difference;
//   let buffer_time;
//   let datetime = new Date();
//   // let current_date = datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate(); 
//   let current_date =  datetime.getFullYear() +'-'+('0' + (datetime.getMonth()+1)).slice(-2)+'-'+('0' + datetime.getDate()).slice(-2); 
//   let today_remaining_time = `${('0' + datetime.getHours()).slice(-2) }:${('0' + datetime.getMinutes()).slice(-2)}` ;
//   let min_charging_duration ;


//   let stmt = `select csm.o_time as station_open_time ,csm.c_time as station_close_time ,bc.buffer_time,bc.booking_validity_time, bc.min_charging_duration, bc.max_charging_duration, bc.booking_cancellation_time, 
//   bc.adv_booking_amount, bc.adv_booking_time, bc.status as booking_config_status , 
//   bl.id as booking_id ,bl.booking_number,  bl.start_time ,bl.end_time,bl.end_time_with_buffer ,cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) as booking_date_with_end_buffer_time
//   from  charging_station_mst csm left join booking_config bc on csm.id=bc.station_id and bc.status='Y'
//   left join booking_log bl on csm.id = bl.station_id and bl.status in ('P','A') and bl.booking_date = '${params.date}' and charger_id = ${params.charger_id} and connector_no=${params.connector_no} -- and cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) > now()
//   where csm.id=${params.station_id} and csm.status ='Y' 
//   order by start_time ; `;


//   //06 01 2021 : commented as it was not seems appropriate

//   // let stmt = `select csm.o_time as station_open_time ,csm.c_time as station_close_time ,bc.buffer_time,bc.booking_validity_time, bc.min_charging_duration, bc.max_charging_duration, bc.booking_cancellation_time, 
//   // bc.adv_booking_amount, bc.adv_booking_time, bc.status as booking_config_status , 
//   // bl.id as booking_id ,bl.booking_number,  bl.start_time ,bl.end_time,bl.end_time_with_buffer 
//   // from  charging_station_mst csm left join booking_config bc on csm.id=bc.station_id and bc.status='Y'
//   // left join booking_log bl on csm.id = bl.station_id and bl.status in ('P','A') and bl.booking_date = '${params.date}' and charger_id = ${params.charger_id} and connector_no=${params.connector_no} and cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) > now()
//   // where csm.id=${params.station_id} and csm.status ='Y' 
//   // order by start_time ; `;
// //

//   try {

//     resp = await pool.query(stmt);


//     if (resp.length > 0) {
//       o_time = resp[0].station_open_time;
//       c_time = resp[0].station_close_time;

//       if (current_date!=params.date) {
//         today_remaining_time  = o_time;
//       }

//       if (!resp[0].buffer_time) {
//         final_res = {
//           status: false,
//           err_code: `ERROR : 1`,
//           message: 'Booking configuration not found for this station',
//           count: 0,
//           data: []
//         }
//       } else {

//         buffer_time = resp[0].buffer_time;
//         min_charging_duration = resp[0].min_charging_duration;

//         if (!!resp[0].booking_id) {
//           for (let i = 0; i < resp.length; i++) {
//             const e = resp[i];

//             if (i == 0) {

//                 if(today_remaining_time<o_time ){

//                   to_time = !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time);
//                   time_difference = _utility.getTimeDifference(current_date, to_time,o_time);

//                   if(min_charging_duration < time_difference){
//                     interval = {
//                       from_time: o_time,
//                       to_time: to_time,
//                       station_open_time: o_time,
//                       station_close_time: c_time
//                     }

//                     available_intervals.push(interval);
//                   }

//                 } else if(today_remaining_time<e.start_time.substring(0, 5)){

//                   to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
//                   time_difference = _utility.getTimeDifference(current_date, to_time,today_remaining_time);

//                   if(min_charging_duration < time_difference){
//                     interval = {
//                       from_time: today_remaining_time,
//                       to_time:to_time,
//                       station_open_time: o_time,
//                       station_close_time: c_time
//                     }

//                     available_intervals.push(interval);
//                   }


//                   if(i==resp.length-1){
//                     if (c_time != e.end_time_with_buffer.substring(0, 5)) {

//                       to_time = e.end_time_with_buffer;
//                       time_difference = _utility.getTimeDifference(current_date, to_time,e.end_time_with_buffer);

//                       if(min_charging_duration < time_difference ){
//                         interval = {
//                           from_time: e.end_time_with_buffer.substring(0, 5),
//                           to_time: to_time,
//                           station_open_time: o_time,
//                           station_close_time: c_time
//                         }
//                         available_intervals.push(interval);
//                       }
//                     }
//                   }

//                 }else if(today_remaining_time < e.end_time_with_buffer.substring(0, 5)){
//                   if (c_time != e.end_time_with_buffer.substring(0, 5)) {

//                     to_time = !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time);
//                     time_difference = _utility.getTimeDifference(current_date, to_time,e.end_time_with_buffer);

//                     if(min_charging_duration < time_difference){
//                       interval = {
//                         from_time: e.end_time_with_buffer.substring(0, 5),
//                         to_time: to_time,
//                         station_open_time: o_time,
//                         station_close_time: c_time
//                       }

//                       available_intervals.push(interval);
//                     }
//                   }

//                 }
//                 // else{
//                 //   interval = {
//                 //     from_time: today_remaining_time,
//                 //     to_time:  _utility.minusMinutesToStringTime(c_time, buffer_time),
//                 //     station_open_time: o_time,
//                 //     station_close_time: c_time
//                 //   }

//                 //   available_intervals.push(interval);
//                 // }

//               // }

//             } else if (i == resp.length - 1) {

//               if(today_remaining_time >= e.end_time_with_buffer.substring(0, 5)){

//                 to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
//                 time_difference = _utility.getTimeDifference(current_date, to_time,today_remaining_time);

//                 if(min_charging_duration < time_difference){
//                   interval = {
//                     from_time: today_remaining_time,
//                     to_time: to_time,
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }

//                   available_intervals.push(interval);
//                 }
//               }


//               if (c_time != e.end_time_with_buffer.substring(0, 5)) {

//                 to_time = _utility.minusMinutesToStringTime(c_time, buffer_time);
//                 time_difference = _utility.getTimeDifference(current_date, to_time,e.end_time_with_buffer);

//                 if(min_charging_duration < time_difference){
//                   interval = {
//                     from_time: e.end_time_with_buffer.substring(0, 5),
//                     to_time: to_time,
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }
//                   available_intervals.push(interval);
//                 }
//               }

//             } else {

//               to_time = _utility.minusMinutesToStringTime(e.start_time, buffer_time);
//               time_difference = _utility.getTimeDifference(current_date, to_time, resp[i - 1].end_time_with_buffer);

//               if(min_charging_duration < time_difference){
//                 interval = {
//                   from_time: resp[i - 1].end_time_with_buffer.substring(0, 5) ,
//                   to_time: to_time,
//                   station_open_time: o_time,
//                   station_close_time: c_time
//                 }
//                 available_intervals.push(interval);
//               }

//             }
//           }
//         } else {


//           if (current_date==params.date) {
//             if(today_remaining_time>o_time){
//               interval = {
//                 from_time: today_remaining_time,
//                 to_time: c_time,
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }
//             }else{
//               interval = {
//                 from_time: o_time,
//                 to_time: c_time,
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }
//             }
//           } else {
//             interval = {
//               from_time: o_time,
//               to_time: c_time,
//               station_open_time: o_time,
//               station_close_time: c_time
//             }
//           }
//           available_intervals.push(interval);
//         }


//         final_res = {
//           status: true,
//           err_code: `ERROR : 0`,
//           message: 'SUCCESS',
//           count: available_intervals.length,
//           data:  {
//             booking_config : resp,
//             available_intervals : available_intervals
//           }
//         }

//       }
//     } else {
//       //no station found
//       final_res = {
//         status: false,
//         err_code: `ERROR : 1`,
//         message: 'Station not found',
//         count: 0,
//         data: []
//       }
//     }




//   } catch (err) {


//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// };
// Booking.getAvailableTimeInterval = async (params, result) => {

//   let final_res;
//   let resp;
//   let available_intervals = [];
//   let interval;
//   let o_time;
//   let c_time;
//   let buffer_time;
//   let datetime = new Date();
//   let current_date = datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate(); 
//   let today_remaining_time = `${datetime.getHours()}:${datetime.getMinutes()}` ;

//   let stmt = `select csm.o_time as station_open_time ,csm.c_time as station_close_time ,bc.buffer_time,bc.booking_validity_time, bc.min_charging_duration, bc.max_charging_duration, bc.booking_cancellation_time, 
//   bc.adv_booking_amount, bc.adv_booking_time, bc.status as booking_config_status , 
//   bl.id as booking_id ,bl.booking_number,  bl.start_time ,bl.end_time,bl.end_time_with_buffer 
//   from  charging_station_mst csm left join booking_config bc on csm.id=bc.station_id and bc.status='Y'
//   left join booking_log bl on csm.id = bl.station_id and bl.status in ('Y','A') and bl.booking_date = '${params.date}' and charger_id = ${params.charger_id} and connector_no=${params.connector_no} and cast(concat(booking_date, ' ', end_time_with_buffer) as datetime) > now()
//   where csm.id=${params.station_id} and csm.status ='Y' 
//   order by start_time ; `;


//   try {

//     resp = await pool.query(stmt);
//     

//     if (resp.length > 0) {
//       o_time = resp[0].station_open_time;
//       c_time = resp[0].station_close_time;

//       

//       if (!resp[0].buffer_time) {
//         final_res = {
//           status: false,
//           err_code: `ERROR : 1`,
//           message: 'Booking configuration not found for this station',
//           count: 0,
//           data: []
//         }
//       } else {

//         buffer_time = resp[0].buffer_time;

//         if (!!resp[0].booking_id) {
//           for (let i = 0; i < resp.length; i++) {
//             const e = resp[i];

//             if (i == 0) {
//               //done
//               if (o_time == e.start_time.substring(0, 5)) {
//                 interval = {
//                   from_time: e.end_time_with_buffer,
//                   to_time: !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time),
//                   station_open_time: o_time,
//                   station_close_time: c_time
//                 }

//                 available_intervals.push(interval);

//               } else {

//                 if(today_remaining_time<o_time){
//                   interval = {
//                     from_time: o_time,
//                     to_time: !!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time),
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }

//                   available_intervals.push(interval);

//                 } else if(today_remaining_time<e.start_time){
//                   interval = {
//                     from_time: today_remaining_time,
//                     to_time:_utility.minusMinutesToStringTime(e.start_time, buffer_time),
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }

//                   available_intervals.push(interval);

//                   if(i==resp.length-1){
//                     //if (c_time != e.end_time.substring(0, 5)) {
//                       interval = {
//                         from_time: e.end_time_with_buffer,
//                         to_time: _utility.minusMinutesToStringTime(c_time, buffer_time),
//                         station_open_time: o_time,
//                         station_close_time: c_time
//                       }
//                       available_intervals.push(interval);
//                     //}
//                   }

//                 }else if(today_remaining_time<e.end_time_with_buffer){
//                   interval = {
//                     from_time: e.end_time_with_buffer,
//                     to_time:!!resp[i + 1] ? _utility.minusMinutesToStringTime(resp[i + 1].start_time, buffer_time) : _utility.minusMinutesToStringTime(c_time, buffer_time),
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }

//                   available_intervals.push(interval);
//                 }else{
//                   interval = {
//                     from_time: today_remaining_time,
//                     to_time:  _utility.minusMinutesToStringTime(c_time, buffer_time),
//                     station_open_time: o_time,
//                     station_close_time: c_time
//                   }

//                   available_intervals.push(interval);
//                 }

//               }

//             } else if (i == resp.length - 1) {

//               interval = {
//                 from_time: resp[i - 1].end_time_with_buffer,
//                 to_time: _utility.minusMinutesToStringTime(e.start_time, buffer_time),
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }

//               available_intervals.push(interval);

//               if (c_time != e.end_time.substring(0, 5)) {
//                 interval = {
//                   from_time: e.end_time_with_buffer,
//                   to_time: _utility.minusMinutesToStringTime(c_time, buffer_time),
//                   station_open_time: o_time,
//                   station_close_time: c_time
//                 }
//                 available_intervals.push(interval);
//               }

//             } else {

//               interval = {
//                 from_time: resp[i - 1].end_time_with_buffer,
//                 to_time: _utility.minusMinutesToStringTime(e.start_time, buffer_time),
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }
//               available_intervals.push(interval);
//             }
//           }
//         } else {
//           
//           // let datetime = new Date();
//           // let current_date = datetime.getFullYear()+'-'+(datetime.getMonth()+1)+'-'+datetime.getDate(); 
//           // let today_remaining_time = `${datetime.getHours()}:${datetime.getMinutes()}` ;
//           if (current_date==params.date) {
//             if(today_remaining_time>o_time){
//               interval = {
//                 from_time: today_remaining_time,
//                 to_time: c_time,
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }
//             }else{
//               interval = {
//                 from_time: o_time,
//                 to_time: c_time,
//                 station_open_time: o_time,
//                 station_close_time: c_time
//               }
//             }
//           } else {
//             interval = {
//               from_time: o_time,
//               to_time: c_time,
//               station_open_time: o_time,
//               station_close_time: c_time
//             }
//           }
//           available_intervals.push(interval);
//         }


//         final_res = {
//           status: true,
//           err_code: `ERROR : 0`,
//           message: 'SUCCESS',
//           count: available_intervals.length,
//           data:  {
//             booking_config : resp,
//             available_intervals : available_intervals
//           }
//         }

//       }
//     } else {
//       //no station found
//       final_res = {
//         status: false,
//         err_code: `ERROR : 1`,
//         message: 'Station not found',
//         count: 0,
//         data: []
//       }
//     }




//   } catch (err) {
//     

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
// };

Booking.getBookingHistory = async (params, result) => {

  let final_res;
  let resp;
  let status = params.status;
  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  // let user_id = !!params.user_id  ? params.user_id  : 0;

  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      result(response);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      result(response);
      return;
    }
  }

  // let whereClause = "";
  let whereClause = status == 'ALL' ? "" : ` where bl.status = '${status}' `;

  if (!!params.user_id) {
    if (whereClause == "") {
      whereClause = ` where bl.user_id = ${params.user_id} `;
    } else {
      whereClause = `${whereClause} and bl.user_id = ${params.user_id} `;
    }
  }

  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
    }
  }

  let stmt = ` select  bl.id as booking_id,bl.booking_number, bl.user_id, umn.username  , bl.mobile , bl.vehicle_id , bl.registration_no , bl.station_id , csm.name as station_name , bl.charger_id , 
  chsm.name as charger_display_id, bl.connector_no, bl.connector_type_id , ctm.name as connector_type_name , bl.booking_date , bl.start_time , bl.end_time , bl.end_time_with_buffer ,
  bl.duration , bl.adv_booking_amt , bl.booking_valid_upto , bl.is_tnc_read , 
  bl.status as booking_status , 
    case when bl.status = 'P' then 'Pending'
    when bl.status = 'A' then 'Accepted'
    when bl.status = 'R' then 'Rejected'
    when bl.status = 'C' then 'Cancelled'
    when bl.status = 'F' then 'Finished'
    when bl.status = 'PP' then  'Payment_Pending'
    when bl.status = 'D' then 'Deleted'
    when bl.status = 'N' then 'Inactive' END as booking_status_description,
  bl.created_date , bl.created_by , bl.modified_date, bl.modified_by  , bc.buffer_time 
  from booking_log bl inner join user_mst_new umn on bl.user_id = umn.id and umn.status='Y'
  inner join charging_station_mst csm on bl.station_id=csm.id and csm.status = 'Y'
  inner join charger_serial_mst chsm on bl.charger_id = chsm.id and chsm.status='Y'
  inner join connector_type_mst ctm on bl.connector_type_id = ctm.id and ctm.status = 'Y'
  inner join booking_config bc on bl.station_id = bc.station_id and bc.status='Y'
  ${whereClause}
  order by bl.id desc; `;
//
  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
};

Booking.getBookingById = async (id, result) => {

  let final_res;
  let resp;

  let stmt = ` select  bl.id as booking_id,bl.booking_number, bl.user_id, umn.username  , bl.mobile , bl.vehicle_id , bl.registration_no , bl.station_id , csm.name as station_name , bl.charger_id , 
  chsm.name as charger_display_id, bl.connector_no, bl.connector_type_id , ctm.name as connector_type_name , bl.booking_date , bl.start_time , bl.end_time , bl.end_time_with_buffer ,
  bl.duration , bl.adv_booking_amt , bl.booking_valid_upto , bl.is_tnc_read , 
  bl.status as booking_status , 
  case when bl.status = 'P' then 'Pending'
    when bl.status = 'A' then 'Accepted'
    when bl.status = 'R' then 'Rejected'
    when bl.status = 'C' then 'Cancelled'
    when bl.status = 'F' then 'Finished'
    when bl.status = 'PP' then  'Payment_Pending'
    when bl.status = 'D' then 'Deleted'
    when bl.status = 'N' then 'Inactive' END as booking_status_description,
  bl.created_date , bl.created_by , bl.modified_date, bl.modified_by  , bc.buffer_time 
  from booking_log bl inner join user_mst_new umn on bl.user_id = umn.id and umn.status='Y'
  inner join charging_station_mst csm on bl.station_id=csm.id and csm.status = 'Y'
  inner join charger_serial_mst chsm on bl.charger_id = chsm.id and chsm.status='Y'
  inner join connector_type_mst ctm on bl.connector_type_id = ctm.id and ctm.status = 'Y'
  inner join booking_config bc on bl.station_id = bc.station_id and bc.status='Y'
  where bl.id = ${id} ; `;

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
};


Booking.UpdateBookingStatus = (params, result) => {
  let bookings = _utility.getArraytoString(params.booking_id);
  let final_res;
  //let stmt = `Update vehicle_mst set status = 'D', modify_date= ? ,modify_by=? WHERE id = ?`;

  let stmt = `UPDATE booking_log SET status = ?, modified_by = ?, modified_date = now() WHERE ID IN(?)`;
  //;
  sql.query(stmt, [params.action, params.modified_by, bookings], (err, res) => {
    //
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      final_res = {
        status: true,
        err_code: `ERROR : 1`,
        message: 'NO DATA FOUND',
        count: res.affectedRows,
        data: []
      }
    }
    else {
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: res.affectedRows,
        data: []
      }
    }
    result(null, final_res);
  });
};

Booking.GetPendingBooking = async (params, result) => {

  let final_res;
  let resp;
  let status = params.status;


  // let whereClause = "";
  let whereClause = ` where bl.status = 'P' `;
  whereClause = `${whereClause} and bl.station_id = ${params.station_id} `;
  // whereClause = `${whereClause} and DATE(bl.booking_date) >= date(now()) `;


  let stmt = ` select  bl.id as booking_id,bl.booking_number, bl.user_id, umn.username  , bl.mobile , bl.vehicle_id , bl.registration_no , bl.station_id , csm.name as station_name , bl.charger_id , 
  chsm.name as charger_display_id, bl.connector_no, bl.connector_type_id , ctm.name as connector_type_name , bl.booking_date , bl.start_time , bl.end_time , bl.end_time_with_buffer ,
  bl.duration , bl.adv_booking_amt , bl.booking_valid_upto , bl.is_tnc_read , 
  bl.status as booking_status , 
  case when bl.status = 'P' then 'Pending'
    when bl.status = 'A' then 'Accepted'
    when bl.status = 'R' then 'Rejected'
    when bl.status = 'C' then 'Cancelled'
    when bl.status = 'F' then 'Finished'
    when bl.status = 'PP' then 'Payment_Pending'
    when bl.status = 'D' then 'Deleted'
    when bl.status = 'N' then 'Inactive' END as booking_status_description,
  bl.created_date , bl.created_by , bl.modified_date, bl.modified_by 
  from booking_log bl inner join user_mst_new umn on bl.user_id = umn.id and umn.status='Y'
  inner join charging_station_mst csm on bl.station_id=csm.id and csm.status = 'Y'
  inner join charger_serial_mst chsm on bl.charger_id = chsm.id and chsm.status='Y'
  inner join connector_type_mst ctm on bl.connector_type_id = ctm.id and ctm.status = 'Y'
  ${whereClause}
  order by bl.id desc; `;

  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
};


Booking.allBookingsCW = async (params, result) => {

  let final_res;
  let resp;
  let status = params.status;
  let from_date = params.f_date == null ? "" : params.f_date.trim();
  let to_date = params.t_date == null ? "" : params.t_date.trim();
  // let user_id = !!params.user_id  ? params.user_id  : 0;

  if (from_date !== "") {
    if (!_utility.validateDate(from_date)) {
      result(response);
      return;
    }
  }
  if (to_date !== "") {
    if (!_utility.validateDate(to_date)) {
      result(response);
      return;
    }
  }

  // let whereClause = "";
  let whereClause = status == 'ALL' ? "" : ` where bl.status = '${status}' `;

  if (!!params.user_id) {
    if (whereClause == "") {
      whereClause = ` where bl.station_id = ${params.station_id} `;
    } else {
      whereClause = `${whereClause} and bl.station_id = ${params.station_id} `;
    }
  }

  if (from_date !== "" && to_date !== "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) BETWEEN '${from_date}' AND '${to_date}' `;
    }
  } else if (from_date != "") {
    if (whereClause == "") {
      whereClause = ` where DATE(bl.booking_date) = '${from_date}'  `;
    } else {
      whereClause = `${whereClause} and DATE(bl.booking_date) = '${from_date}'  `;
    }
  }

  let stmt = ` select  bl.id as booking_id,bl.booking_number, bl.user_id, umn.username  , bl.mobile ,
   bl.vehicle_id , bl.registration_no , bl.station_id , csm.name as station_name , bl.charger_id , 
  chsm.name as charger_display_id, bl.connector_no, bl.connector_type_id , 
  ctm.name as connector_type_name , bl.booking_date , bl.start_time , bl.end_time , 
  bl.end_time_with_buffer , bl.duration , bl.adv_booking_amt , bl.booking_valid_upto , bl.is_tnc_read , 
  bl.status as booking_status , 
    case when bl.status = 'P' then 'Pending'
    when bl.status = 'A' then 'Accepted'
    when bl.status = 'R' then 'Rejected'
    when bl.status = 'C' then 'Cancelled'
    when bl.status = 'F' then 'Finished'
    when bl.status = 'PP' then  'Payment_Pending'
    when bl.status = 'D' then 'Deleted'
    when bl.status = 'N' then 'Inactive' END as booking_status_description,
  bl.created_date , bl.created_by , bl.modified_date, bl.modified_by , bc.buffer_time
  from booking_log bl inner join user_mst_new umn on bl.user_id = umn.id and umn.status='Y'
  inner join charging_station_mst csm on bl.station_id=csm.id and csm.status = 'Y'
  inner join charger_serial_mst chsm on bl.charger_id = chsm.id and chsm.status='Y'
  inner join connector_type_mst ctm on bl.connector_type_id = ctm.id and ctm.status = 'Y'
  inner join booking_config bc on bl.station_id = bc.station_id and bc.status='Y'
  ${whereClause}
  order by bl.id desc; `;
//
  try {

    resp = await pool.query(stmt);

    if (resp.length > 0) {
      final_res = {
        status: true,
        err_code: `ERROR : 0`,
        message: 'SUCCESS',
        count: resp.length,
        data: resp
      }
    } else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: 'DATA_NOT_FOUND',
        count: 0,
        data: []
      }
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
    result(null, final_res);
  }
//   let final_res;
//   let resp;
//   let status = params.status;

//   let whereClause = `  `;
//   whereClause = ` where  bl.station_id = ${params.station_id} `;
//   whereClause = `${whereClause} and DATE(bl.booking_date) >= date(now()) `;

//   let stmt = ` select  bl.id as booking_id,bl.booking_number, bl.user_id, umn.username  , bl.mobile ,
//    bl.vehicle_id , bl.registration_no , bl.station_id , csm.name as station_name , bl.charger_id , 
//   chsm.name as charger_display_id, bl.connector_no, bl.connector_type_id , ctm.name as connector_type_name , 
//   bl.booking_date , bl.start_time , bl.end_time , bl.end_time_with_buffer ,bl.duration , bl.adv_booking_amt , 
//   bl.booking_valid_upto , bl.is_tnc_read ,  bl.status as booking_status , 
//   case when bl.status = 'P' then 'Pending'
//     when bl.status = 'A' then 'Accepted'
//     when bl.status = 'R' then 'Rejected'
//     when bl.status = 'C' then 'Cancelled'
//     when bl.status = 'F' then 'Finished'
//     when bl.status = 'PP' then  'Payment_Pending'
//     when bl.status = 'D' then 'Deleted'
//     when bl.status = 'N' then 'Inactive' END as booking_status_description,
//   bl.created_date , bl.created_by , bl.modified_date, bl.modified_by 
//   from booking_log bl inner join user_mst_new umn on bl.user_id = umn.id and umn.status='Y'
//   inner join charging_station_mst csm on bl.station_id=csm.id and csm.status = 'Y'
//   inner join charger_serial_mst chsm on bl.charger_id = chsm.id and chsm.status='Y'
//   inner join connector_type_mst ctm on bl.connector_type_id = ctm.id and ctm.status = 'Y'
//   ${whereClause}
//   order by bl.id desc; `;
// //;
//   try {

//     resp = await pool.query(stmt);

//     if (resp.length > 0) {
//       final_res = {
//         status: true,
//         err_code: `ERROR : 0`,
//         message: 'SUCCESS',
//         count: resp.length,
//         data: resp
//       }
//     } else {
//       final_res = {
//         status: false,
//         err_code: `ERROR : 1`,
//         message: 'DATA_NOT_FOUND',
//         count: 0,
//         data: []
//       }
//     }
//   } catch (err) {

//     final_res = {
//       status: false,
//       err_code: `ERROR : ${err.code}`,
//       message: `ERROR : ${err.message}`,
//       count: 0,
//       data: []
//     }
//   } finally {
//     result(null, final_res);
//   }
};


BookingConfig.getAllBookingConfigList = async(result) => {
  let resp;
  let final_res;
  let stmt =`select bc.id,csm.name as station_name,bc.station_id,cm.id as cpo_id,cm.name as cpo_name,
  clm.id as client_id, clm.name as client_name,bc.buffer_time,bc.booking_validity_time,bc.min_charging_duration,
   bc.max_charging_duration,bc.booking_cancellation_time,bc.adv_booking_time,bc.adv_booking_amount ,
   csm.address1,csm.address2,bc.status from booking_config bc
   inner join charging_station_mst csm on bc.station_id=csm.id 
   inner join cpo_mst cm on csm.cpo_id=cm.id and csm.status="Y"
   inner join client_mst clm on cm.client_id=clm.id and cm.status="Y"
   where bc.status<>"D";`;
  try {
    resp = await pool.query(stmt);
    final_res = {
      status: resp.length > 0 ? true : false,
      err_code:resp.length > 0 ?'ERROR : 0':'ERROR : 1',
      message: resp.length > 0 ? 'SUCCESS' : 'FAILED',
      data: resp
    }
  }catch (err) {
      final_res = {
        status: false,
        err_code: `ERROR : ${err.code}`,
        message: `ERROR : ${err.message}`,
        data: []
      }
    } finally {
      result(null, final_res);
    }
  }
BookingConfig.createBookingConfig = async(data,result) => {
  
  var datetime = new Date();
  let resp;
  let final_res;
  let station_not_mapped = [];
  let station_mapped = [];
  let values = [];
  let stmt1 =`select id from booking_config where station_id = ? and status <>'D';`;

  let stmt =`insert into booking_config (station_id,buffer_time,booking_validity_time,
    min_charging_duration,max_charging_duration,booking_cancellation_time,adv_booking_time,
    adv_booking_amount,status,created_date,created_by) values ? ;`;

  try {
   
    for (let index = 0; index < data.stations.length; index++) {
      resp3 = await pool.query(stmt1, [data.stations[index]])

      if (resp3.length > 0) {
        station_not_mapped.push({
          station: data.stations[index],
          remarks: 'DUPLICATE'
        })

      } else {
        values.push([data.stations[index],data.buffer_time,data.booking_validity_time,data.min_charging_duration,
            data.max_charging_duration,data.booking_cancellation_time,data.adv_booking_time,
            data.adv_booking_amount,data.status,datetime,data.created_by]);

        station_mapped.push({
          station: data.stations[index],
          remarks: 'SUCCESS'
        });
      }

    }
    if (values.length > 0) {

      resp = await pool.query(stmt, [values]);


    } else {
    }
    final_res = {
      status: values.length > 0 ? true : false,
      err_code :values.length > 0 ? 'ERROR : 0':'ERROR : 1',
      message: values.length > 0 ? 'SUCCESS' : 'ALL_DUPLICATE',
      data: [{
        
        station_not_mapped: station_not_mapped,
        statioin_mapped: station_mapped
      }]
    }
  }

  catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

BookingConfig.updateBookingConfig = async(data,result) => {

  var datetime = new Date();
  let resp;
  let final_res;
  let stmt =`update booking_config set station_id=?,buffer_time=?,booking_validity_time=?,
    min_charging_duration=?,max_charging_duration=?,booking_cancellation_time=?,adv_booking_time=?,
    adv_booking_amount=?,status=?,modified_date=?,modified_by=? where  id=?`;
    try {

      for(let index=0;index < data.stations.length;index++){

     resp = await pool.query(stmt,[data.stations[index].station_id,data.buffer_time,data.booking_validity_time,data.min_charging_duration,
    data.max_charging_duration,data.booking_cancellation_time,data.adv_booking_time,
    data.adv_booking_amount,data.status,datetime,data.modify_by,data.stations[index].id]);
     }
    
    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code:resp.affectedRows >0 ?'ERROR:0':'ERROR :1',
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count : resp.affectedRows,
      data: [data.stations]
    }
  } catch (err) {
    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }

};

BookingConfig.deleteBookingConfig = async (id, modify_by, result) => {
  var datetime = new Date();
  let stmt = `Update booking_config set status = 'D',
    modified_by = ${modify_by}, modified_date = ?
  WHERE id = ?`;

  let final_res;
  let res;
  try {

    res = await pool.query(stmt, [datetime, id]);
    final_res = {
      status: res.affectedRows > 0 ? true : false,
      message: res.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      data: []
    }
  } catch (err) {

    final_res = {
      status: false,
      err_code: `ERROR : ${err.code}`,
      message: `ERROR : ${err.message}`,
      data: []
    }
  } finally {
    result(null, final_res);
  }
};

module.exports = { Booking,BookingConfig };
