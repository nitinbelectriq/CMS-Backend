const myModule = require("../models/user-management.model.js");
const fs = require("fs");
const { upload } = require("../middleware/multer");
const _utility = require("../utility/_utility");

const User = myModule.User;
const UserStation = myModule.UserStation;
const UserCharging = myModule.UserCharging;
const UserMenu = myModule.UserMenu
exports.create = (req, res) => {

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  debugger;
  const user = new User({
    id: req.body.id,
    code: !!req.body.code ? req.body.code : '',
    role_id: req.body.role_id,
    cpo_id: !!req.body.cpo_id ? req.body.cpo_id : 0,
    userid: req.body.userid,
    username: req.body.username,
    password: req.body.password,
    f_Name: !!req.body.f_Name ? req.body.f_Name : '',
    m_Name: !!req.body.m_Name ? req.body.m_Name : '',
    l_Name: !!req.body.l_Name ? req.body.l_Name : '',
    dob: !!req.body.dob ? req.body.dob : '',
    mobile: !!req.body.mobile ? req.body.mobile : '',
    alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
    email: !!req.body.email ? req.body.email : '',
    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,
    PAN: !!req.body.PAN ? req.body.PAN : '',
    aadhar: !!req.body.aadhar ? req.body.aadhar : '',
    device_id: !!req.body.device_id ? req.body.device_id : '',
    app_version: !!req.body.app_version ? req.body.app_version : '',
    os_version: !!req.body.os_version ? req.body.os_version : '',
    user_type: req.body.user_type,
    client_id: !!req.body.client_id ? req.body.client_id : 0,
    station_id: !!req.body.station_id ? req.body.station_id : 0,
    can_expire: req.body.can_expire || 'Y',
    hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
    hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
    last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
    last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
    employee_code: !!req.body.employee_code ? req.body.employee_code : '',
    is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
    otp: !!req.body.otp ? req.body.otp : '',
    registration_origin: req.body.registration_origin || 'WEB',
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by

  });
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User Prefrance."
      });
    else res.send(data);
  });
};


