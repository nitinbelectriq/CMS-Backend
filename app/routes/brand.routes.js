const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    const brands = require("../controllers/brand.controller.js");
  
    app.get("/brands", brands.findAll);
    app.get("/brands/getAllModerateList", brands.getAllModerateList);
    app.post("/brands/create",checkToken, brands.create);
    app.post("/brands/update",checkToken, brands.update);
    app.post("/brands/publish",checkToken, brands.publish);
    app.post("/brands/moderate",checkToken, brands.moderate);
    app.delete("/brands/delete/:id/:modify_by",checkToken, brands.delete);
  
  };