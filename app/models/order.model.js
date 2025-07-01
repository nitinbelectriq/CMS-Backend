const { sql, pool } = require("./db.js");


const OrderSummary = function (order) {
    this.os_id = order.os_id,
    this.transaction_id = order.transaction_id,
    this.connector_name = order.connector_name,
    this.connector_type = order.connector_type,
    this.charger_name = order.charger_name,
    this.cpo_name = order.cpo_name
    this.statio_name = order.station_name,
    this.station_id = order.station_id,
    this.charger_display_id = order.charger_id,
    this.user_id = order.user_id,
    this.user_mobile = order.user_mobile,
    this.energy_consumped = order.energy_consumped,
    this.price_per_unit = order.price_per_unit,
    this.bill_amount = order.bill_amount,
    this.tax_cgst = order.tax_cgst,
    this.tax_sgst = order.tax_sgst,
    this.total_amount = order.total_amount,
    this.penalty_amount = order.penalty_amount,
    this.reward_amount = order.reward_amount,
    this.actual_amount_paid = order.actual_amount_paid,
    this.payment_status = order.payment_status,
    this.payment_mode = order.payment_mode,
    this.payable_amount = order.payable_amount,
    this.invoice_path = order.invoice_path,
    this.os_status = order.os_status,
    this.payment_mode = order.payment_mode,
    

    this.meter_start_value = order.meter_start_value,
    this.meter_stop_value = order.meter_stop_value,
    this.meter_start_time = order.meter_start_time,
    this.meter_stop_time = order.meter_stop_time,
    this.duration = order.duration,
    this.vehicle_number = order.vehicle_number,
    this.mobile = order.mobile,
    this.username = order.username,
    this.email = order.email,

 
  
    this.created_by = order.created_by
    this.created_date = order.created_date
    this.modified_date = order.modified_date
    this.modified_by = order.modified_by
  };

const VwOrderSummary = function (order) {
    this.os_id = order.os_id,
    this.transaction_id = order.transaction_id,
    this.order_id = order.order_id,
    this.connector_name = order.connector_name,
    this.connector_type = order.connector_type,
    this.charger_name = order.charger_name,
    this.cpo_name = order.cpo_name
    this.statio_name = order.station_name,
    this.station_id = order.station_id,
    this.charger_display_id = order.charger_display_id,
    this.user_id = order.user_id,
    this.user_mobile = order.user_mobile,
    this.energy_consumped = order.energy_consumped,
    this.price_per_unit = order.price_per_unit,
    this.bill_amount = order.bill_amount,
    this.tax_cgst = order.tax_cgst,
    this.tax_sgst = order.tax_sgst,
    this.total_amount = order.total_amount,
    this.actual_amount_paid = order.actual_amount_paid,
    this.payment_status = order.payment_status,
    this.payment_mode = order.payment_mode,
    this.payable_amount = order.payable_amount,
    this.invoice_path = order.invoice_path,
    this.os_status = order.os_status,
    this.meter_start_value = order.meter_start_value,
    this.meter_stop_value = order.meter_stop_value,
    this.meter_start_time = order.meter_start_time,
    this.meter_stop_time = order.meter_stop_time,
    this.duration = order.duration,
    this.vehicle_number = order.vehicle_number,
    this.mobile = order.mobile,
    this.username = order.username,
    this.email = order.email
  };


  
  OrderSummary.ProcessOrder = async (id, result) => {

 
    //let qry = 'call proc_processorder('+ id+',@OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode,@OP_ErrorDetail';
    let qry = "SET @OP_ErrorCode = 0; call proc_processorder("+id+", @OP_ErrorCode,@OP_ErrorDetail);select @OP_ErrorCode as OP_ErrorCode,  @OP_ErrorDetail as OP_ErrorDetail "

    let resp;
  let final_result;
  try {
    resp = await pool.query(qry);
      if (resp.length > 3) {
     
        final_result = {
          status: true,
          message: 'DATA_FOUND',
          count: 1,
          data: resp[1][0]
        }
      } else {
      
        final_result = {
          status: false,
          message: resp[2][0].OP_ErrorDetail,
         
        };
      }
    } catch (e) {
      //;
      console.log(e.stack);
      final_result = {
        status: false,
        message: `ERROR : ${e.code}`,
      };
    } finally {
      result(final_result) ;
  }
};




