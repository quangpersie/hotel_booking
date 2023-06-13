const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Room = require('./Room');
const Customer = require('./Customer');
const Service = require('./Service');


const Booking = new Schema({
    id: Schema.Types.ObjectId,
    customerId: { type: Schema.Types.ObjectId, ref: Customer, default: null },
    roomId: { type: Schema.Types.ObjectId, ref: Room },
    checkInDate: Date,
    checkOutDate: Date,
    price: Number,
    services: [{ type: Schema.Types.ObjectId, ref: Service }],
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    idCard: { type: String, default: '' },
    address: { type: String, default: '' },
    bookingCode: Number,
});

module.exports = mongoose.model('Booking', Booking);