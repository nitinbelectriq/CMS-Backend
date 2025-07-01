const Manufacturers = require("../models/manufacturer.model.js");

exports.getManufacturers = async (req, res) => {
  try {
    const data = await Manufacturers.getManufacturers();
    res.send({
      status: true,
      err_code: 'ERROR : 0',
      message: 'SUCCESS',
      count: data.length,
      data
    });
  } catch (err) {
    res.send({
      status: false,
      err_code: `ERROR : ${err.code || 'UNKNOWN'}`,
      message: `ERROR : ${err.message || 'Internal Server Error'}`,
      count: 0,
      data: []
    });
  }
};
