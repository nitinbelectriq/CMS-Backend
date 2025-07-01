const {sql,pool} = require("./db.js"); 
const AlexaUser = function (alexauser) {
    this.email = alexauser.email;
    this.mobile = alexauser.mobile;
};
 
AlexaUser.findByMobileEmail = (new_value, result) => {
    
    let query =`select um.id,um.username,um.f_name,um.l_name,um.mobile,um.email,um.client_id
    from user_mst_new um
    where um.status = 'Y' and (um.mobile = '${new_value.mobile}' or um.email = '${new_value.email}')`;
    sql.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        if (res.length) {
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};
module.exports = {AlexaUser};