exports.update = (req, res) => {
  // Validate request
//;
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  //;

  const user = new User({
    id: req.body.id,
    code: !!req.body.code ? req.body.code : '',
    cpo_id: !!req.body.cpo_id ? req.body.cpo_id : 0,
    role_id: req.body.role_id,
    username: req.body.username,
    password: req.body.password,
    f_Name: !!req.body.f_Name ? req.body.f_Name : '',
    m_Name: !!req.body.m_Name ? req.body.m_Name : '',
    l_Name: !!req.body.l_Name ? req.body.l_Name : '',
    dob: !!req.body.dob ? req.body.dob : '',
    mobile: !!req.body.mobile ? req.body.mobile : '',
    alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
    email: !!req.body.email ? req.body.email : '',
    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,
    PAN: !!req.body.PAN ? req.body.PAN : '',
    aadhar: !!req.body.aadhar ? req.body.aadhar : '',
    device_id: !!req.body.device_id ? req.body.device_id : '',
    app_version: !!req.body.app_version ? req.body.app_version : '',
    os_version: !!req.body.os_version ? req.body.os_version : '',
    user_type: req.body.user_type,
    client_id: !!req.body.client_id ? req.body.client_id : 0,
    can_expire: req.body.can_expire,
    hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
    hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
    last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
    last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
    employee_code: !!req.body.employee_code ? req.body.employee_code : '',
    is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
    otp: !!req.body.otp ? req.body.otp : '',
    registration_origin: req.body.registration_origin,
    alexa_enabled: req.body.alexa_enabled,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save user in the database
  User.update(user, (err, data) => {
    res.send(data);
  });

};

exports.UserStationMappingV1 = (req, res) => {

  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle

  const userStation = new UserStation({
    id: req.body.id,
    user_id: req.body.user_id,
    station_id: req.body.station_id,
    default_station: req.body.default_station,
    station_data: req.body.station_data,
    status: req.body.status,
    created_date: req.body.created_date,
    createdby: req.body.createdby,
    modify_date: req.body.modify_date,
    modifyby: req.body.modifyby
  });

  // Save Customer in the database
  UserStation.UserStationMappingV1(userStation, (err, data) => {
    //;
    res.send(data);
  });
};
















exports.updateAlexaEnabled = (req, res) => {
  // Validate request

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = new User({
    id: req.body.id,
    alexa_enabled: req.body.alexa_enabled,
    modify_by: req.body.modify_by
  });

  // Save user in the database
  User.updateAlexaEnabled(user, (err, data) => {
    res.send(data);
  });

};


exports.getUsersCW = (req, res) => {

  let user_id = req.params.user_id;
  User.getUsersCW(user_id, (err, data) => {
    res.send(data);
  });
};
exports.getActiveUsersCW = (req, res) => {

  let user_id = req.params.user_id;
  User.getActiveUsersCW(user_id, (err, data) => {

    res.send(data);
  });

};

exports.getActiveUsersByClient = (req, res) => {

  let client_id = req.params.client_id;
  User.getActiveUsersByClient(client_id, (err, data) => {

    res.send(data);
  });

};

exports.getUserById = (req, res) => {
  User.getUserById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};
exports.getUserByMobile = (req, res) => {

  if (!req.params.mobile) {
    res.status(200).send({
      status: false,
      message: `mobile number missing `
    });
  }
  User.getUserByMobile(req.params.mobile, (err, data) => {
    res.send(data);
  });
};

exports.userChargingHistory = (req, res) => {
  User.userChargingHistory(req.params.id).then(response => {
    res.send(response);
  });
};

exports.getUserChargingHistoryCW = (req, res) => {
  let login_id = req.params.login_id;
  User.getUserChargingHistoryCW(login_id, req.body).then(response => {
    res.send(response);
  });
};

exports.getChargingHistoryCW = (req, res) => {
  let login_id = req.params.login_id;
  User.getChargingHistoryCW(login_id, req.body).then(response => {
    res.send(response);
  });
};

exports.delete = (req, res) => {
  //;
  User.delete(req.params.id, req.params.user_id, (err, data) => {

    res.send(data);
  });
};
// Save User favourite station in the database
exports.userStationMapping = (req, res) => {

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const user = new User({
    id: req.body.id,
    is_favourite: req.body.is_favourite,
    station_id: req.body.station_id,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save User favourite station in the database

  User.userStationMapping(user, (err, data) => {

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User Prefrance."
      });
    else res.send(data);
  });

};
// Save User favourite station in the database
exports.updateUserStationMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const user = new User({
    id: req.body.id,
    is_favourite: req.body.is_favourite,
    station_id: req.body.station_id,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });
  User.updateUserStationMapping(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while update the User Station Mapping."
      });
    else res.send(data);
  });

};

//new
exports.userPreferedStationMapping = (req, res) => {

  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const user = new User({
    id: req.body.id,
    is_favourite: req.body.is_favourite,
    station_id: req.body.station_id,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save User favourite station in the database

  User.userPreferedStationMapping(user, (err, data) => {

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User Prefrance."
      });
    else res.send(data);
  });

};

exports.updateUserPreferedStationMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const user = new User({
    id: req.body.id,
    is_favourite: req.body.is_favourite,
    station_id: req.body.station_id,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });
  User.updateUserPreferedStationMapping(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while update the User Station Mapping."
      });
    else res.send(data);
  });

};

exports.clientCpoStationDetails = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  let login_id = req.params.login_id;
  ;
  User.clientCpoStationDetails(login_id, req.body, (err, data) => {
    res.send(data);
  });

};

exports.cpoStationDetailsByClientId = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  let login_id = req.params.login_id;
  let client_id = req.params.client_id;
  ;
  User.cpoStationDetailsByClientId(login_id, client_id, req.body, (err, data) => {
    res.send(data);
  });

};


