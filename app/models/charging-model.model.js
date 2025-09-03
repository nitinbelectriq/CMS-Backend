const {sql,pool} = require("./db.js");

// constructor
const ChargingModel = function (chargingModel) {

  this.id = chargingModel.id,
    this.client_id = chargingModel.client_id,
    this.charger_type_id = chargingModel.charger_type_id,
    this.manufacturer_id = chargingModel.manufacturer_id,
    this.charger_model_type_id = chargingModel.charger_model_type_id,
    this.battery_backup = chargingModel.battery_backup,
    this.code = chargingModel.code,
    this.name = chargingModel.name,
    this.description = chargingModel.description,
    this.communication_protocol_id = chargingModel.communication_protocol_id,
    this.communication_mode = chargingModel.communication_mode,
    this.card_reader_type = chargingModel.card_reader_type,
    this.no_of_connectors = chargingModel.no_of_connectors,
    this.connector_data = chargingModel.connector_data,
    this.isDual=chargingModel.isDual,
    this.status = chargingModel.status,
    this.created_date = chargingModel.created_date,
    this.created_by = chargingModel.created_by,
    this.modify_date = chargingModel.modify_date,
    this.modify_by = chargingModel.modify_by
};

const ChargingModelConnector = function (chargingModelConnector) {
  this.id = chargingModelConnector.id,
    this.model_id = chargingModelConnector.model_id,
    this.connector_type_id = chargingModelConnector.connector_type_id,
    this.io_type_id = chargingModelConnector.io_type_id,
    this.current_type_id = chargingModelConnector.current_type_id,
    this.voltage = chargingModelConnector.voltage,
    this.phase = chargingModelConnector.phase,
    this.max_amp = chargingModelConnector.max_amp,
    this.power = chargingModelConnector.power,
    this.frequency = chargingModelConnector.frequency,
    this.status = chargingModelConnector.status,
    this.created_date = chargingModelConnector.created_date,
    this.created_by = chargingModelConnector.created_by,
    this.modify_date = chargingModelConnector.modify_date,
    this.modify_by = chargingModelConnector.modify_by
};

