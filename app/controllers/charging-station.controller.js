const myModule = require("../models/charging-station.model");
const _utility = require("../utility/_utility");
const ChargingStation = myModule.ChargingStation;
const AddEvChargingStation = myModule.AddEvChargingStation;

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Construct charging station object
const chargingStation = new ChargingStation({
  id: req.body.id,
  cpo_id: req.body.cpo_id,
  name: req.body.name,
  code: req.body.code,
  description: req.body.description,
  address1: req.body.address1 || '',
  address2: req.body.address2 || '',
  PIN: req.body.PIN || 0,
  landmark: req.body.landmark || '',
  city_id: req.body.city_id || 0,
  state_id: req.body.state_id || 0,
  country_id: req.body.country_id || 0,
  lat: req.body.lat,
  lng: req.body.lng,
  location_type_id: req.body.location_type_id,
  cp_name: req.body.cp_name,
  mobile: req.body.mobile,
  email: req.body.email,
  commissioned_dt: req.body.commissioned_dt || '',
  register_as: req.body.register_as,
  electricity_line_id: req.body.electricity_line_id,
  o_time: req.body.o_time,
  c_time: req.body.c_time,
  status: req.body.status,
  created_date: req.body.created_date,
  created_by: req.body.created_by,
  modify_date: req.body.modified_date, // ✅ fix this
  modify_by: req.body.modified_by,     // ✅ fix this
  amenities: Array.isArray(req.body.amenities) ? req.body.amenities : []
});


  // Save to DB
  ChargingStation.create(chargingStation, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the Charging Station."
      });
    }
    res.send(data);
  });
};


exports.update = (req, res) => {
  debugger;

  if (!req.body) {
    return res.status(400).send({ message: "Content can not be empty!" });
  }

  // Log amenities for debugging
  console.log("Received amenities:", req.body.amenities);

  const chargingStation = new ChargingStation({
    ...req.body,
    address1: req.body.address1 || '',
    address2: req.body.address2 || '',
    PIN: req.body.PIN || 0,
    landmark: req.body.landmark || '',
    city_id: req.body.city_id || 0,
    state_id: req.body.state_id || 0,
    country_id: req.body.country_id || 0,
    commissioned_dt: req.body.commissioned_dt || '',
    modify_by: req.body.modified_by,
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : []
  });

  ChargingStation.update(chargingStation, (err, data) => {
    res.send(data);
  });
};


exports.getChargingStations = (req, res) => {
  ChargingStation.getChargingStations((err, data) => {
    res.status(200).send(data)
  });
};

exports.getChargingStationsByUserRoleAndLatLong = (req, res) => {
  let login_id = req.params.login_id;

  ChargingStation.getChargingStationsByUserRoleAndLatLong(login_id, req.body, (err, data) => {
    res.status(200).send(data)
  });
};
exports.getChargingStationsByUserRoleAndLatLongWL = (req, res) => {

  ChargingStation.getChargingStationsByUserRoleAndLatLongWL(req.body, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getChargingStationsByUserRoleAndLatLongUW = (req, res) => {
  let user_id = req.params.user_id;

  ChargingStation.getChargingStationsByUserRoleAndLatLongUW(user_id, req.body, (err, data) => {
    res.status(200).send(data)
  });
};
exports.getChargingStationsByUserRoleAndLatLongUW1 = (req, res) => {
  let user_id = req.params.user_id;
debugger;
  ChargingStation.getChargingStationsByUserRoleAndLatLongUW1(user_id, req.body, (err, data) => {
    res.status(200).send(data)
  });
};


exports.getAllChargingStationsWithChargersAndConnectors = (req, res) => {
  ChargingStation.getAllChargingStationsWithChargersAndConnectors((err, data) => {
    res.status(200).send(data)
  });
};
exports.getAllChargingStationsWithChargersAndConnectorsCW = async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const data = await ChargingStation.getAllChargingStationsWithChargersAndConnectorsCW(user_id);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      status: false,
      message: 'INTERNAL_SERVER_ERROR',
      count: 0,
      data: []
    });
  }
};


