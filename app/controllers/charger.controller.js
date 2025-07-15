const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
// const myModule = require("../models/charger.model.js");
// const Charger = myModule.Charger;
const {Charger, ClientChargerMap} = require('../models/charger.model');
exports.create = (req, res) => {
  // Handle bulk CSV upload
  const file = req.file || (req.files && req.files.file?.[0]);
  if (file) {
    if (!file.originalname.endsWith('.csv')) {
      return res.status(400).send({ status: false, message: 'Only CSV files allowed for bulk upload.' });
    }

    const results = [];
    const errors = [];
    const filePath = file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        let insertedCount = 0;
        let processedCount = 0;

        if (results.length === 0) {
          return res.status(400).send({ status: false, message: "CSV file is empty" });
        }

        // Process each row sequentially with callback style
        function processRow(index) {
          if (index >= results.length) {
            // All rows processed
            return res.status(200).send({
              status: true,
              message: 'Bulk upload complete.',
              insertedCount,
              errors,
            });
          }

          const row = results[index];
          if (!row.serial_no || !row.charger_display_id) {
            errors.push({ row, reason: 'Missing serial_no or charger_display_id' });
            processRow(index + 1);
            return;
          }

          const chargerData = {
            serial_no: row.serial_no,
            charger_display_id: row.charger_display_id,
            model_id: req.body.model_id,
            current_version_id: req.body.current_version_id,
            is_available: req.body.is_available === '1' ? '1' : '0',
            status: req.body.status === 'Y' ? 'Y' : 'N',
            created_by: req.body.created_by
          };

          Charger.create(chargerData, (err, data) => {
            processedCount++;
            if (err) {
              errors.push({ row, reason: err.message });
            } else {
              insertedCount++;
            }
            processRow(index + 1);
          });
        }

        processRow(0);
      });

    return;
  }

  // Handle single creation
  const body = req.body;
  if (!body || !body.serial_no || !body.model_id) {
    return res.status(400).send({
      status: false,
      message: 'Required fields missing for single creation.',
    });
  }

  Charger.create(body, (err, data) => {
    if (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
    res.status(200).send({ status: true, message: 'Charger created successfully.', data });
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  const charger = new Charger({
    id: req.body.id ?? null,
    name: req.body.charger_display_id,
    serial_no: req.body.serial_no,
    batch_id: req.body.batch_id ?? null,
    model_id: req.body.model_id,
    station_id: req.body.station_id ?? null,
    current_version_id: req.body.current_version_id ?? null,
    no_of_guns: req.body.no_of_guns ?? 0,
    address1: req.body.address1 ?? '',
    address2: req.body.address2 ?? '',
    PIN: req.body.PIN ?? 0,
    landmark: req.body.landmark ?? '',
    city_id: req.body.city_id ?? 0,
    state_id: req.body.state_id ?? 0,
    country_id: req.body.country_id ?? 0,
    Lat: req.body.Lat ?? 0,
    Lng: req.body.Lng ?? 0,
    OTA_Config: req.body.OTA_Config ?? '',
    Periodic_Check_Ref_Time: req.body.Periodic_Check_Ref_Time ?? null,
    Periodicity_in_hours: req.body.Periodicity_in_hours ?? 0,
    When_to_Upgrade: req.body.When_to_Upgrade ?? '',
    Upgrade_Specific_Time: req.body.Upgrade_Specific_Time ?? '',
    is_available: req.body.is_available ?? '0',
    status: req.body.status ?? 'Y',
    created_date: req.body.created_date ?? null,
    created_by: req.body.created_by ?? null,
    modify_date: req.body.modify_date ?? new Date().toISOString().slice(0, 10),
    modify_by: req.body.modify_by ?? null,
    connector_data: req.body.connector_data ?? []
  });

  Charger.update(charger, (err, data) => {
    if (err) {
      return res.status(500).send({
        status: false,
        message: err.message || "Some error occurred during update."
      });
    }
    res.send(data);
  });
};

exports.dispatchChargers = (req, res) => {
  // multer saves file info to req.file (single file) or req.files (multiple)
  const file = req.file || (req.files && req.files.file?.[0]);

  // BULK dispatch from CSV
  if (file) {
    if (!file.originalname.endsWith('.csv')) {
      return res.status(400).send({ status: false, message: 'Only CSV files allowed for bulk upload.' });
    }

    const results = [];
    const filePath = file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        // Clean up uploaded file
        fs.unlinkSync(filePath);

        if (results.length === 0) {
          return res.status(400).send({ status: false, message: 'CSV file is empty' });
        }

        const bulkData = {
          client_id: req.body.client_id,
          sub_client_id: req.body.sub_client_id || 0,
          is_private: req.body.public === '0' ? 0 : 1, // assuming you send public='0' for true
          dispatch_status: req.body.status || 'Y',
          dispatch_by: req.body.dispatch_by,
          dispatch_date: req.body.dispatch_date,
          status: req.body.status || 'Y',
          created_by: req.body.dispatch_by,
          charger_data: results.map((row) => ({
            serial_no: row.serial_no?.trim(),
            warranty_start: row.warranty_start_date || null,
            warranty_end: row.warranty_end_date || null,
          })),
        };

        try {
          const response = await ClientChargerMap.dispatchChargers(bulkData);
          return res.status(200).send(response);
        } catch (err) {
          console.error('Bulk dispatch error:', err);
          return res.status(500).send({ status: false, message: 'Bulk dispatch failed.' });
        }
      });
    return;
  }

  // SINGLE dispatch
  const body = req.body;
  // Check that mandatory fields exist for single dispatch
  if (!body || !body.charger_id || !body.client_id) {
    return res.status(400).send({
      status: false,
      message: 'Required fields missing for single dispatch.',
    });
  }

  const singleData = {
    client_id: body.client_id,
    sub_client_id: body.sub_client_id || 0,
    is_private: body.public === '0' ? 0 : 1,
    dispatch_status: body.status || 'Y',
    dispatch_by: body.dispatch_by,
    dispatch_date: body.dispatch_date,
    status: body.status || 'Y',
    created_by: body.dispatch_by,
    charger_data: [
      {
        serial_no: body.charger_id, // assuming serial_no passed as charger_id
        warranty_start: body.warranty_start || null,
        warranty_end: body.warranty_end || null,
      },
    ],
  };

  ClientChargerMap.dispatchChargers(singleData)
    .then((response) => {
      return res.status(200).send({
        status: response.status,
        message: response.message || 'Dispatch successful.',
        result: response.data,
      });
    })
    .catch((err) => {
      console.error('Single dispatch error:', err);
      return res.status(500).send({
        status: false,
        message: err.message || 'Server error',
      });
    });
};


