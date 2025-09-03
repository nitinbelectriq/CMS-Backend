const bcrypt = require("bcryptjs");

hash = input => {
  //
  return new Promise((resolve, reject) => {
    //;
    bcrypt.hash(input, 10, (err, val) => {
      resolve(val);
    });
  });
};

compare = (pass1, pass2) => {
  return new Promise((resolve, reject) => {
    //
    bcrypt.compare(pass1, pass2, (err, val) => {
      //
      resolve(val);
    });
  });
}

module.exports = {
  hash,
  compare
};
