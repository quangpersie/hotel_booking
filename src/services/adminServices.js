const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Account = require('../models/Account');
const Service = require('../models/Service');
const utilPassword = require('../utils/password')
const utilToken = require('../utils/token')
const utilStorage = require('../utils/storage')
const { singleMoongoseToObject, mutipleMoongoseToObject } = require('../utils/moongose');

// Add room
const addRoom = async (data) => {
    try {
        const newRoom = new Room(data);
        await newRoom.save();
        return {
            success: true,
            error: '',
            result: null
        }
    } catch (error) {
        console.log('addRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get all rooms
const getAllRoom = async () => {
    try {
        const listRoom = await Room.find({}).sort({ name: 1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listRoom),
        }
    } catch (error) {
        console.log('getAllRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Update room
const updateRoom = async (data) => {
    try {
        const { name, type, price, description, image, id } = data;
        const roomToUpdate = await Room.findById(id);
        if (!roomToUpdate) {
            return {
                success: false,
                error: 'Not found room !',
                result: []
            }
        }

        roomToUpdate.name = name;
        roomToUpdate.type = type;
        roomToUpdate.price = price;
        roomToUpdate.status = 'available';
        roomToUpdate.description = description;
        roomToUpdate.image = image;
        await roomToUpdate.save();
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('updateRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Delete room by id
const deleteRoom = async (id) => {
    try {
        await Room.findByIdAndDelete(id);
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('deleteRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get all customer
const getAllCustomer = async () => {
    try {
        const listUser = await Customer.find({}).sort({ name: 1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listUser),
        }
    } catch (error) {
        console.log('deleteRoom: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Get all bookings
const getAllBooking = async () => {
    try {
        const listBooking = await Booking.find({}).sort({ bookingCode: -1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listBooking),
        }
    } catch (error) {
        console.log('getAllBooking: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Update booking
const updateBooking = async (data) => {
    try {
        const {
            customerId,
            roomId,
            checkInDate,
            checkOutDate,
            price,
            services,
            name,
            phone,
            idCard,
            address,
            bookingCode,
            id
        } = data;
        const bookingToUpdate = await Booking.findById(id);
        if (!bookingToUpdate) {
            return {
                success: false,
                error: 'Not found room !',
                result: []
            }
        }
        bookingToUpdate.name = name;
        bookingToUpdate.customerId = customerId;
        bookingToUpdate.price = price;
        bookingToUpdate.roomId = roomId;
        bookingToUpdate.services = services;
        bookingToUpdate.checkInDate = checkInDate;
        bookingToUpdate.checkOutDate = checkOutDate;
        bookingToUpdate.phone = phone;
        bookingToUpdate.idCard = idCard;
        bookingToUpdate.address = address;
        bookingToUpdate.bookingCode = bookingCode;
        // bookingToUpdate.bookingCode = Date.now();
        await bookingToUpdate.save();
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('updateBooking: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Delete booking
const removeBooking = async (id) => {
    try {
        await Booking.findByIdAndDelete(id);
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('deleteBooking: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Login admin
const login = async ({ email, password }) => {
    try {
        const user = await Account.findOne({ email });
        // console.log('admin:', user);
        if (user) {
            const result = utilPassword.comparePassword(password, user.password);
            if (result) {
                const { email, password, role } = singleMoongoseToObject(user);
                const accessToken = utilToken.createAccessToken({ email, password });
                const refreshToken = utilToken.createRefreshToken({ email, password });
                user.refreshToken = refreshToken;
                await user.save();

                utilStorage.setItem('nameUser', email);
                utilStorage.setItem('mailUser', 'tdq1711@gmail.com');
                utilStorage.setItem('accessToken', accessToken);
                utilStorage.setItem('role', role);
                return {
                    success: true,
                    error: '',
                    result: []
                }
            } else {
                return {
                    success: false,
                    error: 'Password is incorrect !',
                    result: []
                }
            }
        }

        return {
            success: false,
            error: 'Not found user !',
            result: []
        }
    } catch (error) {
        console.log('error:', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Add service
const addService = async (data) => {
    try {
        const newService = new Service(data);
        await newService.save();
        return {
            success: true,
            error: '',
            result: null
        }
    } catch (error) {
        console.log('addService: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

//  Get all services
const getAllServices = async () => {
    try {
        const listServices = await Service.find({}).sort({ price: 1 });
        return {
            success: true,
            error: '',
            result: mutipleMoongoseToObject(listServices),
        }
    } catch (error) {
        console.log('getAllServices: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Update service
const updateService = async (data) => {
    try {
        const { name, price, description, id } = data;
        const serviceToUpdate = await Service.findById(id);
        if (!serviceToUpdate) {
            return {
                success: false,
                error: 'Not found service !',
                result: []
            }
        }

        serviceToUpdate.name = name;
        serviceToUpdate.price = price;
        serviceToUpdate.description = description;
        await serviceToUpdate.save();
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('updateService: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

// Delete service
const deleteService = async (id) => {
    try {
        await Service.findByIdAndDelete(id);
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('deleteService: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

module.exports = {
    addRoom,
    updateRoom,
    getAllRoom,
    deleteRoom,
    getAllCustomer,
    getAllBooking,
    updateBooking,
    removeBooking,
    login,
    addService,
    updateService,
    deleteService,
    getAllServices
}
