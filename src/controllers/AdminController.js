const adminServices = require('../services/adminServices');
const userServices = require('../services/userServices')
const roomServices = require('../services/roomServices')
const utilStorage = require('../utils/storage')
const {convertStringToDate} = require('../utils/moongose');
const Customer = require('../models/Customer');
const Room = require('../models/Room');
const Service = require('../models/Service');

class AdminController {
    async roomAdmin(req, res, next) {
        if(utilStorage.getItem('role') !== 'admin') {
            return next()
        }
        let roomsAd = []
        let response = await adminServices.getAllRoom()
        if (response.success) {
            roomsAd = response.result
        }
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        res.render('admin/RoomAdmin', { title: 'Manage Room', roomsAd, nameUser, mailUser });
    }

    async userAdmin(req, res, next) {
        if(utilStorage.getItem('role') !== 'admin') {
            return next()
        }
        let usersAd = []
        let response = await adminServices.getAllCustomer()
        if (response.success) {
            usersAd = response.result
        }

        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        res.render('admin/UserAdmin', { title: 'Manage User', usersAd, nameUser, mailUser });
    }

    async historyAdmin(req, res, next) {
        if(utilStorage.getItem('role') !== 'admin') {
            return next()
        }
        let hisAd = []
        let response1 = await adminServices.getAllBooking()
        hisAd = response1.result
        let serviceData = []
        let response2 = await roomServices.getAllServices()
        serviceData = response2.result
        // console.log('serviceData:', serviceData);
        // console.log(hisAd);
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        res.render('admin/HistoryAdmin', { title: 'Manage Booking', hisAd, serviceData, nameUser, mailUser });
    }

    async addhistoryAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        console.log('add his:', req.body)
        let {customerId} = req.body
        let {roomId, checkInDate, checkOutDate, services} = req.body
        let {name, idCard, phone, address} = req.body

        let data;
        checkInDate = convertStringToDate(checkInDate)
        checkOutDate = convertStringToDate(checkOutDate)
        let room = await Room.findById(roomId).lean()
        // console.log('room 302:', room);
        services = JSON.parse(services)
        // console.log('services:', services);

