const { authenticateUser } = require("../middleware/authentication.js");
const { checkToken } = require('../middleware/jwt.js')

module.exports = app => {
    const booking = require("../controllers/booking.controller");

    // login to get token
    // app.post("/booking/getCallHistory",checkToken, booking.getCallHistory);
    app.get("/booking/getAvailableTimeInterval/:station_id/:date/:charger_id/:connector_no",checkToken, booking.getAvailableTimeInterval);
    app.post("/booking/getBookingHistory",checkToken, booking.getBookingHistory);
    app.get("/booking/getBookingById/:id",checkToken, booking.getBookingById);
    app.post("/booking/create",checkToken, booking.create);

    app.post("/booking/ackBookingCW",checkToken, booking.updateBookingStatus);
    app.post("/booking/getPendingBookingsCW",checkToken, booking.getPendingBooking);
    app.post("/booking/allBookingsCW",checkToken, booking.allBookingsCW);
    // app.post("/booking/closeRequest",checkToken, booking.closeRequest);
    

    app.get("/booking/getAllBookingConfigList",checkToken, booking.getAllBookingConfigList);
    app.post("/booking/createBookingConfig",checkToken, booking.createBookingConfig);
    app.post("/booking/updateBookingConfig",checkToken, booking.updateBookingConfig);
    app.delete("/booking/deleteBookingConfig/:id/:modify_by",checkToken, booking.deleteBookingConfig);

};