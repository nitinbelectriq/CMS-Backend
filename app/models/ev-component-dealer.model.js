const { sql, pool } = require("./db.js");
const EvComponent = function (component) {
    this.id = component.id,
    this.company_name = component.company_name,
      this.ev_components = component.ev_components,
      this.website = component.website,
      this.email = component.email,
      this.cp_name = component.cp_name,
      this.mobile = component.mobile,
      this.address1 = component.address1,
      this.address2 = component.address2,
      this.PIN = component.PIN,
      this.landmark = component.landmark,
      this.city_id = component.city_id,
      this.state_id = component.state_id,
      this.country_id = component.country_id,
      this.remarks = component.remarks,
      this.status = component.status,
      this.created_date = component.created_date,
      this.createdby = component.createdby,
      this.modify_date = component.modify_date,
      this.modifyby = component.modifyby
  };
  EvComponent.create = async (newComponent, result) => {
    var datetime = new Date();
    debugger;
    let stmt = `INSERT INTO ev_component_dealer_mst (company_name,ev_components, website,email,cp_name,mobile,address1,address2,PIN,landmark,city_id,state_id,country_id,remarks,status,createdby,created_date)
    Values ('${newComponent.company_name}','${newComponent.ev_components}','${newComponent.website}',
    '${newComponent.email}','${newComponent.cp_name}',${newComponent.mobile},'${newComponent.address1}',
    '${newComponent.address2}',${newComponent.PIN},'${newComponent.landmark}',${newComponent.city_id},
    ${newComponent.state_id},${newComponent.country_id},'${newComponent.remarks}','${newComponent.status}',
    ${newComponent.createdby},?) `;
  
    let final_res = {};
    let resp;
  
    try {
      
      resp = await pool.query(stmt,[datetime]);
      final_res = {
        status: true,
        message: 'EV Component dealer added successfully',
        data: { id: resp.insertId}
      }
  
    } catch (e) {
      final_res = {
        status: false,
        message: `ERROR : ${e.message} `,
        data: []
      }
    } finally {
      result(null, final_res);
    }
  };
  EvComponent.getAllEvComponentDealer = async result => {
    let final_res;
    let resp;

    let stmt =`SELECT ecdm.id,ecdm.company_name,ecdm.ev_components,ecdm.website,ecdm.email,ecdm.cp_name,ecdm.mobile,ecdm.address1,ecdm.address2,ecdm.PIN,ecdm.landmark,ecdm.city_id,cm.name as city_name,
    ecdm.state_id,sm.name as state_name,ecdm.country_id,ccm.name as country_name,ecdm.remarks,ecdm.status,ecdm.created_date,ecdm.createdby,ecdm.modify_date,ecdm.modifyby
   FROM ev_component_dealer_mst ecdm 
   inner join state_mst sm on ecdm.state_id=sm.id and sm.status='Y'
   left join city_mst cm on ecdm.city_id=cm.id and cm.status='Y'
   inner join country_mst ccm on ecdm.country_id=ccm.id and ccm.status='Y' 
   where ecdm.status = 'Y';`;
    try {
      resp = await pool.query(stmt);
  
      final_res = {
        status: resp.length > 0 ? true : false,
        message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
      result(null, final_res);
    }
 
  };
  EvComponent.getEVComponentsManufacturersList = async result => {
    let final_res;
    let resp;

    let stmt =`SELECT ecdm.id,ecdm.company_name,ecdm.ev_components,ecdm.website,ecdm.email,ecdm.cp_name,ecdm.mobile,ecdm.address1,ecdm.address2,ecdm.PIN,ecdm.landmark,ecdm.city_id,cm.name as city_name,
    ecdm.state_id,sm.name as state_name,ecdm.country_id,ccm.name as country_name,ecdm.remarks,ecdm.status,ecdm.created_date,ecdm.createdby,ecdm.modify_date,ecdm.modifyby
   FROM ev_component_dealer_mst ecdm 
   left join state_mst sm on ecdm.state_id=sm.id and sm.status='Y'
   left join country_mst ccm on ecdm.country_id=ccm.id and ccm.status='Y' 
   left join city_mst cm on ecdm.city_id=cm.id and cm.status='Y'
   where ecdm.status = 'Y';`;
    try {
      resp = await pool.query(stmt);
  
      final_res = {
        status: resp.length > 0 ? true : false,
        message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
      result(null, final_res);
    }
 
  };
  EvComponent.updateEvComponentDealer = async (newComponent, result) => {
    var datetime = new Date();
    let final_res;
    let resp;
   debugger;
    let stmt = `update ev_component_dealer_mst set company_name = '${newComponent.company_name}', ev_components ='${newComponent.ev_components}',
          website ='${newComponent.website}',email ='${newComponent.email}',cp_name ='${newComponent.cp_name}',
          mobile ='${newComponent.mobile}',address1 ='${newComponent.address1}',address2 ='${newComponent.address2}',
          PIN =${newComponent.PIN},landmark ='${newComponent.landmark}',city_id =${newComponent.city_id},
          state_id =${newComponent.state_id},country_id =${newComponent.country_id},remarks ='${newComponent.remarks}',
          status = '${newComponent.status}',
          modifyby = ${newComponent.modifyby},modify_date = ? 
          where id =  ${newComponent.id}`;
  
      try {
        
        resp = await pool.query(stmt,[datetime]);
    
        final_res = {
          status: resp.affectedRows > 0 ? true : false,
          err_code: `ERROR : 0`,
          message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
          count : resp.affectedRows,
          data: []
        }
      } catch (err) {
        
        final_res = {
          status: false,
          err_code: `ERROR : ${err.code}`,
          message: `ERROR : ${err.message}`,
          count : 0,
          data: []
        }
      } finally {
        result(null, final_res);
      }
 
 
  };
  EvComponent.publishEvComponentDealer = async (newComponent, result) => {
    var datetime = new Date();
    let final_res;
    let resp;
   debugger;
    let stmt = `update ev_component_dealer_mst set  status = '${newComponent.status}',
          modifyby = ${newComponent.modifyby},modify_date = ? 
          where id =  ${newComponent.id}`;
  
      try {
        
        resp = await pool.query(stmt,[datetime]);
    
        final_res = {
          status: resp.affectedRows > 0 ? true : false,
          err_code: `ERROR : 0`,
          message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
          count : resp.affectedRows,
          data: []
        }
      } catch (err) {
        
        final_res = {
          status: false,
          err_code: `ERROR : ${err.code}`,
          message: `ERROR : ${err.message}`,
          count : 0,
          data: []
        }
      } finally {
        result(null, final_res);
      }
 
 
  };
  EvComponent.deleteEvComponentDealer = async (id,modifyby, result) => {
    var datetime = new Date();
   let final_res;
    let resp;
    let stmt = `Update ev_component_dealer_mst 
    set status = 'D' , modify_date = ? , modifyby = ?
    WHERE id = ?`;
    
    
  try {

    resp = await pool.query(stmt, [datetime,modifyby, id]);

    final_res = {
      status: resp.affectedRows > 0 ? true : false,
      err_code: `ERROR : 0`,
      message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
      count : resp.affectedRows,
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
 
  EvComponent.moderateComponentDealer = async (data,result) => {
    debugger;
    var datetime = new Date();
    let final_res;
    let resp;
   debugger;
    let stmt = `update ev_component_dealer_mst set  status = ?,
          modifyby = ?,modify_date = ? 
          where id = ? `;
  
      try {
        
        resp = await pool.query(stmt,[data.status,data.modifyby,datetime,data.id]);
    
        final_res = {
          status: resp.affectedRows > 0 ? true : false,
          err_code: resp.affectedRows > 0 ? `ERROR : 0`:'ERROR : 1',
          message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
          count : resp.affectedRows,
          data: []
        }
      } catch (err) {
        
        final_res = {
          status: false,
          err_code: `ERROR : ${err.code}`,
          message: `ERROR : ${err.message}`,
          count : 0,
          data: []
        }
      } finally {
        result(null, final_res);
      }
  };

  EvComponent.getAllModerateComponentDealer = async result => {
    let final_res;
    let resp;

    let stmt =`SELECT ecdm.id,ecdm.company_name,ecdm.ev_components,ecdm.website,ecdm.email,ecdm.cp_name,ecdm.mobile,ecdm.address1,ecdm.address2,ecdm.PIN,ecdm.landmark,ecdm.city_id,cm.name as city_name,
    ecdm.state_id,sm.name as state_name,ecdm.country_id,ccm.name as country_name,ecdm.remarks,ecdm.status,ecdm.created_date,ecdm.createdby,ecdm.modify_date,ecdm.modifyby
   FROM ev_component_dealer_mst ecdm 
   left join state_mst sm on ecdm.state_id=sm.id and sm.status='Y'
   left join city_mst cm on ecdm.city_id=cm.id and cm.status='Y'
   left join country_mst ccm on ecdm.country_id=ccm.id and ccm.status='Y' 
   where ecdm.status = 'M';`;
    try {
      resp = await pool.query(stmt);
  
      final_res = {
        status: resp.length > 0 ? true : false,
        message: resp.length > 0 ? 'SUCCESS' : 'NOT FOUND',
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
      result(null, final_res);
    }
 
  };

  module.exports = {
    EvComponent: EvComponent    
  };