        let allServices = await Service.find({}).lean()
        utilStorage.setItem('allServices', JSON.stringify(allServices))
        let price = 0
        if(room) {
            let numDate = checkOutDate.getDate() - checkInDate.getDate()
            price = numDate * room.price

            let allSers = JSON.parse(utilStorage.getItem('allServices'))
            services.forEach(el => {
                allSers.forEach(a => {
                    if(el === a._id.toString()) {
                        price += a.price
                    }
                })
            });
        }
        // console.log('price:', price);
        if(!customerId) {
            customerId = null
            data = {customerId, name, idCard, phone, address, roomId, checkInDate, checkOutDate, services, price}
        } else {
            let cusInfo = await Customer.findById(customerId).lean()
            if(cusInfo) {
                console.log('cusInfo:', cusInfo);
                data = {customerId, roomId, name: cusInfo.name, idCard: cusInfo.idCard, phone: cusInfo.phone, address: cusInfo.address, checkInDate, checkOutDate, services, price}
            }
        }
        // console.log('data book:', data);
        let response = await roomServices.bookingRoom(data)
        if(response.success) {
            return res.json({code: 0, message: 'Create booking success'})
        } else {
            return res.json({code: 1, message: 'Create booking fail'})
        }
    }

    async dataAllRoom(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        let {fromDate, toDate} = req.body
        
        if(!fromDate || !toDate) {
            return res.json({code: 3, message: 'Missing param', data: []})
        }
        fromDate = convertStringToDate(fromDate)
        toDate = convertStringToDate(toDate)
        
        let allRoom = await roomServices.roomSearchAllType(fromDate, toDate)
        if(allRoom.success) {
            return res.json({code: 0, message: 'All data for available room', data: allRoom.result})
        } else {
            return res.json({code: 1, message: 'Faild to get data for available room', data: []})
        }
    }

    async dataAllCustomer(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        let allCus = await adminServices.getAllCustomer()
        if(allCus.success) {
            return res.json({code: 0, message: 'All data for customer', data: allCus.result})
        } else {
            return res.json({code: 1, message: 'Faild to get data for customer', data: []})
        }
    }

    async edithistoryAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        let {customerId, id, bookingCode} = req.body
        let {roomId, checkInDate, checkOutDate, services} = req.body
        let {name, idCard, phone, address} = req.body

        checkInDate = convertStringToDate(checkInDate)
        checkOutDate = convertStringToDate(checkOutDate)
        let room = await Room.findById(roomId).lean()
        services = JSON.parse(services)
        let allServices = await Service.find({}).lean()
        utilStorage.setItem('allServices', JSON.stringify(allServices))
        let price = 0
        if(room) {
            let numDate = checkOutDate.getDate() - checkInDate.getDate()
            price = numDate * room.price

            let allSers = JSON.parse(utilStorage.getItem('allServices'))
            services.forEach(el => {
                allSers.forEach(a => {
                    if(el === a._id.toString()) {
                        price += a.price
                    }
                })
            });
        }

        let data;
        if(!customerId) {
            customerId = null
            data = {id, customerId, name, idCard, phone, address, roomId, checkInDate, checkOutDate, services, price, bookingCode}
        } else {
            let cusInfo = await Customer.findById(customerId).lean()
            if(cusInfo) {
                console.log('cusInfo:', cusInfo);
                name = cusInfo.name
                idCard = cusInfo.idCard
                phone = cusInfo.phone
                address = cusInfo.address
                data = {id, customerId, roomId, name, idCard, phone, address, checkInDate, checkOutDate, services, price, bookingCode}
            }
        }

        if(!roomId || !checkInDate || !checkOutDate || !services || !name || !idCard || !phone || !address || !price || !id) {
            return res.json({code: 3, message: 'Missing param'})
        }

        let response = await adminServices.updateBooking(data)
        if(response.success) {
            return res.json({code: 0, message: 'Update booking success'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

    async deletehistoryAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        // console.log(req.body);
        const {id} = req.body
        if(!id) {
            return res.json({code: 3, message: 'Missing id parameter'})
        }
        let response = await adminServices.removeBooking(id)
        if(response.success) {
            return res.json({code: 0, message: 'Delete booking successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }
    
    async editRoomAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        // console.log(req.body);
        let response = await adminServices.updateRoom(req.body)
        if(response.success) {
            return res.json({code: 0, message: 'Update room successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

    async addRoomAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        // console.log(req.body);
        let response = await adminServices.addRoom(req.body)
        if(response.success) {
            return res.json({code: 0, message: 'Add room successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }
    
    async deleteRoomAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        // console.log(req.body);
        const {id} = req.body
        if(!id) {
            return res.json({code: 3, message: 'Missing id parameter'})
        }
        let response = await adminServices.deleteRoom(req.body)
        if(response.success) {
            return res.json({code: 0, message: 'Delete room successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

    login(req, res) {
        let role = utilStorage.getItem('role')
        if (role === 'admin') {
            return res.redirect('/admin/user')
        }
        return res.render('admin/SignInAdmin', {title: 'Sign In Admin'})
    }

    async signin(req, res) {
        let { email, password } = req.body
        // console.log(email, password);
        let msg = ''
        if (!email) {
            msg = 'Missing admin name parameter!'
        } else if (email !== 'admin') {
            msg = 'Wrong name of admin!'
        } else if (!password) {
            msg = 'Missing password parameter!'
        } else if (password.length < 6) {
            msg = 'Password must be at least 6 characters'
        }

        if (msg.length > 0) {
            res.render('admin/SignInAdmin', { title: 'Sign In Admin', email, password, alert: msg })
        } else {
            req.session.destroy()
            utilStorage.clearItem()
            
            let response = await adminServices.login(req.body)
            // console.log('response:', response);
            if (response.success) {
                res.redirect('/admin/user')
            } else {
                msg = response.error
                res.render('admin/SignInAdmin', { title: 'Sign In Admin', alert: msg })
            }
        }
    }

    async serviceAdmin(req, res, next) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        let servicesAd = [];
        let response = await adminServices.getAllServices();
        // console.log(response);
        if(response.success){
            servicesAd = response.result;
        }
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        return res.render('admin/ServiceAdmin', {title: 'Service Admin', servicesAd, nameUser, mailUser});
    }
    async addServiceAdmin(req, res) {
        let response = await adminServices.addService(req.body)
        if(response.success) {
            return res.json({code: 0, message: 'Add service successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

    async editServiceAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        let response = await adminServices.updateService(req.body);
        if(response.success) {
            return res.json({code: 0, message: 'Update service successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

    async deleteServiceAdmin(req, res) {
        if(utilStorage.getItem('role') !== 'admin') {
            return res.json({code: 2, message: 'Not permitted to call'})
        }
        const {id} = req.body;
        if(!id) {
            return res.json({code: 2, message: 'Missing id parameter'})
        }
        let response = await adminServices.deleteService(id)
        console.log('del ser', response);
        if(response.success) {
            return res.json({code: 0, message: 'Delete service successfully'})
        } else {
            return res.json({code: 1, message: response.error})
        }
    }

}
module.exports = new AdminController();