exports.getRoleListWithRolesAssignedToUserCW = (req, res) => {

  let client_id = req.params.client_id;
  let user_id = req.params.user_id;
  let project_id = req.params.project_id;
  User.getRoleListWithRolesAssignedToUserCW(client_id, user_id, project_id, (err, data) => {

    res.send(data);
  });
};

exports.getUserRoleMappingCW = (req, res) => {

  let login_id = req.params.login_id;
  let project_id = req.params.project_id;
  User.getUserRoleMappingCW(login_id, project_id, (err, data) => {

    res.send(data);
  });
};

// Get User Role Mapping in the database
exports.userRoleMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User Role Mapping
  const user = new User({
    id: req.body.id,
    code: !!req.body.code ? req.body.code : '',
    role_id: req.body.role_id,
    cpo_id: req.body.cpo_id,
    user_id: req.body.user_id,
    roles: req.body.roles,
    username: req.body.username,
    password: req.body.password,
    f_Name: !!req.body.f_Name ? req.body.f_Name : '',
    m_Name: !!req.body.m_Name ? req.body.m_Name : '',
    l_Name: !!req.body.l_Name ? req.body.l_Name : '',
    dob: !!req.body.dob ? req.body.dob : '',
    mobile: !!req.body.mobile ? req.body.mobile : '',
    alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
    email: !!req.body.email ? req.body.email : '',
    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,
    PAN: !!req.body.PAN ? req.body.PAN : '',
    aadhar: !!req.body.aadhar ? req.body.aadhar : '',
    device_id: !!req.body.device_id ? req.body.device_id : '',
    app_version: !!req.body.app_version ? req.body.app_version : '',
    os_version: !!req.body.os_version ? req.body.os_version : '',
    user_type: req.body.user_type,
    client_id: !!req.body.client_id ? req.body.client_id : 0,
    can_expire: req.body.can_expire,
    hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
    hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
    last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
    last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
    employee_code: !!req.body.employee_code ? req.body.employee_code : '',
    is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
    otp: !!req.body.otp ? req.body.otp : '',
    registration_origin: req.body.registration_origin,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  // Save Role in the database
  User.userRoleMapping(user, (err, data) => {

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Role."
      });
    else res.send(data);
  });
};


// Update User Role Mapping in the database
exports.updateUserRoleMapping = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const user = new User({
    id: req.body.id,
    code: !!req.body.code ? req.body.code : '',
    cpo_id: !!req.body.cpo_id ? req.body.cpo_id : '',
    role_id: req.body.role_id,
    user_id: req.body.user_id,
    default_role: req.body.default_role,
    username: req.body.username,
    password: req.body.password,
    f_Name: !!req.body.f_Name ? req.body.f_Name : '',
    m_Name: !!req.body.m_Name ? req.body.m_Name : '',
    l_Name: !!req.body.l_Name ? req.body.l_Name : '',
    dob: !!req.body.dob ? req.body.dob : '',
    mobile: !!req.body.mobile ? req.body.mobile : '',
    alt_mobile: !!req.body.alt_mobile ? req.body.alt_mobile : '',
    email: !!req.body.email ? req.body.email : '',
    address1: !!req.body.address1 ? req.body.address1 : '',
    address2: !!req.body.address2 ? req.body.address2 : '',
    PIN: !!req.body.PIN ? req.body.PIN : 0,
    landmark: !!req.body.landmark ? req.body.landmark : '',
    city_id: !!req.body.city_id ? req.body.city_id : 0,
    state_id: !!req.body.state_id ? req.body.state_id : 0,
    country_id: !!req.body.country_id ? req.body.country_id : 0,
    PAN: !!req.body.PAN ? req.body.PAN : '',
    aadhar: !!req.body.aadhar ? req.body.aadhar : '',
    device_id: !!req.body.device_id ? req.body.device_id : '',
    app_version: !!req.body.app_version ? req.body.app_version : '',
    os_version: !!req.body.os_version ? req.body.os_version : '',
    user_type: req.body.user_type,
    client_id: !!req.body.client_id ? req.body.client_id : 0,
    can_expire: req.body.can_expire,
    hint_question: !!req.body.hint_question ? req.body.hint_question : 0,
    hint_answer: !!req.body.hint_answer ? req.body.hint_answer : '',
    last_pass_change: !!req.body.last_pass_change ? req.body.last_pass_change : '',
    last_login_date: !!req.body.last_login_date ? req.body.last_login_date : '',
    employee_code: !!req.body.employee_code ? req.body.employee_code : '',
    is_verified: !!req.body.is_verified ? req.body.is_verified : 'N',
    otp: !!req.body.otp ? req.body.otp : '',
    registration_origin: req.body.registration_origin,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: !!req.body.created_by ? req.body.created_by : 0,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });
  User.updateUserRoleMapping(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while update the User Station Mapping."
      });
    else res.send(data);
  });

};
exports.deleteUserRoleMapping = (req, res) => {
  User.deleteUserRoleMapping(req.params.id, req.params.user_id, (err, data) => {

    res.send(data);
  });
};

