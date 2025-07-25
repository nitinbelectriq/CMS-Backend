let jwt = require('jsonwebtoken');
const config = require('../config/jwt');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          status: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken
}