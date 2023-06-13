const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Customer = new Schema({
    id: ObjectId,
    name: String,
    address: String,
    phone: String,
    email: String,
    image: String,
    idCard: String,
});

module.exports = mongoose.model('Customer', Customer);
