const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Room = new Schema({
    id: ObjectId,
    name: String,
    type: String,
    price: Number,
    status: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Room', Room);