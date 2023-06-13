const mongoose = require('mongoose');

const Schema = mongoose.Schema;const Room =  require("../models/Room");
const ObjectId = Schema.ObjectId;
// console.log(ObjectId);

let room = new Room({
    name: '202',
    type: 'double',
    price: 200,
    status: 'available',
    description: 'This is double room',
    image: 'img2.png'
})

mongoose.connect('mongodb://localhost:27017/hotel', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    room.save()
    console.log('ok');
})
.catch(e => console.log('Không thể kết nối tới db server: ' + e.message))


