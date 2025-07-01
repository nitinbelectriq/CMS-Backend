const CurrentType = require("../models/current-type.model.js");

exports.findAll = async (req, res) => {
  try {
   
    const data = await CurrentType.getAll();

    if (!data.length) {
      return res.status(404).send({
        status: false,
        err_code: 'ERROR : 404',
        message: "No current types found.",
        count: 0,
        data: []
      });
    }

    res.send({
      status: true,
      err_code: 'ERROR : 0',
      message: "SUCCESS",
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      err_code: `ERROR : ${err.code || 'UNKNOWN'}`,
      message: err.message || "Some error occurred while retrieving current types.",
      count: 0,
      data: []
    });
  }
};
