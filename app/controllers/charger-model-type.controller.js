const ChargerModelType = require("../models/charger-model-type.model.js");


exports.findAll = async (req, res) => {
  try {
    const data = await ChargerModelType.getAll();
    res.send({
      status: true,
      err_code: 'ERROR : 0',
      message: 'SUCCESS',
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      err_code: `ERROR : ${err.code || 'UNKNOWN'}`,
      message: `ERROR : ${err.message || 'Internal Server Error'}`,
      count: 0,
      data: []
    });
  }
};
