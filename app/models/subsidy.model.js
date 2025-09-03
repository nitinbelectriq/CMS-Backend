const { sql, pool } = require("./db.js");

    const Subsidy = function (subsidy) {
      this.id = subsidy.id,
      this.state_id = subsidy.state_id,
      this.per_KWh_of_battery = subsidy.per_KWh_of_battery,
      this.capacity = subsidy.capacity,
      this.max_subsidy = subsidy.max_subsidy,
      this.road_tax_exemption = subsidy.road_tax_exemption,     
      this.vehicle_type_id=subsidy.vehicle_type_id,   
      this.status = subsidy.status,
      this.created_date = subsidy.created_date,
      this.createdby = subsidy.createdby,
      this.modify_date = subsidy.modify_date,
      this.modifyby = subsidy.modifyby
      };
      Subsidy.create = async (newSubsidy, result) => {
        var datetime = new Date();
        
        let stmt = `INSERT INTO statewise_subsidy (state_id,per_KWh_of_battery, capacity,max_subsidy,road_tax_exemption,vehicle_type_id,status,createdby,created_date)
                   Values (${newSubsidy.state_id},${newSubsidy.per_KWh_of_battery},${newSubsidy.capacity},${newSubsidy.max_subsidy},
                 ${newSubsidy.road_tax_exemption},${newSubsidy.vehicle_type_id},'${newSubsidy.status}',${newSubsidy.createdby},?) `;
      
        let final_res = {};
        let resp;
      
        try {
          
          resp = await pool.query(stmt,[datetime]);
          final_res = {
            status: true,
            err_code: `ERROR : 0`,
            message: 'Subsidy added successfully',
            data: { id: resp.insertId}
          }
      
        } catch (e) {
          final_res = {
            status: false,
            err_code: `ERROR : ${err.code}`,
            message: `ERROR : ${e.message} `,
            data: []
          }
        } finally {
          result(null, final_res);
        }
      };
      Subsidy.getAllSubsidy = async result => {
        let final_res;
        let resp;
    
        let stmt =`SELECT ss.id,ss.state_id,sm.name as state_name,ss.per_KWh_of_battery,ss.capacity,ss.max_subsidy,ss.road_tax_exemption,ss.vehicle_type_id,vtm.name as vehicle_type,
                 ss.status,ss.created_date,ss.createdby
                 FROM statewise_subsidy ss 
                 inner join state_mst sm on ss.state_id=sm.id and sm.status='Y'
                 inner join vehicle_type_mst vtm on ss.vehicle_type_id=vtm.id and vtm.status='Y' 
                 where ss.status = 'Y';`;
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
      // Subsidy.getSubsidyByVehicleTypeId = async (id, result) => {
      //      //;
      //   let stmt =`SELECT ss.id,ss.state_id,sm.name as state_name,ss.per_KWh_of_battery,ss.capacity,ss.max_subsidy,ss.road_tax_exemption,ss.vehicle_type_id,vtm.name as vehicle_type,
      //            ss.status,ss.created_date,ss.createdby
      //            FROM statewise_subsidy ss 
      //            inner join state_mst sm on ss.state_id=sm.id and sm.status='Y'
      //            inner join vehicle_type_mst vtm on ss.vehicle_type_id=vtm.id and vtm.status='Y' 
      //            where ss.vehicle_type_id=${id}and ss.status = 'Y';`;
      //            let res;
      //            let final_res;
               
      //            try {
      //              //;
      //              res = await pool.query(stmt, [id]);
               
      //              final_res = {
      //                status:  res.length > 0 ? true : false,
      //                message: res.length > 0 ? 'DATA_FOUND' : 'DATA_NOT_FOUND',
      //                count: res.length,
      //                data: res
      //              }
               
      //            } catch (e) {
      //              //;
      //              final_res = {
      //                status: false,
      //                message: `ERROR : ${e.code} `,
      //                count: 0,
      //                data: []
      //              }
      //            } finally {
      //              result (final_res);
      //            }
     
      // };
      Subsidy.getSubsidyByVehicleType = async (vehicle_type, result) => {
        // let whereClause = ``;
        // if (id > 0) {
        //   whereClause = ` where ucl.user_id =${id}  `
        // }
        let final_res;
         let res;
         let whereClause = '';
  if (vehicle_type == "Electric Truck") {
    whereClause = `where vtm.name in('Electric Truck','Truck L','Truck H','Truck M','IPLT Electric Truck')`;
  }
  if (vehicle_type == "Two Wheeler") {
    whereClause = `where vtm.name in('Two Wheeler')`;
  }
  if (vehicle_type == "Three Wheeler") {
    whereClause = `where vtm.name in('Three Wheeler')`;
  }
  if (vehicle_type == "Four Wheeler") {
    whereClause = `where vtm.name in('LMV','SUV')`;
  }
  if (vehicle_type == "Electric Bus") {
    whereClause = `where vtm.name in('Electric Bus','Bus l','Bus M','Bus L','Bus H')`;
  }
  if (vehicle_type == "Electric Cycle") {
    whereClause = `where vtm.name in('Electric Cycle') `;
  }
  if (whereClause!='') { 
  let stmt = `SELECT ss.id,ss.state_id,sm.name as state_name,ss.per_KWh_of_battery,ss.capacity,ss.max_subsidy,ss.road_tax_exemption,ss.vehicle_type_id,vtm.name as vehicle_type,
  ss.status,ss.created_date,ss.createdby
  FROM statewise_subsidy ss 
  inner join state_mst sm on ss.state_id=sm.id and sm.status='Y'
  inner join vehicle_type_mst vtm on ss.vehicle_type_id=vtm.id and vtm.status='Y' 
  ${whereClause} and ss.status = 'Y'`;
        
        try {

          resp = await pool.query(stmt);
      
          final_res = {
            status: resp.length > 0 ? true : false,
            err_code: `ERROR : 0`,
            message: resp.length > 0 ? 'SUCCESS' : 'DATA NOT FOUND',
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
      }else{

        final_res = {
          status: false,
          err_code: `ERROR : 1`,
          message: `ERROR : Keyword is incorrect`,
          count: 0,
          data: []
        }
    
        result(null, final_res);
      }
      
      };
      Subsidy.updateSubsidy = async (newSubsidy, result) => {
       //;
        var datetime = new Date();
        let final_res;
        let resp;
    
        let stmt = ` update statewise_subsidy set state_id = ${newSubsidy.state_id}, per_KWh_of_battery =${newSubsidy.per_KWh_of_battery},
        capacity =${newSubsidy.capacity},max_subsidy =${newSubsidy.max_subsidy},road_tax_exemption =${newSubsidy.road_tax_exemption},
        vehicle_type_id =${newSubsidy.vehicle_type_id},              
        status = '${newSubsidy.status}',
        modifyby = ${newSubsidy.modifyby},modify_date = ? 
        where id =  ${newSubsidy.id}`;
      
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
      Subsidy.publishSubsidy = async (newSubsidy, result) => {
     
        var datetime = new Date();
        let final_res;
        let resp;
    
        let stmt = ` update statewise_subsidy set status = '${newSubsidy.status}',         
           modifyby = ${newSubsidy.modifyby},modify_date = ? 
           where id =  ${newSubsidy.id}`;
      
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
      Subsidy.deleteSubsidy= async (id,modifyby, result) => {
        var datetime = new Date();
       let final_res;
        let resp;
        let stmt = `Update statewise_subsidy 
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

      Subsidy.moderateSubsidy = async (data, result) => {
     
        var datetime = new Date();
        let final_res;
        let resp;
    
        let stmt = ` update statewise_subsidy set status = ?,         
           modifyby = ?,modify_date = ? 
           where id = ? `;
      
          try {
            
            resp = await pool.query(stmt,[data.status,data.modifyby,datetime,data.id]);
        
            final_res = {
              status: resp.affectedRows > 0 ? true : false,
              err_code: resp.affectedRows > 0 ? `ERROR : 0`:'ERROR:1',
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
      Subsidy.getAllModerateSubsidyList = async result => {
        let final_res;
        let resp;
    
        let stmt =`SELECT ss.id,ss.state_id,sm.name as state_name,ss.per_KWh_of_battery,
        ss.capacity,ss.max_subsidy,ss.road_tax_exemption,ss.vehicle_type_id,
        vtm.name as vehicle_type,ss.status,ss.created_date,ss.createdby FROM statewise_subsidy ss 
        left join state_mst sm on ss.state_id=sm.id and sm.status='Y'
        left join vehicle_type_mst vtm on ss.vehicle_type_id=vtm.id and vtm.status='Y' where ss.status = 'M';`;
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
        Subsidy: Subsidy    
     };