exports.deleteUserStationMapping = (req, res) => {
  UserStation.deleteUserStationMapping(req.params.id, req.params.login_id, (err, data) => {

    res.send(data);
  });
};

exports.getAllUserStationMapping = (req, res) => {

  let login_id = req.params.login_id;
  UserStation.getAllUserStationMapping(login_id, (err, data) => {

    res.send(data);
  });
};

exports.updateUserStationMappingV1 = (req, res) => {

  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle

  const userStation = new UserStation({
    id: req.body.id,
    user_id: req.body.user_id,
    station_id: req.body.station_id,
    default_station: req.body.default_station,
    station_data: req.body.station_data,
    status: req.body.status,
    created_date: req.body.created_date,
    createdby: req.body.createdby,
    modify_date: req.body.modify_date,
    modifyby: req.body.modifyby
  });

  // Save Customer in the database
  UserStation.updateUserStationMappingV1(userStation, (err, data) => {
    //;
    res.send(data);
  });
};



exports.getStationListWithStationAssignedToUser = (req, res) => {

  let user_id = req.params.user_id;
  let cpo_id = req.params.cpo_id;
  UserStation.getStationListWithStationAssignedToUser(cpo_id, user_id, (err, data) => {

    res.send(data);
  });
};
exports.userChargerMappingBLESync = (req, res) => {
  //;
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle

  const userCharging = new UserCharging({
    user_id: req.body.user_id,
    charger_id: req.body.charger_id,
    serial_no: req.body.serial_no,
    nick_name: req.body.nick_name,
    client_certificate: req.body.client_certificate,
    map_as_child: req.body.map_as_child,
    status: req.body.status,
    action: req.body.action,
    created_date: req.body.created_date,
    createdby: req.body.createdby,
    modify_date: req.body.modify_date,
    modifyby: req.body.modifyby
  });

  // Save Customer in the database
  UserCharging.userChargerMappingBLESync(userCharging, (err, data) => {

    res.send(data);
  });
};
exports.revokeChargerAccessBLE = (req, res) => {
  //;
  if (!req.body) {
    res.status(200).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Vehicle

  const userCharging = new UserCharging({
    id:req.body.id,
    request_id:req.body.request_id,
    client_dev_no:req.body.client_dev_no,
    user_id: req.body.user_id,
    charger_id: req.body.charger_id,
    serial_no: req.body.serial_no,
    nick_name: req.body.nick_name,
    client_certificate: req.body.client_certificate,
    map_as_child: req.body.map_as_child,
    status: req.body.status,
    action: req.body.action,
    created_date: req.body.created_date,
    createdby: req.body.createdby,
    modify_date: req.body.modify_date,
    modifyby: req.body.modifyby,
    updated_at:req.body.updated_at
  });

  // Save Customer in the database
  UserCharging.revokeChargerAccessBLE(userCharging, (err, data) => {

    res.send(data);
  });
};

exports.getEndUserDetailsByMobile = (req, res) => {
  let mobile = req.params.mobile;
  UserCharging.getEndUserDetailsByMobile(mobile, (err, data) => {
    res.send(data);
  })
}


exports.ChargerRenewalRequestBle = async (req, res) => {

  try {

    // return res.status(201).send({
    //     images: req.files,s
    //     message: 'Images uploaded successfully'
    // });

    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // await upload(req, res);


    const userProfile = new UserCharging({

      user_id: req.body.user_id,
      charger_id: req.body.charger_id,
      mobile: req.body.mobile,
      address1: req.body.address1,
      address2: req.body.address2,
      PIN: req.body.pin,
      landmark: req.body.landmark,
      country_id: req.body.country_id,
      city_id: req.body.city_id,
      state_id: req.body.state_id,
      request_type: req.body.request_type,
      created_by: req.body.user_id
    });

    UserCharging.ChargerRenewalRequestBle(userProfile, req, (err, data) => {
      if (err)
        res.status(500).send({
          message: err
        });

      else res.send(data);
    });



  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error! Try again, please!' })
  }
}

exports.createUserMenu = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const userMenu = new UserMenu({
    client_id: req.body.client_id,
    user_id: req.body.role_id,
    menu_id: req.body.menu_id,
    display_order: req.body.display_order,
    menus: req.body.menus,
    status: req.body.status,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modify_date: req.body.modify_date,
    modify_by: req.body.modify_by
  });

  UserMenu.createUserMenu(userMenu, (err, data) => {
    res.send(data);
  });
};

