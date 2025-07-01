const {sql,pool} = require("./db.js");

const Brand = function(brand) {
    this.id = brand.id ,
    this.name = brand.name ,
    this.description = brand.description,
    this.status = brand.status ,
    this.created_date = brand.created_date ,
    this.created_by = brand.created_by,
    this.modify_date = brand.modify_date ,
    this.modify_by = brand.modify_by
};

Brand.getAll = (callback) => {
  const query = `
    SELECT id, name 
    FROM vehicle_brand_mst 
    WHERE status = 'Y' AND top_brands = 1 
    ORDER BY name
  `;

  sql.query(query, (err, results) => {
    if (err) {
      // pass error first in callback
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};


  //06042022 : new version
// Brand.getAll = async(result) => {
//     var datetime = new Date();
//     let resp;
//     let final_res;
//     let stmt = `SELECT id,name,description,status,created_date,created_by,modify_date,
//                 modify_by FROM vehicle_brand_mst where status = 'Y' order by name;`;
  
//     try {
//       resp = await pool.query(stmt);
//       final_res =
//       {
//         status: resp.length > 0 ? true : false,
//         err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
//         message: resp.length > 0 ? 'DATA FOUND' : 'DATA NOT FOUND',
//         data: resp
//       }
//     }
//     catch (err) {
  
//       final_res = {
//         status: false,
//         err_code: `ERROR : ${err.code}`,
//         message: `ERROR : ${err.message}`,
//         data: []
//       }
//     } finally {
//       result(null, final_res);
//     }
//   };

  Brand.create = async (data, result) => {
    var datetime = new Date();
    
    let stmt = `insert into vehicle_brand_mst(name,description,status,created_date,created_by)
    Values(?,?,?,?,?)`;
    let final_res = {};
    let resp;
    let Values = [data.name,data.description,data.status,datetime,data.created_by];
  
    try {
  
      resp = await pool.query(stmt, Values);
      final_res = {
        status: resp.insertId > 0 ? true : false,
        err_code: resp.insertId > 0 ? 'ERROR:0' : 'ERROR:1',
        message: resp.insertId > 0 ? 'SUCCESS' : 'FAILED',
        data: [resp.insertId]
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
  
  Brand.update = async (data,result) => {
    var datetime = new Date();
    let final_res;
    let resp;
   
    let stmt = `update vehicle_brand_mst set name=?,description=?,status=?,modify_date=?,
    modify_by=? where id=?;`;
  
    let Values = [data.name,data.description,data.status,datetime,data.modify_by,data.id];
  
    try {
  
      resp = await pool.query(stmt, Values);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: resp.affectedRows > 0 ? `ERROR : 0`:'ERROR:1',
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.affectedRows,
        data: [data.id]
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
  Brand.publish = async (data,result) => {
    var datetime = new Date();
    let final_res;
    let resp;
  
    let stmt = `update vehicle_brand_mst set  status = 'Y',
      modify_by = ?,modify_date = ? 
      where id =  ?`;
  
    try {
  
      resp = await pool.query(stmt, [data.modify_by,datetime,data.id]);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.affectedRows,
        data: []
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
  
  Brand.delete = async (id, modify_by, result) => {
    var datetime = new Date();
    let stmt = `Update vehicle_brand_mst
        set status = 'D' , modify_date = ? , modify_by = ?
        WHERE id = ?`;
    try {
  
      resp = await pool.query(stmt, [datetime, modify_by, id]);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: `ERROR : 0`,
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.affectedRows,
        data: []
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
  
  Brand.moderate= async (data, result) => {
    debugger;
    var datetime = new Date();
    let stmt = `Update vehicle_brand_mst 
        set status = ? , modify_date = ? , modify_by = ?
        WHERE id = ?`;
    try {
  
      resp = await pool.query(stmt, [data.status,datetime, data.modify_by, data.id]);
  
      final_res = {
        status: resp.affectedRows > 0 ? true : false,
        err_code: resp.affectedRows > 0 ? `ERROR : 0` : 'ERROR:1',
        message: resp.affectedRows > 0 ? 'SUCCESS' : 'FAILED',
        count: resp.affectedRows,
        data: []
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

  Brand.getAllModerateList = async(result) => {
    var datetime = new Date();
    let resp;
    let final_res;
    let stmt = `SELECT id,name,description,status,created_date,created_by,modify_date,
                modify_by FROM vehicle_brand_mst where status = 'M' order by name;`;
  
    try {
      resp = await pool.query(stmt);
      final_res =
      {
        status: resp.length > 0 ? true : false,
        err_code: resp.length > 0 ? 'ERROR:0' : 'ERROR:1',
        message: resp.length > 0 ? 'DATA FOUND' : 'DATA NOT FOUND',
        data: resp
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

  

module.exports = Brand;