exports.getAllChargingStationsWithChargersAndConnectorsCCS = (req, res) => {
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }

  ChargingStation.getAllChargingStationsWithChargersAndConnectorsCCS(params, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getActiveChargingStationsWithChargersAndConnectorsCW = (req, res) => {
  let login_id = req.params.login_id;
debugger;
  ChargingStation.getActiveChargingStationsWithChargersAndConnectorsCW(login_id, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getActiveChargingStationsWithChargersAndConnectorsCCS = (req, res) => {
 
  let params ={
    login_id : req.params.login_id,
    client_id : req.params.client_id,
    cpo_id : req.params.cpo_id,
    station_id : req.params.station_id
  }

  ChargingStation.getActiveChargingStationsWithChargersAndConnectorsCCS(params, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getActiveChargingStationsCW = (req, res) => {
  let login_id = req.params.login_id;

  ChargingStation.getActiveChargingStationsCW(login_id, (err, data) => {
    res.status(200).send(data)
  });
};
exports.getAllChargingStationsWithChargersAndConnectorsUW = (req, res) => {
  let user_id = req.params.user_id;

  ChargingStation.getAllChargingStationsWithChargersAndConnectorsUW(user_id, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getChargingStationById = (req, res) => {
  ChargingStation.getChargingStationById(req.params.id, (err, data) => {
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

exports.getChargingStationByCpoId = (req, res) => {
  ChargingStation.getChargingStationByCpoId(req.params.cpo_id, (err, data) => {
    res.status(200).send(data)
  });
};

exports.getChargingStationsWithTotalChargersByCPOId = (req, res) => {
  ChargingStation.getChargingStationsWithTotalChargersByCPOId(req.params.cpo_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.cpo_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with cpo_id " + req.params.cpo_id
        });
      }
    } else res.send(data);
  });
};

exports.getChargingStationByClientId = (req, res) => {
  ChargingStation.getChargingStationByClientId(req.params.client_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Charging Station with id ${req.params.client_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Charging Station with client_id " + req.params.client_id
        });
      }
    } else res.send(data);
  });
};

exports.getAmenitiesByStationId = (req, res) => {
  ChargingStation.getAmenitiesByStationId(req.params.station_id, (err, data) => {
    res.send(data);
  });
};



exports.delete = (req, res) => {
  ChargingStation.delete(req.params.id, (err, data) => {
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

exports.getAllActiveChargingStations = (req, res) => {
  let final_res;
  let client_id = req.params.client_id;
  let cpo_id = req.params.cpo_id;

  if (!!client_id) {
    if (client_id > 0) {
      ChargingStation.getAllActiveChargingStations(client_id, cpo_id, (err, data) => {
        res.send(data);
      });
    }
    else {
      final_res = {
        status: false,
        err_code: `ERROR : 1`,
        message: `ERROR : Client ID must be greater than 0`,
        data: []
      }
      res.send(final_res);
    }
  }
  else {
    final_res = {
      status: false,
      err_code: `ERROR : 1`,
      message: `ERROR : Client ID not provided`,
      data: []
    }

    res.send(final_res);
  }
};

exports.createEvChargingStationRequest = (req, res) => {
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
    }
    else if (!params.country_id || params.country_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide country_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.state_id || params.state_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide state_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!_utility.isValidEmail(params.email)) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide valid email_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.city_id || params.city_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide city_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.lat || !params.lng || params.lat <= 0 || params.lng <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide longitude and latitude',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.mobile || params.mobile.length < 8 || params.mobile.length > 13) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide mobile no.',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    const request = new AddEvChargingStation({
      id: req.body.id,
      user_id: req.body.user_id,
      country_id: req.body.country_id,
      volume_of_ev_user: req.body.volume_of_ev_user,
      space_for_station: req.body.space_for_station,
      population_density: req.body.population_density,
      PIN:req.body.PIN,
      like_count: req.body.like_count,
      address1: req.body.address1,
      address2: req.body.address2,
      dislike_count: req.body.dislike_count,
      landmark: req.body.landmark,
      city_id: req.body.city_id,
      state_id: req.body.state_id,
      lat: req.body.lat,
      lng: req.body.lng,
      mobile: req.body.mobile,
      email: req.body.email,
      status: req.body.status,
      created_date: req.body.created_date,
      created_by: req.body.created_by,
      modify_date: req.body.modify_date,
      modify_by: req.body.modify_by

    });

    AddEvChargingStation.createEvChargingStationRequest(request, (err, data) => {
      res.send(data);
    });
  };
}

exports.getEvChargingStationRequestByCityId = (req, res) => {
  debugger;
  let city_id = req.params.city_id;
  let user_id =req.params.user_id;

  AddEvChargingStation.getEvChargingStationRequestByCityId(user_id,city_id,(err, data) => {
    res.send(data);
  });
}

exports.getEvChargingStationRequestByUserIdCityId = (req, res) => {
  let user_id = req.params.user_id;
  let city_id = req.params.city_id;

  AddEvChargingStation.getEvChargingStationRequestByUserIdCityId(user_id,city_id,(err, data) => {
    res.send(data);
  });
}

exports.updateEvChargingStationRequest = (req, res) => {
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
    }
    else if (!params.country_id || params.country_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide country_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.state_id || params.state_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide state_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!_utility.isValidEmail(params.email)) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide valid email_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.city_id || params.city_id <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide city_id',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.lat || !params.lng || params.lat <= 0 || params.lng <= 0) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide longitude and latitude',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    else if (!params.mobile || params.mobile.length < 8 || params.mobile.length > 13) {
      resp = {
        status: false,
        err_code: 'ERROR : 1',
        message: 'Please provide mobile no.',
        count: 0,
        data: []
      }
      res.status(200).send(resp);
    }
    const request = new AddEvChargingStation({
      id: req.body.id,
      user_id: req.body.user_id,
      country_id: req.body.country_id,
      volume_of_ev_user: req.body.volume_of_ev_user,
      space_for_station: req.body.space_for_station,
      population_density: req.body.population_density,
      like_count: req.body.like_count,
      PIN:req.body.PIN ,
      address1: req.body.address1,
      address2: req.body.address2,
      dislike_count: req.body.dislike_count,
      landmark: req.body.landmark,
      city_id: req.body.city_id,
      state_id: req.body.state_id,
      lat: req.body.lat,
      lng: req.body.lng,
      mobile: req.body.mobile,
      email: req.body.email,
      status: req.body.status,
      created_date: req.body.created_date,
      created_by: req.body.created_by,
      modify_date: req.body.modify_date,
      modify_by: req.body.modify_by

    });

    AddEvChargingStation.updateEvChargingStationRequest(request, (err, data) => {
      res.send(data);
    });
  };
}