exports.updateClientChargers = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const clientChargerMap = new ClientChargerMap({
    id: req.body.id,
    charger_id: req.body.charger_id, // may not be used if array
    client_id: req.body.client_id,
    sub_client_id: req.body.sub_client_id || 0,
    dispatch_status: req.body.dispatch_status,
    dispatch_by: req.body.dispatch_by,
    dispatch_date: req.body.dispatch_date,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    charger_data: req.body.charger_data // should be array of { id }
  });

  ClientChargerMap.updateClientChargers(clientChargerMap, (err, data) => {
    res.send(data);
  });
};

exports.addChargerToStation = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const chargerStationMap = new ChargerStationMap({
    id: req.body.id,
    charger_id: req.body.charger_id,
    station_id: req.body.station_id,
    is_available: req.body.is_available,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save Customer in the database
  ChargerStationMap.addChargerToStation(chargerStationMap, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};


exports.addChargerToStationMultiple = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const chargerStationMap = new ChargerStationMap({
    id: req.body.id,
    charger_id: req.body.charger_id,
    station_id: req.body.station_id,
    is_available: req.body.is_available,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    charger_data: req.body.charger_data
  });

  // Save Customer in the database
  ChargerStationMap.addChargerToStationMultiple(chargerStationMap, (err, data) => {

    res.send(data);
  });
};

exports.removeChargerFromStation = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Vehicle
  const chargerStationMap = new ChargerStationMap({
    id: req.body.id,
    charger_id: req.body.charger_id,
    station_id: req.body.station_id,
    is_available: req.body.is_available,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save Customer in the database
  ChargerStationMap.removeChargerFromStation(chargerStationMap, (err, data) => {
    res.send(data);
  });
};

exports.getChargers = (req, res) => {
debugger;
  Charger.getChargers((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};

exports.getChargersDynamicFilter = (req, res) => {

  Charger.getChargersDynamicFilter(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};
exports.getChargersDynamicFilterCW = (req, res) => {

  let login_id = req.params.login_id;
  Charger.getChargersDynamicFilterCW(login_id, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};

exports.getPlantChargers = (req, res) => {

  Charger.getPlantChargers((err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};

exports.getClientChargers = async (req, res) => {
  try {
    const login_id = req.params.login_id;
    const data = await Charger.getClientChargers(login_id);

    if (!data || data.length === 0) {
      return res.status(200).send({
        status: 'fail',
        message: 'No chargers found for this client.',
        data: []
      });
    }

    res.send({
      status: 'success',
      message: 'Client chargers fetched successfully.',
      data: data
    });

  } catch (error) {
    console.error("Error in getClientChargers:", error);
    res.status(500).send({
      status: 'error',
      message: 'Error retrieving chargers.'
    });
  }
};


exports.getClientChargersNotMappedToAnyStation = (req, res) => {
  let client_id = req.params.client_id;

  Charger.getClientChargersNotMappedToAnyStation(client_id, (err, data) => {

    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id "
        });
      }
    } else res.send(data);
  });
};

exports.getChargersByStationId = (req, res) => {

  Charger.getChargersByStationId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Chargers with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Chargers with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.getChargersByMappedStationId = (req, res) => {
  Charger.getChargersByMappedStationId(req.params.id, (err, data) => {
    res.send(data);
  });
};
exports.getActiveChargersByMappedStationId = (req, res) => {
  Charger.getActiveChargersByMappedStationId(req.params.id, (err, data) => {
    res.send(data);
  });
};

exports.getChargerById = (req, res) => {
  Charger.getChargerById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.getChargerByDisplayId = (req, res) => {

  let display_id = req.params.display_id.trim().toUpperCase();
  Charger.getChargerByDisplayId(display_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.name}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.name
        });
      }
    } else res.send(data);
  });
};

