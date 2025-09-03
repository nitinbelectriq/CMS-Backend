const { query } = require("express");
const myModule = require("../models/charger.model.js");
const _utility = require("../utility/_utility");

const Charger = myModule.Charger;
const ChargerRenewalRequestBle = myModule.ChargerRenewalRequestBle;
const ChargingProfile = myModule.ChargingProfile;
const ChargerStationMap = myModule.ChargerStationMap;
const ClientChargerMap = myModule.ClientChargerMap;
const AddChargerRequest = myModule.AddChargerRequest;
const Set_Schedule_BLE = myModule.Set_Schedule_BLE;
const ChargerConfiguration = myModule.ChargerConfiguration;

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
//;

  // Create a Vehicle
  const charger = new Charger({
    name: req.body.charger_display_id,
    serial_no: req.body.serial_no,
    batch_id: req.body.batch_id || null,
    station_id: req.body.station_id || null,
    model_id: req.body.model_id,
    current_version_id: req.body.current_version_id,
    no_of_guns: req.body.no_of_guns || null,

    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,

    Lat: req.body.Lat || 0,
    Lng: req.body.Lng || 0,
    OTA_Config: !!req.body.OTA_Config ? req.body.OTA_Config : 0,
    Periodic_Check_Ref_Time: !!req.body.Periodic_Check_Ref_Time ? req.body.Periodic_Check_Ref_Time : '2000-01-01 00:00:00',
    Periodicity_in_hours: !!req.body.Periodicity_in_hours ? req.body.Periodicity_in_hours : 12,
    When_to_Upgrade: !!req.body.When_to_Upgrade ? req.body.When_to_Upgrade : 'IMMEDIATE',
    Upgrade_Specific_Time: !!req.body.Upgrade_Specific_Time ? req.body.Upgrade_Specific_Time : '00:00:00',
    is_available: req.body.is_available,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    connector_data: req.body.connector_data

  });

  // Save Customer in the database
  Charger.create(charger, (err, data) => {
    res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  debugger;
  // Create a Vehicle
  const charger = new Charger({
    id: req.body.id,
   name: req.body.charger_display_id,
    serial_no: req.body.serial_no,
    batch_id: req.body.batch_id || null,
    station_id: req.body.station_id || null,
     model_id: req.body.model_id,
    current_version_id: req.body.current_version_id,
    no_of_guns: req.body.no_of_guns || null,
    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,
    Lat: req.body.Lat || 0,
    Lng: req.body.Lng || 0,
    OTA_Config: req.body.OTA_Config || null,
    Periodic_Check_Ref_Time: req.body.Periodic_Check_Ref_Time || null,
    Periodicity_in_hours: req.body.Periodicity_in_hours || null,
    When_to_Upgrade: req.body.When_to_Upgrade || null,
    Upgrade_Specific_Time: req.body.Upgrade_Specific_Time || null,
    is_available: req.body.is_available || null,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    connector_data: req.body.connector_data
  });

  // Save Customer in the database
  Charger.update(charger, (err, data) => {
    res.send(data);
  });
};

exports.dispatchChargers = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  //;
  // Create a Vehicle
  const clientChargerMap = new ClientChargerMap({
    id: req.body.id,
    charger_id: req.body.charger_id,
    client_id: req.body.client_id,
    sub_client_id: req.body.sub_client_id,
    is_private: req.body.is_private,
    dispatch_status: req.body.dispatch_status,
    dispatch_by: req.body.dispatch_by,
    dispatch_date: req.body.dispatch_date,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    warrantyStart :req.body.warranty_start ,
    warrantyEnd :req.body.warranty_end,
    charger_data: req.body.charger_data
  });

  // Save Customer in the database
  ClientChargerMap.dispatchChargers(clientChargerMap, (err, data) => {
    res.send(data);
  });
};

exports.updateClientChargers = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  //;
  // Create a Vehicle
 const clientChargerMap = new ClientChargerMap({
    id: req.body.id,
    charger_id: req.body.charger_id,
    client_id: req.body.client_id,
    sub_client_id: req.body.sub_client_id,
    is_private: req.body.is_private,
    dispatch_status: req.body.dispatch_status,
    dispatch_by: req.body.dispatch_by,
    dispatch_date: req.body.dispatch_date,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by,
    warrantyStart :req.body.warranty_start ,
    warrantyEnd :req.body.warranty_end
  });
  // Save Customer in the database
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
  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }
//;
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

  ChargerStationMap.addChargerToStationMultiple(chargerStationMap, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
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

exports.getClientChargers = (req, res) => {
  let userDetails = req.body.userDetails[0];
  let login_id = req.params.login_id;
  Charger.getClientChargers(login_id, (err, data) => {
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
  //;
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
  //;
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
  //;
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
  //;
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
  //;
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
    //;
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
  //;
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
  //;
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
    //;
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
  //;
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