ChargingModel.create = async (model, result) => {
  const currentDate = new Date().toISOString().slice(0, 10);
//;
  const insertQuery = `
    INSERT INTO charging_model_mst (
      charger_type_id,
      manufacturer_id,
      charger_model_type_id,
      battery_backup,
      is_dual_gun,
      code,
      name,
      description,
      communication_protocol_id,
      communication_mode,
      card_reader_type,
      no_of_connectors,
      status,
      created_date,
      createdby
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    model.charger_type_id,
    model.manufacturer_id,
    model.charger_model_type_id,
    model.battery_backup,
    model.isDual,
    model.code,
    model.name,
    model.description,
    model.communication_protocol_id,
    model.communication_mode,
    model.card_reader_type,
    model.no_of_connectors,
    model.status,
    currentDate,
    model.created_by
  ];

  try {
    sql.query(insertQuery, values, async (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      const insertedId = res.insertId;

      try {
        await insertModelConnector(model.connector_data, insertedId, model.created_by,model.status);
        result(null, { id: insertedId, ...model });
      } catch (connErr) {
        result({ message: "Charging model saved, but connector insert failed.", error: connErr }, null);
      }
    });
  } catch (error) {
    result(error, null);
  }
};


ChargingModel.update = async (model, result) => {
  try {
    const datetime = new Date().toISOString().slice(0, 10);

    const updateQuery = `
      UPDATE charging_model_mst SET
        charger_type_id = ?,
        manufacturer_id = ?,
        charger_model_type_id = ?,
        battery_backup = ?,
        is_dual_gun = ?,
        code = ?,
        name = ?,
        description = ?,
        communication_protocol_id = ?,
        communication_mode = ?,
        card_reader_type = ?,
        no_of_connectors = ?,
        status = ?,
        modifyby = ?,
        modify_date = ?
      WHERE id = ?
    `;

    const values = [
      model.charger_type_id,
      model.manufacturer_id,
      model.charger_model_type_id,
      model.battery_backup,
      model.isDual,
      model.code,
      model.name,
      model.description,
      model.communication_protocol_id,
      model.communication_mode,
      model.card_reader_type,
      model.no_of_connectors,
      model.status,
      model.modify_by,
      datetime,
      model.id
    ];

    // Execute the update query
    sql.query(updateQuery, values, async (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      try {
        await insertModelConnector(model.connector_data, model.id, model.created_by);
        result(null, { id: model.id, ...model });
      } catch (connErr) {
        result({ message: "Charging model updated, but connector update failed.", error: connErr }, null);
      }
    });
  } catch (error) {
    result(error, null);
  }
};


ChargingModel.getChargingModels = async () => {
  const stmt = `
    SELECT 
      cpom.id, cpom.charger_type_id, ctm.name AS charger_type_name,
      cpom.manufacturer_id, mm.name AS manufacturer_name,
      cpom.charger_model_type_id, cmtm.name AS charger_model_type_name,
      cpom.code, cpom.name, cpom.description,
      cpom.communication_protocol_id, cpm.name AS communication_protocol_name,
      cpom.battery_backup, cpom.communication_mode, cpom.card_reader_type,
      cpom.no_of_connectors, cpom.status, cpom.created_date, cpom.createdby,
      cpom.modifyby, cpom.modify_date
    FROM charging_model_mst cpom
    INNER JOIN charger_type_mst ctm ON cpom.charger_type_id = ctm.id
    INNER JOIN manufacturer_mst mm ON cpom.manufacturer_id = mm.id
    INNER JOIN communication_protocol_mst cpm ON cpom.communication_protocol_id = cpm.id
    INNER JOIN charger_model_type_mst cmtm ON cpom.charger_model_type_id = cmtm.id
    WHERE cpom.status = 'Y'
    ORDER BY cpom.id DESC
  `;

  return new Promise((resolve, reject) => {
    sql.query(stmt, async (err, chargingModels) => {
      if (err) return reject(err);

      if (!chargingModels.length) return reject({ kind: "not_found" });

      try {
        const children = await getChildren(); // assuming this returns { res: [...] }

        // Create a map from model_id to children array for quick lookup
        const childrenMap = children.res.reduce((map, child) => {
          if (!map[child.model_id]) map[child.model_id] = [];
          map[child.model_id].push(child);
          return map;
        }, {});

        // Attach connector_data directly to each charging model
        chargingModels.forEach(model => {
          model.connector_data = childrenMap[model.id] || [];
        });

        resolve(chargingModels);
      } catch (e) {
        reject(e);
      }
    });
  });
};


ChargingModel.getChargingModelsAll = async (result) => {
  //;
  let stmt = `select cpom.id, cpom.charger_type_id,ctm.name as charger_type_name, cpom.manufacturer_id ,
    mm.name as manufacturer_name,
    cpom.charger_model_type_id, cmtm.name as charger_model_type_name ,
    cpom.code, cpom.name ,cpom.description, 
    cpom.communication_protocol_id, cpm.name as communication_protocol_name, 
    cpom.battery_backup,
    cpom.communication_mode,cpom.card_reader_type, cpom.no_of_connectors,
    cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
    from charging_model_mst cpom inner join charger_type_mst ctm on cpom.charger_type_id = ctm.id
    inner join manufacturer_mst mm on cpom.manufacturer_id = mm.id
    inner join communication_protocol_mst cpm on cpom.communication_protocol_id = cpm.id
    inner join charger_model_type_mst cmtm on cpom.charger_model_type_id = cmtm.id
    where cpom.status <> 'D'
    order by cpom.id desc`;

  sql.query(stmt, async (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {

      

      let children = await getChildren();

      let final_res = res;
      
      for (let p = 0; p < res.length; p++) {
        const parent = res[p];
        final_res[p].connector_data = [];

        for (let c = 0; c < children.res.length; c++) {
          const child = children.res[c];

          if (parent.id == child.model_id) {
            final_res[p].connector_data.push(child);
          }
        }
      }

      result(null, final_res);
      return;
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};

ChargingModel.getChargingModelById = (id, result) => {
  let stmt = `   
  SELECT 
    cmcp.id AS mapping_id,
    cmcp.model_id,
    cpom.name AS charging_model_name,
    cpom.description AS charging_model_description,
    cpom.charger_type_id,
    ctm.name AS charger_type_name,
    cpom.manufacturer_id,
    cpom.charger_model_type_id,
    cpom.battery_backup,
    cpom.code,
    cpom.name AS charger_model_name,
    cpom.communication_protocol_id,
    cpom.communication_mode,
    cpom.card_reader_type,
    cpom.status,
    cpom.createdby,
    cpom.created_date,
    cpom.modifyby,
    cpom.modify_date,

    cmcp.connector_type_id,
    ctm2.name AS connector_type_name,
    
    cmcp.current_type_id,
    currm.name AS current_type_name,
    
    cmcp.io_type_id,
    iotm.name AS io_type_name,
    
    cmcp.voltage,
    cmcp.phase,
    cmcp.max_amp,
    cmcp.power,
    cmcp.frequency,
    cmcp.status AS connector_status,
    cmcp.created_date AS connector_created_date,
    cmcp.createdby AS connector_createdby,
    cmcp.modify_date AS connector_modify_date,
    cmcp.modifyby AS connector_modifyby,
    cmcp.connector_no

  FROM charging_model_connector_map cmcp

  LEFT JOIN charging_model_mst cpom
    ON cmcp.model_id = cpom.id

  LEFT JOIN charger_type_mst ctm
    ON cpom.charger_type_id = ctm.id

  LEFT JOIN connector_type_mst ctm2
    ON cmcp.connector_type_id = ctm2.id

  LEFT JOIN current_type_mst currm
    ON cmcp.current_type_id = currm.id

  LEFT JOIN io_type_mst iotm
    ON cmcp.io_type_id = iotm.id

  WHERE cmcp.model_id = ? `;

  sql.query(stmt, id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (!res || res.length === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    // Build single charger model object
    const firstRow = res[0];

    const chargerModel = {
      id: firstRow.model_id,
      client_id: null, // fill if applicable
      charger_type_id: firstRow.charger_type_id,
      manufacturer_id: firstRow.manufacturer_id,
      charger_model_type_id: firstRow.charger_model_type_id,
      battery_backup: firstRow.battery_backup,
      code: firstRow.code,
      name: firstRow.charger_model_name,
      description: firstRow.charging_model_description,
      communication_protocol_id: firstRow.communication_protocol_id,
      communication_mode: firstRow.communication_mode,
      card_reader_type: firstRow.card_reader_type,
      status: firstRow.status,
      createdby: firstRow.createdby,
      created_date: firstRow.created_date,
      modifyby: firstRow.modifyby,
      modify_date: firstRow.modify_date,
      connectors: res.map(row => ({
        connector_type_id: row.connector_type_id,
        io_type_id: row.io_type_id,
        current_type_id: row.current_type_id,
        voltage: row.voltage,
        phase: row.phase,
        max_amp: row.max_amp,
        power: row.power,
        frequency: row.frequency
      }))
    };

    result(null, chargerModel);
  });
};


ChargingModel.getChargingModelByClientId = (client_id, result) => {

  let stmt = `select cpom.id, client_id,cm.name as client_name, cpom.name,cpom.description,cpom.address,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from charging_model_mst cpom inner join client_mst cm on cpom.client_id = cm.id
      WHERE cpom.client_id = ? and cpom.status <> 'D'`;
  sql.query(stmt, client_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};
ChargingModel.getChargingModelByChargerTypeId = (charger_type_id, result) => {

  let stmt = `select cpom.id, charger_type_id,cm.name as charger_type_name, cpom.name,cpom.description,cpom.address,
      cpom.logoPath, cpom.mobile,cpom.email,cpom.cp_name,
      cpom.status,cpom.created_date,cpom.createdby,cpom.modifyby,cpom.modify_date
      from charging_model_mst cpom inner join charger_type_mst cm on cpom.charger_type_id = cm.id
      WHERE cpom.charger_type_id = ? and cpom.status <> 'D'`;
  sql.query(stmt, charger_type_id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

ChargingModel.delete = (id, result) => {
let final_res;
  let stmt = `Update charging_model_mst set status = 'D' WHERE id = ?`;
  sql.query(stmt, id, async (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    } else {
      await deleteChildren(id);
      result(null, res);
      return;
    }
  });
};


const insertModelConnector = async (data, model_id, created_by, status = 'Y') => {
  const datetime = new Date().toISOString().slice(0, 10);

  // Prepare insert values
  const values = data.map((item, index) => [
    index + 1, // connector_no
    model_id,
    item.connector_type_id,
    item.io_type_id,
    item.current_type_id,
    item.voltage,
    item.phase,
    item.max_amp,
    item.power,
    item.frequency,
    item.status || status, // Prefer item.status, fallback to passed status
    created_by,
    datetime
  ]);

  const deactivateStmt = `
    UPDATE charging_model_connector_map
    SET status = 'D', modify_date = ?, modifyby = ?
    WHERE model_id = ?
  `;

  const insertStmt = `
    INSERT INTO charging_model_connector_map (
      connector_no, model_id, connector_type_id, io_type_id,
      current_type_id, voltage, phase, max_amp, power, frequency,
      status, createdby, created_date
    ) VALUES ?
  `;

  try {
    // Deactivate existing connectors
    await pool.query(deactivateStmt, [datetime, created_by, model_id]);

    // Insert new connectors
    const insertResult = await pool.query(insertStmt, [values]);

    return {
      status: true,
      message: "SUCCESS insert",
      inserted: insertResult.affectedRows || values.length
    };
  } catch (err) {
    return {
      status: false,
      message: "ERROR during insertModelConnector",
      error: err.message
    };
  }
};



const getChildren = async () => {
  

  let stmt = `select cmcm.id, cmcm.model_id, cmcm.connector_type_id , ctm.name as connector_type_name,
    cmcm.io_type_id, itm.name as io_type_name ,
    cmcm.current_type_id, cutm.name as current_type_name, cmcm.voltage ,cmcm.phase, 
    cmcm.max_amp,  cmcm.power,cmcm.frequency,
    cmcm.status,cmcm.created_date,cmcm.createdby,cmcm.modifyby,cmcm.modify_date
    from charging_model_connector_map cmcm inner join connector_type_mst ctm on cmcm.connector_type_id = ctm.id
    inner join io_type_mst itm on cmcm.io_type_id = itm.id
    inner join current_type_mst cutm on cmcm.current_type_id = cutm.id
    where cmcm.status <> 'D'
    order by cmcm.id desc`;


  let promise = new Promise((resolve, reject) => {
    sql.query(stmt, async (err, res) => {
      

      if (err) {
        reject({ message: "ERROR", error: err });
      }

      if (res.length) {
        resolve({ message: "SUCCESS", res: res });
      }


    });
  })

  return await promise;


}

const deleteChildren = async (model_id) => {
  let stmt = `update charging_model_connector_map set 
      status = 'D' where model_id = ? `

      let final_res;
      let resp;

      try {
        resp = await pool.query(stmt,[model_id]);

        final_res={
          status : true,
          message : 'DELETED',
          data : []
        }
      } catch (e) {
        final_res={
          status : false,
          message : `ERROR : ${e.code} `,
          data : []
        }
      }finally{
        return final_res;
      }

}

module.exports = {
  ChargingModel: ChargingModel,
  ChargingModelConnector: ChargingModelConnector
};