exports.getChargersByClient_CPO_StationId = (req, res) => {

  Charger.getChargersByClient_CPO_StationId(req.body, (err, data) => {
    res.send(data);
  });
};

exports.getAllChargersByUserId = (req, res) => {
  Charger.getAllChargersByUserId(req.params.id, (err, data) => {
    res.send(data);
  });
};

exports.getAllChargersByUserIdBLE = (req, res) => {
  Charger.getAllChargersByUserIdBLE(req.params.user_id, (err, data) => {
    res.send(data);
  });
};

exports.getChargerBySerialNo = (req, res) => {
  let params = {
    srNo: req.params.srNo,
    station_id: req.params.station_id
  }

  Charger.getChargerBySerialNo(params, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with srNo " + req.params
        });
      }
    } else res.send(data);
  });
};


exports.delete = (req, res) => {
  Charger.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `Not found vehicle with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.id
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

exports.deleteChargerFromClient = (req, res) => {
  Charger.deleteChargerFromClient(req.params.id, req.params.user_id, (err, data) => {
    res.status(200).send(data);
  });
};

exports.getAllChargingProfileList = (req, res) => {
  ChargingProfile.getAllChargingProfileList((err, data) => {
    res.send(data);
  });
};
exports.ChargingProfileCreation = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    stack_level: req.body.stack_level,
    charging_profile_name: req.body.charging_profile_name,
    charging_profile_kind_id: req.body.charging_profile_kind_id,
    recurrency_kind_id: req.body.recurrency_kind_id,
    charging_profile_purpose_id: req.body.charging_profile_purpose_id,
    valid_from: req.body.valid_from,
    valid_to: req.body.valid_to,
    status: req.body.status,
    created_by: req.body.created_by,
    created_date: req.body.created_date
  });
  ChargingProfile.ChargingProfileCreation(chargingProfile, (err, data) => {
    res.send(data);
  });
};

exports.ChargingScheduleCreation = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    charging_profile_id: req.body.charging_profile_id,
    duration: req.body.duration,
    start_schedule: req.body.start_schedule,
    charging_rate_unit_id: req.body.charging_rate_unit_id,
    mincharging_rate: req.body.mincharging_rate,
    status: req.body.status,
    created_by: req.body.created_by,
    created_date: req.body.created_date
  });
  ChargingProfile.ChargingScheduleCreation(chargingProfile, (err, data) => {
    res.send(data);
  });
};
exports.ChargingSchedulePeriodCreation = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    charging_schedule_id: req.body.charging_schedule_id,
    start_period: req.body.start_period,
    period_limit: req.body.period_limit,
    numberof_phase_id: req.body.numberof_phase_id,
    status: req.body.status,
    created_by: req.body.created_by,
    created_date: req.body.created_date,
    scheduleData: req.body.scheduleData
  });
  ChargingProfile.ChargingSchedulePeriodCreation(chargingProfile, (err, data) => {
    res.send(data);
  });
};

exports.ChargingProfileDelete = (req, res) => {

  ChargingProfile.ChargingProfileDelete(req.params.id, req.params.modifyby, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving  with id "
        });
      }
    } else res.send(data);
  });
};
exports.ChargingScheduleDelete = (req, res) => {

  ChargingProfile.ChargingScheduleDelete(req.params.id, req.params.modifyby, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving  with id "
        });
      }
    } else res.send(data);
  });
};
exports.ChargingSchedulePeriodDelete = (req, res) => {

  ChargingProfile.ChargingSchedulePeriodDelete(req.params.id, req.params.modifyby, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving  with id "
        });
      }
    } else res.send(data);
  });
};
exports.UpdateChargingProfile = (req, res) => {
  debugger;
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    id: req.body.id,
    stack_level: req.body.stack_level,
    charging_profile_name: req.body.charging_profile_name,
    charging_profile_kind_id: req.body.charging_profile_kind_id,
    recurrency_kind_id: req.body.recurrency_kind_id,
    charging_profile_purpose_id: req.body.charging_profile_purpose_id,
    valid_from: req.body.valid_from,
    valid_to: req.body.valid_to,
    status: req.body.status,
    modify_date: req.body.modify_date,
    modifyby: req.body.modifyby
  });
  ChargingProfile.UpdateChargingProfile(chargingProfile, (err, data) => {
    res.send(data);
  });
};

exports.UpdateChargingSchedule = (req, res) => {
  debugger;
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    id: req.body.id,
    charging_profile_id: req.body.charging_profile_id,
    duration: req.body.duration,
    start_schedule: req.body.start_schedule,
    charging_rate_unit_id: req.body.charging_rate_unit_id,
    mincharging_rate: req.body.mincharging_rate,
    status: req.body.status,
    modifyby: req.body.modifyby,
    modify_date: req.body.modify_date
  });
  ChargingProfile.UpdateChargingSchedule(chargingProfile, (err, data) => {
    res.send(data);
  });
};

exports.UpdateChargingSchedulePeriod = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const chargingProfile = new ChargingProfile({
    id: req.body.id,
    charging_schedule_id: req.body.charging_schedule_id,
    start_period: req.body.start_period,
    period_limit: req.body.period_limit,
    numberof_phase_id: req.body.numberof_phase_id,
    status: req.body.status,
    modifyby: req.body.modifyby,
    modify_date: req.body.modify_date,
    scheduleData: req.body.scheduleData
  });
  ChargingProfile.UpdateChargingSchedulePeriod(chargingProfile, (err, data) => {
    res.send(data);
  });
};
exports.getAllEVChargingProviderList = (req, res) => {
  ChargingProfile.getAllEVChargingProviderList((err, data) => {
    res.send(data);
  });
};
exports.CreateEVChargingProvider = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty!"
    })
  }
  const chargingProfile = new ChargingProfile({
    name: req.body.name,
    role: req.body.role,
    offerings: req.body.offerings,
    projects: req.body.projects,
    remarks: req.body.remarks,
    status: req.body.status,
    created_by: req.body.created_by,
    created_date: req.body.created_date,
  })
  ChargingProfile.CreateEVChargingProvider(chargingProfile, (err, data) => {
    res.send(data);
  })
}
exports.updateEVChargingProvider = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  const chargingProfile = new ChargingProfile({
    id: req.body.id,
    name: req.body.name,
    role: req.body.role,
    offerings: req.body.offerings,
    projects: req.body.projects,
    remarks: req.body.remarks,
    status: req.body.status,
    modifyby: req.body.modifyby,
    modify_date: req.body.modify_date
  })
  ChargingProfile.updateEVChargingProvider(chargingProfile, (err, data) => {
    res.send(data);
  })
}
exports.deleteEVChargingProvider = (req, res) => {
  ChargingProfile.deleteEVChargingProvider(req.params.id, req.params.modifyby, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving  with id "
        });
      }
    } else res.send(data);
  });
};
exports.getChargerProfile = (req, res) => {
  ChargingProfile.getChargerProfile((err, data) => {
    res.send(data);
  })
}

exports.getChargerProfile_mst = (req, res) => {
  ChargingProfile.getChargerProfile_mst((err, data) => {
    res.send(data);
  })
}
exports.getChargerScheduleByProfileId = (req, res) => {
  let profile_id = req.params.profile_id;

  ChargingProfile.getChargerScheduleByProfileId(profile_id, (err, data) => {
    res.send(data);
  })
}
exports.getChargerSchedulePeriodByScheduleId = (req, res) => {
  let schedule_id = req.params.schedule_id;

  ChargingProfile.getChargerSchedulePeriodByScheduleId(schedule_id, (err, data) => {
    res.send(data);
  })
}


exports.getAllBleChargers = (req, res) => {
  Charger.getAllBleChargers((err, data) => {
    res.send(data);
  });
};

exports.updateBleChargerStatus = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }
  const charger = new ChargerRenewalRequestBle({
    id: req.body.charger_id,
    can_renew_warranty: req.body.can_renew_warranty,
    can_renew_plan: req.body.can_renew_plan,
    modify_by: req.body.modify_by,
    remarks: req.body.remarks,
    status: req.body.request_status,
    request_id: req.body.request_id,
    visit_date: req.body.visit_date,
    charger_condition: req.body.charger_condition,
    charger_description: req.body.charger_description,
    engineer_name: req.body.engineer_name,
    vendor_name: req.body.vendor_name,
    amount_collected: req.body.amount_collected,
    payment_mode: req.body.payment_mode,
    image_path: '',
    physical_visit: req.body.physical_visit
  });

  ChargerRenewalRequestBle.updateBleChargerStatus(charger, req.body.user_id, (err, data) => {
    res.send(data);
  });
};

exports.updateChargerAddressBLE = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "content can not be empty"
    });
  }

  const charger = new Charger({
    station_id: req.body.station_id,
    address1: req.body.address1,
    address2: !!req.body.address2 ? req.body.address2 : "",
    PIN: req.body.PIN,
    landmark: !!req.body.landmark ? req.body.landmark : "",
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: req.body.state_id,
    country_id: req.body.country_id,
    Lat: req.body.Lat,
    Lng: req.body.Lng,
    modify_by: req.body.modify_by
  });
  Charger.updateChargerAddressBLE(charger, (err, data) => {
    res.send(data);
  });


};
exports.getPendingWarrantyRequestBle = (req, res) => {
  Charger.getPendingWarrantyRequestBle((err, data) => {
    res.send(data);
  });
};

exports.checkChargerMappedToStationBySrNo = (req, res) => {
  let resp;

  if (!req.params.serial_no) {

    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide charger serial no.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  }

  let serial_no = req.params.serial_no;


  Charger.checkChargerMappedToStationBySrNo(serial_no, (err, data) => {
    res.send(data);
  });
};

exports.createChargerRequest = (req, res) => {
  debugger;
  let resp;
  let params;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  } else {

    params = req.body;

    if (!params.user_id) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide user_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.lat || !params.lng) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide latitute and longitude',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.charger_serial_no || params.charger_serial_no.length <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide charger_serial_no',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.country_id > 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide valid country_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.state_id > 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide valid state_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.city_id > 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide valid city_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else {
      const request = new AddChargerRequest({
        id: req.body.id,
        charger_id: req.body.charger_id,
        user_id: req.body.user_id,
        station_name: !!req.body.station_name ? req.body.station_name : '',
        provider: !!req.body.provider ? req.body.provider : '',
        model: req.body.model,
        lat: req.body.lat,
        lng: req.body.lng,
        remarks: !!req.body.remarks ? req.body.remarks : '',
        charger_serial_no: req.body.charger_serial_no,
        address1: !!req.body.address1 ? req.body.address1 : '',
        address2: !!req.body.address2 ? req.body.address2 : '',
        PIN: req.body.PIN,
        landmark: !!req.body.landmark ? req.body.landmark : '',
        city_id: !!req.body.city_id ? req.body.city_id : 0,
        state_id: !!req.body.state_id ? req.body.state_id : 0,
        country_id: !!req.body.country_id ? req.body.country_id : 0,
        image_url: !!req.body.image_url ? req.body.image_url : '',
        status: req.body.status,
        created_date: req.body.created_date,
        created_by: req.body.created_by,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
      });
      AddChargerRequest.createChargerRequest(request, (err, data) => {
        res.send(data);
      });
    }


  }
};

exports.getAllModerateChargerRequest = (req, res) => {
  AddChargerRequest.getAllModerateChargerRequest((err, data) => {
    res.send(data);
  });
};

exports.approveRejectChargerRequest = (req, res) => {
  let resp;

  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  }

  const request = new AddChargerRequest({
    id: req.body.id,
    status: req.body.status,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });
  AddChargerRequest.approveRejectChargerRequest(request, (err, data) => {
    res.send(data);
  });

};

exports.getAllApproveRejectChargerRequest = (req, res) => {
  AddChargerRequest.getAllApproveRejectChargerRequest((err, data) => {
    res.send(data);
  });
};

exports.updateChargerRequest = (req, res) => {
  debugger;
  let resp;
  let params;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  } else {

    params = req.body;

    if (!params.user_id) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide user_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.lat || !params.lng || params.lat <= 0 || params.lng <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide latitute and longitude',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else if (!params.charger_serial_no || params.charger_serial_no.length <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide charger_serial_no',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    } else {
      const request = new AddChargerRequest({
        id: req.body.id,
        charger_id: req.body.charger_id,
        user_id: req.body.user_id,
        station_name: !!req.body.station_name ? req.body.station_name : '',
        provider: !!req.body.provider ? req.body.provider : '',
        model: req.body.model,
        lat: req.body.lat,
        lng: req.body.lng,
        remarks: !!req.body.remarks ? req.body.remarks : '',
        charger_serial_no: req.body.charger_serial_no,
        address1: !!req.body.address1 ? req.body.address1 : '',
        address2: !!req.body.address2 ? req.body.address2 : '',
        PIN: !!req.body.PIN ? req.body.PIN : 0,
        landmark: !!req.body.landmark ? req.body.landmark : '',
        city_id: !!req.body.city_id ? req.body.city_id : 0,
        state_id: !!req.body.state_id ? req.body.state_id : 0,
        country_id: !!req.body.country_id ? req.body.country_id : 0,
        status: req.body.status,
        modify_date: req.body.modify_date,
        modify_by: req.body.modify_by
      });
      AddChargerRequest.updateChargerRequest(request, (err, data) => {
        res.send(data);
      });
    }


  }
};

exports.getApproveRejectChargerRequestByUserId = (req, res) => {
  let user_id = req.params.user_id;
  AddChargerRequest.getApproveRejectChargerRequestByUserId(user_id, (err, data) => {
    res.send(data);
  });
};

exports.getModerateChargerRequestByUserId = (req, res) => {
  let user_id = req.params.user_id;
  AddChargerRequest.getModerateChargerRequestByUserId(user_id, (err, data) => {
    res.send(data);
  });
};

exports.deleteChargerRequest = (req, res) => {

  let id = req.params.id;
  let modify_by = req.params.modify_by;

  AddChargerRequest.deleteChargerRequest(id, modify_by, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(200).send({
          message: `NOT_FOUND`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving  with id "
        });
      }
    } else res.send(data);
  });
};




exports.createScheduleBLE = (req, res) => {
  debugger;
  var datetime = new Date();
  let resp;
  let params;

  if ((Object.keys(req.body).length === 0)) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
    return;
  }else {
      if(req.body.schedule_type !== "ONE_TIME" &&  req.body.schedule_type !== "RECURRING"){
        resp = {
          status: false,
          err_code: 'ERROR : 1',
          message: 'Please provide correct Schedule_type(i.e. ONE_TIME/RECURRING)',
          count: 0,
          data: []
        }
        res.status(200).send(resp);
        return;
      }
   else if (!req.body.start_schedule_time && !req.body.stop_schedule_time && !req.body.schedule_type) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide Start_schedule_time ,Stop_schedule_time and Schedule_type!',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
    return;
  }
  else if (req.body.schedule_type == 'ONE_TIME') {
    debugger;
    if (!_utility.isLessThan24Hrs(req.body.start_schedule_time)) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please select scheduling time within 24 hours!',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
      return;
    }
  }
    const schedule = new Set_Schedule_BLE({
      id: req.body.id,
      charger_serial_no: req.body.charger_serial_no,
      user_id: req.body.user_id,
      schedule_id: req.body.schedule_id,
      start_schedule_time: req.body.start_schedule_time,
      stop_schedule_time: req.body.stop_schedule_time,
      duration: req.body.duration,
      schedule_type: req.body.schedule_type,
      schedule: req.body.schedule,
      day_name: req.body.day_name,
      schedule_status: req.body.schedule_status,
      schedule_name: req.body.schedule_name,
      status: req.body.status,
      created_date: req.body.created_date,
      created_by: req.body.created_by
    });

    Set_Schedule_BLE.createScheduleBLE(schedule, (err, data) => {
      res.send(data);
    });
  }
}




exports.getAllScheduleBLE = (req, res) => {
  Set_Schedule_BLE.getAllScheduleBLE((err, data) => {
    res.send(data);
  });
};

exports.getScheduleBLEByChargerSerialNo = (req, res) => {
  let charger_serial_no = req.params.charger_serial_no;
  Set_Schedule_BLE.getScheduleBLEByChargerSerialNo(charger_serial_no, (err, data) => {
    res.send(data);
  });
};

exports.getScheduleBLEByUserId = (req, res) => {
  let user_id = req.params.user_id;
  Set_Schedule_BLE.getScheduleBLEByUserId(user_id, (err, data) => {
    res.send(data);
  });
};

exports.ScheduleBLEByChargerSerialNoAndUserId = (req, res) => {
  let user_id = req.body.user_id;
  let charger_serial_no = req.body.charger_serial_no;
  let schedule_type = req.body.schedule_type;
  debugger;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide required body parameters!',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  }
  else if (!charger_serial_no) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide charger_serial_no',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
  } else {
    if (!user_id) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide user_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!schedule_type) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide schedule_type',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    Set_Schedule_BLE.ScheduleBLEByChargerSerialNoAndUserId(user_id, charger_serial_no, schedule_type, (err, data) => {
      res.send(data);
    });
  }
}
exports.updateScheduleBLE = (req, res) => {
  debugger;
  let resp;
  let params;

  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
    return;
  }else {
   if (!req.body.start_schedule_time && !req.body.stop_schedule_time && !req.body.schedule_type) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide Start_schedule_time ,Stop_schedule_time and Schedule_type!',
      count: 0,
      data: []
    }
    res.status(200).send(resp);
    return;
  }
  else if (req.body.schedule_type == 'one-time') {
    debugger;
    if (!_utility.isLessThan24Hrs(req.body.start_schedule_time)) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please select scheduling time within 24 hours!',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
      return;
    }
  }

    const schedule = new Set_Schedule_BLE({
      id: req.body.id,
      charger_serial_no: req.body.charger_serial_no,
      user_id: req.body.user_id,
      schedule_id: req.body.schedule_id,
      start_schedule_time: req.body.start_schedule_time,
      stop_schedule_time: req.body.stop_schedule_time,
      duration: req.body.duration,
      schedule_type: req.body.schedule_type,
      schedule: req.body.schedule,
      day_name: req.body.day_name,
      schedule_status: req.body.schedule_status,
      schedule_name: req.body.schedule_name,
      status: req.body.status,
      modify_date: req.body.modify_date,
      modify_by: req.body.modify_by
    });

    Set_Schedule_BLE.updateScheduleBLE(schedule, (err, data) => {
      res.send(data);
    });
  }
}

exports.updateEnableDisableScheduleBLE = (req, res) => {
  let resp;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR:1',
      message: 'Please provide body parameters!',
      count: 0,
      data: []
    }
    resp.status(200).send(resp);
  }
  const schedule = new Set_Schedule_BLE({
    id: req.body.id,
    status: req.body.status,
    schedule: req.body.schedule,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  Set_Schedule_BLE.updateEnableDisableScheduleBLE(schedule, (err, data) => {
    res.send(data);
  });
}

exports.updateScheduleStatusBLE = (req, res) => {
  let resp;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR:1',
      message: 'Please provide body parameters!',
      count: 0,
      data: []
    }
    resp.status(200).send(resp);
  }
  const schedule = new Set_Schedule_BLE({
    schedule_id: req.body.schedule_id,
    schedule_status: req.body.schedule_status,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  Set_Schedule_BLE.updateScheduleStatusBLE(schedule, (err, data) => {
    res.send(data);
  });
}


exports.deleteScheduleBLE = (req, res) => {
  let resp;
  debugger;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'please provide body parameters',
      data: []
    }
    res.status(200).send(resp);
  }
  const schedule = new Set_Schedule_BLE({
    id: !!req.body.id ? req.body.id : 0,
    modify_by: req.body.modify_by,
    schedule_id: req.body.schedule_id
  });
  Set_Schedule_BLE.deleteScheduleBLE(schedule, (err, data) => {
    res.send(data);
  });
};

exports.setChargerConfiguration = (req, res) => {

  let resp;
  let params;
  if (!req.body) {
    resp = {
      status: false,
      err_code: 'ERROR : 1',
      message: 'Please provide parameters.',
      count: 0,
      data: []
    }
    res.status(200).send(resp);

  } else {

    params = req.body;

    if (!params.charger_serial_no) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide charger_serial_no',
        count: 0,
        data: []
      }
      res.status(200).send(resp);

    } else if (params.configuration_key == 'FW' && !params.board_type) {


      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide board_type',
        count: 0,
        data: []
      }
      res.status(200).send(resp);

    } else if (params.configuration_key == 'CURRENT' && (!params.current_ampere_value || params.current_ampere_value <= 0)) {

      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide charger_serial_no',
        count: 0,
        data: []
      }
      res.status(200).send(resp);

    } else {

      const configuration = new ChargerConfiguration({
        id: req.body.id,
        charger_id: req.body.charger_id,
        charger_part_no_id: !!req.body.charger_part_no_id ? req.body.charger_part_no_id : 0,
        charger_serial_no: req.body.charger_serial_no,
        charger_part_no: !!req.body.charger_part_no ? req.body.charger_part_no : '',
        card_id: !!req.body.card_id ? req.body.card_id : '',
        card_part_no_id: !!req.body.card_part_no_id ? req.body.card_part_no_id : 0,
        card_serial_no: req.body.card_serial_no,
        card_part_no: !!req.body.card_part_no ? req.body.card_part_no : '',
        current_ampere_value: !!req.body.current_ampere_value ? req.body.current_ampere_value : 0,
        user_id: req.body.user_id,
        fw_version_id: !!req.body.fw_version_id ? req.body.fw_version_id : 0,
        fw_version_name: !!req.body.fw_version_name ? req.body.fw_version_name : '',
        board_type: !!req.body.board_type ? req.body.board_type : '',
        source_app: req.body.source_app,
        project_id: req.body.project_id,
        status: req.body.status,
        created_by: req.body.created_by,
        created_date: req.body.created_date,
        modify_date: req.body.modify_date,
        modifyby: req.body.modifyby,
        configuration_key: req.body.configuration_key

      });
      ChargerConfiguration.setChargerConfiguration(configuration, (err, data) => {
        res.send(data);
      });
    }
  }
};




exports.getAllChargerConfiguration = (req, res) => {
  ChargerConfiguration.getAllChargerConfiguration((err, data) => {
    res.send(data);
  })
}


exports.updateChargerNickName = (req, res) => {
  ChargerConfiguration.updateChargerNickName(req.body, (err, data) => {
    res.send(data);
  });
}