VwOrderSummary.getPendingOrderStationW = async (id, result) => {
  let whereClause = ``;
  if (id > 0) {
    whereClause = ` where os.station_id = ${id}  `
  }

  let stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,prl.order_id,
  ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
  ucl.vehicle_id ,ucl.vehicle_number ,
  ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
  ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
  ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
  ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
  ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
  ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
  ucl.app_version_stop ,ucl.os_version_stop ,
  ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby ,
  os.energy_consumped,os.charger_transaction_id,os.user_id,os.price_per_unit,os.bill_amount,os.tax_cgst,os.tax_sgst,os.payable_amount 
  from user_charging_log ucl 
  left join order_summary os on ucl.charger_transaction_id = os.charger_transaction_id and os.station_id=${id} 
  left join payment_request_log prl   on os.charger_transaction_id = prl.charger_transaction_id and prl.prl_status= 'PCPO'
  left join user_mst_new um on ucl.user_id = um.id
  left join user_mst_new um2 on ucl.user_id_stop = um2.id
  left join charging_station_mst csm on ucl.station_id = csm.id
  ${whereClause}  and prl_status= 'PCPO'`;


  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt, [id]);

    final_res = {
      status:  res.length > 0 ? true : false,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      message: `ERROR : ${e.code} `,
      count: 0,
      data: []
    }
  } finally {
    result (final_res);
  }
};



VwOrderSummary.getUserOrderSummary = async (id, result) => {
  let whereClause = ``;
  if (id > 0) {
    whereClause = ` where ucl.user_id =${id}  `
  }

  let stmt = `select ucl.id ,ucl.user_id as user_id_start, CONCAT(um.f_Name, " ", um.l_Name) as user_name_start ,prl.order_id,
  ucl.user_id_stop as user_id_stop ,CONCAT(um2.f_Name, " ", um2.l_Name) as user_name_stop,
  ucl.vehicle_id ,ucl.vehicle_number ,
  ucl.mobile ,ucl.mobile_stop ,ucl.charger_display_id ,ucl.connector_no ,ucl.id_tag ,
  ucl.station_id , csm.name as station_name,ucl.charger_transaction_id ,ucl.charging_status ,ucl.action ,
  ucl.message_id ,ucl.message_code ,ucl.meter_reading ,ucl.energy_consumed ,
  ucl.initial_soc ,ucl.final_soc ,ucl.duration ,ucl.auth_status ,ucl.meter_start_value ,
  ucl.meter_start_time ,ucl.meter_stop_value ,ucl.meter_stop_time ,ucl.command_source ,
  ucl.device_id ,ucl.app_version ,ucl.os_version ,ucl.command_source_stop ,ucl.device_id_stop ,
  ucl.app_version_stop ,ucl.os_version_stop ,
  ucl.status ,ucl.created_date ,ucl.createdby ,ucl.modify_date ,ucl.modifyby ,
  os.energy_consumped,os.charger_transaction_id,os.user_id,os.price_per_unit,os.bill_amount,os.tax_cgst,os.tax_sgst,os.payable_amount,CASE os.payment_status  WHEN 'S' THEN 'Success' WHEN 'R' THEN 'Refund' WHEN 'C' THEN 'Cancelled' ELSE 'Pending' END AS 'payment_status',
  CASE prl.payment_option WHEN 1 THEN 'Online' ELSE 'Offline' End AS 'payment_option' 
  from user_charging_log ucl 
  left join order_summary os on ucl.charger_transaction_id = os.charger_transaction_id and ucl.user_id=${id} 
  left join payment_request_log prl   on os.charger_transaction_id = prl.charger_transaction_id
  left join user_mst_new um on ucl.user_id = um.id
  left join user_mst_new um2 on ucl.user_id_stop = um2.id
  left join charging_station_mst csm on ucl.station_id = csm.id
  ${whereClause}  `;


  let res;
  let final_res;

  try {
    //;
    res = await pool.query(stmt, [id]);

    final_res = {
      status:  res.length > 0 ? true : false,
      message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      count: res.length,
      data: res
    }

  } catch (e) {
    //;
    final_res = {
      status: false,
      message: `ERROR : ${e.code} `,
    }
  } finally {
    result (final_res);
  }
};




module.exports = {
    OrderSummary: OrderSummary,
    VwOrderSummary: VwOrderSummary
  };
