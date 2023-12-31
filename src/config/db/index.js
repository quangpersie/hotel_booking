const mongoose = require('mongoose');

// function connet to mongoDB
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hotel');
        console.log('Connect db success !');
    } catch (error) {
        console.log('Connect error: ', error);
    }
}

module.exports = { connect };