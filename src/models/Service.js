const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Service = new Schema({
    id: ObjectId,
    name: String,
    price: Number,
    description: String,
});

module.exports = mongoose.model('Service', Service);