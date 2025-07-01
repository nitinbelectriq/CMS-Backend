const {sql,pool} = require("./db.js");

const ChargerMonitoring = function(cpo) {
  this.id = cpo.id ,
  this.client_id = cpo.client_id ,
  this.name = cpo.name ,
  this.description = cpo.description,
  this.address = cpo.address,
  this.logoPath = cpo.logoPath,
  this.mobile = cpo.mobile,
  this.email = cpo.email,
  this.cp_name = cpo.cp_name,
  this.status = cpo.status ,
  this.created_date = cpo.created_date ,
  this.created_by = cpo.created_by,
  this.modify_date = cpo.modify_date ,
  this.modify_by = cpo.modify_by
};

ChargerMonitoring.getMenus = result => {

    let stmt = `select id, name, description , status,created_date, createdby
      from charger_monitoring_menu_mst 
      where status <> 'D'
      order by display_order`;

      sql.query(stmt, (err, res) => {
          if (err) {
            result(err, null);
            return;
          }

          if (res.length) {
            result(null, res);
            return;
          }

          result({ kind: "not_found" }, null);
        });
  };

ChargerMonitoring.getAvailabilityType = result => {
      let res =[{
          name : 'Inoperative'
        },
        {
          name : 'Operative'
        }] 

      if (res.length) {
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
  };

 

module.exports = {
  ChargerMonitoring: ChargerMonitoring
};