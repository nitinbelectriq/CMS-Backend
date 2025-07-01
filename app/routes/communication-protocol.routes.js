module.exports = app => {

    const CommunicationProtocol = require("../controllers/communication-protocol.controller.js");

    //get All communication protocols
    app.get("/communication_protocol/getCommunicationProtocols", CommunicationProtocol.findAll);
};