exports.getApproveRejectEvChargingStationRequestByCityId = (req, res) => {
  let city_id = req.params.city_id;
  let user_id = req.params.user_id;

  AddEvChargingStation.getApproveRejectEvChargingStationRequestByCityId(user_id,city_id, (err, data) => {
    res.send(data);
  });
}

exports.getApproveRejectEvChargingStationRequestByUserIdCityId = (req, res) => {
  let user_id = req.params.user_id;
  let city_id = req.params.city_id;


  AddEvChargingStation.getApproveRejectEvChargingStationRequestByUserIdCityId(user_id,city_id, (err, data) => {
    res.send(data);
  });
}

exports.approveRejectChargerStationRequest = (req, res) => {
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
  } else{
  const request = new AddEvChargingStation({
    id: req.body.id,
    status: req.body.status,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });
  AddEvChargingStation.approveRejectChargerStationRequest(request, (err, data) => {
    res.send(data);
  });
  }
};

exports.deleteChargerStationRequest = (req, res) => {
  let id= req.params.id;
  let modify_by=req.params.modify_by;
  AddEvChargingStation.deleteChargerStationRequest(id,modify_by, (err, data) => {
  res.send(data);
  });
}

exports.LikeDislikeRequest = (req, res) => {
  let resp;
 debugger;
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

  const request = new AddEvChargingStation({
      id: req.body.id,
      user_id: req.body.user_id,
      country_id: req.body.country_id,
      volume_of_ev_user: req.body.volume_of_ev_user,
      space_for_station: req.body.space_for_station,
      population_density: req.body.population_density,
      like_count: req.body.like_count,
      address1: req.body.address1,
      address2: req.body.address2,
      dislike_count: req.body.dislike_count,
      landmark: req.body.landmark,
      city_id: req.body.city_id,
      state_id: req.body.state_id,
      lat: req.body.lat,
      lng: req.body.lng,
      mobile: req.body.mobile,
      email: req.body.email,
      status: req.body.status,
      created_date: req.body.created_date,
      created_by: req.body.created_by,
      modify_date: req.body.modify_date,
      modify_by: req.body.modify_by,
      like_dislike : req.body.like_dislike,
      request_id : req.body.request_id
  });
  AddEvChargingStation.LikeDislikeRequest(request, (err, data) => {
    res.send(data);
  });
}
exports.getAllAmenities = (req, res) => {
  ChargingStation.getAllAmenities((err, data) => {
    if (err) {
      return res.status(500).send({
        status: false,
        err_code: 'ERROR : 500',
        message: 'Internal Server Error',
        data: []
      });
    }
    res.send(data);
  });
};