exports.userChargingHistoryBle = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  User.userChargingHistoryBle(req.body).then(response => {
    res.send(response);
  });
};


exports.userChargingSummaryBle = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  User.userChargingSummaryBle(req.body).then(response => {
    res.send(response);
  });
};



exports.userChargingSummaryBleMode = (req, res) => {
  //;
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  User.userChargingSummaryBleMode(req.body).then(response => {
    res.send(response);
  });
};

exports.GetMonthlyStatisticsList = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  User.GetMonthlyStatisticsList(req.body).then(response => {
    res.send(response);
  });
};



exports.getUserByMobileAndEmail = (req, res) => {
  //;
  let resp;
  let validated=false;

  if (!Object.keys(req.body).length) {
   resp={ status:false,
    err_code:'ERROR:1',
    message:'Please provide body parameters!'
   };
   res.status(200).send(resp);
    return;
  }else if(!req.body.key ){
    resp={
      status:false,
      err_code:'ERROR:1',
      message:`Please provide key's parameter value  in body!`
    }
    res.status(200).send(resp);
    return;
  }else{
    if(req.body.key=='BOTH'){
      if((!req.body.mobile || req.body.mobile !=='undefined') && (!req.body.email || req.body.mobile !=='undefined')){
            resp={
              status:false,
              err_code:'ERROR:!',
              message:'Please provide Email_id & Mobile_no!'
            }
            res.status(200).send(resp);
            return;
           }
           validated=true;  
    }
    if(req.body.key=='MOBILE'){
      if(!req.body.mobile){
            resp={
              status:false,
              err_code:'ERROR:1',
              message:'Please provide Mobile_no!'
            }
            res.status(200).send(resp);
            return;
          }
        validated=true;
    }
    if(req.body.key=='EMAIL'){
      if(!req.body.email){
            resp={
              status:false,
              err_code:'ERROR:!',
              message:'Please provide Email_id!'
            }
            res.status(200).send(resp);
            return;
          }
      validated=true;
    }

    if(validated){
      const user = new User({
        mobile:req.body.mobile,
        email:req.body.email,
        key:req.body.key
      })
      
      User.getUserByMobileAndEmail(user,(err,data)=> {
        res.send(data);
      });
    }
  }}

  exports.getUserNotificationList = (req, res) => {
    let user_id = req.params.user_id;
    User.getUserNotificationList(user_id,(err,data) => {
      res.send(data);
    });
  };

  exports.updateUSerNotificationStatus = (req, res) => {
    let id = req.params.id;
    User.updateUSerNotificationStatus(id,(err,data) => {
      res.send(data);
    });
  };


  




