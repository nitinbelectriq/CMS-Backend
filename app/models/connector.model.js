const {sql,pool} = require("./db.js");

const ConnectorTypeVehicleModel = function(connectorTypeVehicleModel) {
    this.id = connectorTypeVehicleModel.id ,
    this.brand_id = connectorTypeVehicleModel.ct_id ,
    this.vehicle_type_id = connectorTypeVehicleModel.vm_id,
    this.status = connectorTypeVehicleModel.status ,
    this.created_date = connectorTypeVehicleModel.created_date ,
    this.created_by = connectorTypeVehicleModel.created_by,
    this.modify_date = connectorTypeVehicleModel.modify_date ,
    this.modify_by = connectorTypeVehicleModel.modify_by
};

  
  ConnectorTypeVehicleModel.getAllConnectorTypesByVehicleModelId = (brandId, result) => {

      sql.query(`SELECT ct_id,ctm.name 
        FROM c_type_v_model_mapping ctvmm inner join connector_type_mst ctm on ctvmm.ct_id = ctm.id
        WHERE vm_id  = ${brandId} and ctvmm.status = 'P'`, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        if (res.length) {
          result(null, res);
          return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
      });
  };
  ConnectorTypeVehicleModel.getAllConnectorTypesByVehicleModelIdPublished = (vModel_id, result) => {

    let stmt = `SELECT ct_id,ctm.name 
    FROM c_type_v_model_mapping ctvmm inner join connector_type_mst ctm on ctvmm.ct_id = ctm.id
    WHERE vm_id  = ${vModel_id} and ctvmm.status = 'P'`;

      sql.query(stmt, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        if (res.length) {
          result(null, res);
          return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
      });
  };

  ConnectorTypeVehicleModel.getAllConnectorTypesExcludingVModelId = (modelId, result) => {
  const stmt = `
    SELECT ctm.id, ctm.name, ctm.description
    FROM connector_type_mst ctm
    WHERE ctm.status = 'Y'
      AND ctm.id NOT IN (
        SELECT ct_id FROM c_type_v_model_mapping
        WHERE vm_id = ? AND status <> 'D'
      )
    ORDER BY ctm.name
  `;

  sql.query(stmt, [modelId], (err, res) => {
    if (err) {
      return result(err, null);
    }

    if (res.length > 0) {
      return result(null, res);
    }

    return result({ kind: "not_found" }, null);
  });
};


  ConnectorTypeVehicleModel.getAllCTypesExcludingOtherAlreadyMapped = (params, result) => {
    let stmt =   `select ctm.id,ctm.name,ctm.description 
    from connector_type_mst ctm   
    where ctm.status = 'Y' 
    and ctm.id not in (select ct_id from c_type_v_model_mapping where vm_id = ${params.vehicleModelId} and ct_id <> ${params.ct_id} and status <> 'D')
    order by ctm.name `;
    
    sql.query(stmt, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }

        if (res.length) {
          result(null, res);
          return;
        }

        // not found Customer with the id
        result({ kind: "not_found" }, null);
      });
  };

  ConnectorTypeVehicleModel.getAllConnectorTypes = async () => {
  const stmt = `
    SELECT ctm.id, ctm.name, ctm.description, ctm.current_type_id,
           cutm.name AS current_type_name
    FROM connector_type_mst ctm
    INNER JOIN current_type_mst cutm ON ctm.current_type_id = cutm.id
    WHERE ctm.status = 'Y'
    ORDER BY ctm.name
  `;

  const rows = await pool.query(stmt);
  if (!rows.length) {
    const error = new Error("Not found");
    error.kind = "not_found";
    throw error;
  }
  return rows;
};
  

// module.exports = Vehicle;
module.exports = ConnectorTypeVehicleModel;