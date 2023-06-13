const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const _ = require('lodash');
const { singleMoongoseToObject, mutipleMoongoseToObject } = require('../utils/moongose');
const { default: mongoose } = require('mongoose');

// Function to get all available rooms from date to date
const roomSearch = async (fromDate, toDate, type, price) => {
    try {
        const [bookingResult, roomList] = await Promise.all([await Booking.find({}), await Room.find({ type, price: { $lte: price } }).sort({ name: 1 })]);
        if (bookingResult.length === 0) {
            return {
                success: true,
                error: '',
                result: mutipleMoongoseToObject(roomList)
            };
        } else {
            const result = [];
            _.each(roomList, (room) => {
                const findOne = _.find(bookingResult, { roomId: room._id });
                if (!findOne) {
                    result.push(singleMoongoseToObject(room));
                } else {
                    if (fromDate >= findOne.checkOutDate || toDate <= findOne.checkInDate) {
                        result.push(singleMoongoseToObject(room));
                    }
                }
            });
            return {
                success: true,
                error: '',
                result
            };
        }
    } catch (error) {
        console.log('roomSearch error: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Function to get all available rooms from date to date with all type
const roomSearchAllType = async (fromDate, toDate) => {
    // console.log(fromDate, toDate);
    try {
        const [bookingResult, roomList] = await Promise.all([await Booking.find({}), await Room.find({}).sort({ name: 1 })]);
        if (bookingResult.length === 0) {
            return {
                success: true,
                error: '',
                result: mutipleMoongoseToObject(roomList)
            };
        } else {
            const result = [];
            _.each(roomList, (room) => {
                const findOne = _.find(bookingResult, { roomId: room._id });
                if (!findOne) {
                    result.push(singleMoongoseToObject(room));
                } else {
                    // console.log('>>check each room:', room.name);
                    if (fromDate >= findOne.checkOutDate || toDate <= findOne.checkInDate) {
                        result.push(singleMoongoseToObject(room));
                    }
                }
            });
            return {
                success: true,
                error: '',
                result
            };
        }
    } catch (error) {
        console.log('roomSearch error: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Function to get all available rooms from date to date with all type and filter by price
const roomSearchAllTypeWithPrice = async (fromDate, toDate, price) => {
    try {
        const [bookingResult, roomList] = await Promise.all([await Booking.find({}), await Room.find({ price: { $lte: price } }).sort({ name: 1 })]);
        if (bookingResult.length === 0) {
            return {
                success: true,
                error: '',
                result: mutipleMoongoseToObject(roomList)
            };
        } else {
            const result = [];
            _.each(roomList, (room) => {
                const findOne = _.find(bookingResult, { roomId: room._id });
                if (!findOne) {
                    result.push(singleMoongoseToObject(room));
                } else {
                    // console.log('>>check each room:', room.name);
                    if (fromDate >= findOne.checkOutDate || toDate <= findOne.checkInDate) {
                        result.push(singleMoongoseToObject(room));
                    }
                }
            });
            return {
                success: true,
                error: '',
                result
            };
        }
    } catch (error) {
        console.log('roomSearch error: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get detail of room by id
const getDetailRoom = async (id) => {
    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const result = await Room.findById(id);
            return {
                success: true,
                error: '',
                result: singleMoongoseToObject(result)
            }
        } else {
            return {
                success: false,
                error: 'Id invalid',
                result: []
            }
        }

    } catch (error) {
        console.log('getDetailRoom error: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        };
    }
}

// Create new booking room
const bookingRoom = async (data) => {
    try {
        const bookingCode = Date.now();
        const newBooking = new Booking({ ...data, bookingCode });
        await newBooking.save();
        return {
            success: true,
            error: '',
            result: newBooking
        }
    } catch (error) {
        console.log('bookingRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get all services
const getAllServices = async () => {
    try {
        const listService = await Service.find({}).sort({ price: 1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listService)
        }
    } catch (error) {
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get history booking of user by userId
const getHistoryBooking = async (id) => {
    try {
        const listHistory = await Booking.find({ customerId: id }).sort({ bookingCode: 1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listHistory)
        }
    } catch (error) {
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

module.exports = {
    roomSearch,
    getDetailRoom,
    bookingRoom,
    getAllServices,
    getHistoryBooking,
    roomSearchAllType,
    roomSearchAllTypeWithPrice,
}