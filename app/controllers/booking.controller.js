const { Booking, BookingConfig } = require("../models/booking.model");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(200).send({
            status: false,
            message: "Invalid Input",
        });
    } else {
        Booking.create(req.body, (err, data) => {
            res.send(data);
        });
    }
}

exports.getAvailableTimeInterval = (req, res) => {
    Booking.getAvailableTimeInterval(req.params, (err, data) => {
        res.send(data);
    });
}
exports.getBookingHistory = (req, res) => {
    if(!req.body){
        res.status(200).send({
            status : false,
            message : 'parameter not provided'
        })
    }else{
        Booking.getBookingHistory(req.body, (err, data) => {
            res.send(data);
        });
    }

}

exports.getBookingById = (req, res) => {
    if(!req.params.id){
        res.status(200).send({
            status : false,
            message : 'id parameter not provided'
        })
    }else{
        Booking.getBookingById(req.params.id, (err, data) => {
            res.send(data);
        });
    }

}

exports.updateBookingStatus = (req, res) => {
    if (!req.body) {
        res.status(200).send({
            status: false,
            message: "Invalid Input",
        });
    } else {
        Booking.UpdateBookingStatus(req.body, (err, data) => {
            res.send(data);
        });
    }
}

exports.getPendingBooking = (req, res) => {
    if(!req.body){
        res.status(200).send({
            status : false,
            message : 'parameter not provided'
        })
    }else{
        Booking.GetPendingBooking(req.body, (err, data) => {
            res.send(data);
        });
    }

}

exports.allBookingsCW = (req, res) => {
    if(!req.body){
        res.status(200).send({
            status : false,
            message : 'parameter not provided'
        })
    }else{
        Booking.allBookingsCW(req.body, (err, data) => {
            res.send(data);
        });
    }

}

exports.getAllBookingConfigList = (req,res) => {

   BookingConfig.getAllBookingConfigList((err,data)=>{
       res.send(data);
   });

}
exports.createBookingConfig = (req,res) => {
 
if(!req.body){
    res.status(400).send({
        message:"Content can not be empty !"
    });
}
const bookingConfig = new BookingConfig({
    station_id : req.body.station_id,
    buffer_time : req.body.buffer_time,
    booking_validity_time : req.body.booking_validity_time,
    min_charging_duration : req.body.min_charging_duration,
    max_charging_duration : req.body.max_charging_duration,
    booking_cancellation_time : req.body.booking_cancellation_time,
    adv_booking_time : req.body.adv_booking_time,
    adv_booking_amount : req.body.adv_booking_amount,
    status : req.body.status,
    created_date : req.body.created_date,
    created_by : req.body.created_by,
    stations : req.body.stations
});
BookingConfig.createBookingConfig(bookingConfig,(err,data)=>{
    res.send(data);
})
}

exports.updateBookingConfig = (req,res) => {
   
if(!req.body){
    res.status(400).send({
        message:"Content can not be empty !"
    });
}
const bookingConfig = new BookingConfig({
    id : req.body.id,
    station_id : req.body.station_id,
    buffer_time : req.body.buffer_time,
    booking_validity_time : req.body.booking_validity_time,
    min_charging_duration : req.body.min_charging_duration,
    max_charging_duration : req.body.max_charging_duration,
    booking_cancellation_time : req.body.booking_cancellation_time,
    adv_booking_time : req.body.adv_booking_time,
    adv_booking_amount : req.body.adv_booking_amount,
    status : req.body.status,
    modify_date : req.body.modify_date,
    modify_by : req.body.modify_by,
    stations:req.body.stations
});
BookingConfig.updateBookingConfig(bookingConfig,(err,data)=>{
    res.send(data);
})
}
exports.deleteBookingConfig = (req, res) => {
    BookingConfig.deleteBookingConfig(req.params.id,req.params.modify_by, (err, data) => {
      res.status(200).send(data);
    });
  };