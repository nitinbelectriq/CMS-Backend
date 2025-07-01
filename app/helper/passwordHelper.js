const bcrypt = require("bcryptjs");

hash = input => {
  debugger
  return new Promise((resolve, reject) => {
    debugger;
    bcrypt.hash(input, 10, (err, val) => {
      resolve(val);
    });
  });
};

compare = (pass1, pass2) => {
  return new Promise((resolve, reject) => {
    debugger
    bcrypt.compare(pass1, pass2, (err, val) => {
      debugger
      resolve(val);
    });
  });
}

module.exports = {
  hash,
  compare
};
