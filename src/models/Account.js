const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Account = new Schema({
    id: ObjectId,
    email: String,
    password: String,
    role: String,
    refreshToken: { type: String, default: '' }
});

module.exports = mongoose.model('Account', Account);