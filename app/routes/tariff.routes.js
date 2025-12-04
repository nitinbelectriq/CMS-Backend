const { checkToken } = require('../middleware/jwt.js');
const tariffController = require('../controllers/tariff.controller.js');

module.exports = app => {

  // 👉 Create new tariff
  app.post("/tariff/create", checkToken, tariffController.create);

  // 👉 Update tariff
  app.put("/tariff/update/:id", checkToken, tariffController.update);

  // 👉 Get all tariffs (for dropdown/list)
  app.get("/tariff/list/:login_id", checkToken, tariffController.getAll);

  // 👉 Get single tariff by ID
  app.get("/tariff/:id", checkToken, tariffController.getById);

  // 👉 Soft delete tariff
  app.delete("/tariff/delete/:id", checkToken, tariffController.delete);

  // 👉 Tariff–Station mapping
  app.post("/tariff/mapping/create", checkToken, tariffController.createMapping);
  app.get("/tariff/mapping/list", checkToken, tariffController.getMappingList);
  app.get("/tariff/mapping/:id", checkToken, tariffController.getMappingById);
  app.delete("/tariff/mapping/delete/:id", checkToken, tariffController.deleteMapping);
 app.put("/tariff/mapping/update/:id", checkToken, tariffController.updateMapping);

  // 👉 Stations for tariff mapping dropdown
  app.get(
    "/tariff/stations/list/:login_id",
    checkToken,
    tariffController.getStationsForTariffMapping
  );
};
