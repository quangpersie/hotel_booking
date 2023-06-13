const Room = require('../models/Room');
const Service = require('../models/Service');
const roomServices = require('../services/roomServices')
const { convertStringToDate } = require('../utils/moongose')
const utilStorage = require('../utils/storage');

class ServiceController {
    async searchResult(req, res, next) {
        let role = utilStorage.getItem('role')
        if (role === 'admin') {
            return res.redirect('/admin/user')
        }

        // console.log(req.query);
        let { fromDate, toDate, type, price } = req.query
        if (!price) {
            price = 100000
        }
        if (!fromDate || !toDate || !type) {
            return next()
        } else {
            let from = convertStringToDate(fromDate)
            let to = convertStringToDate(toDate)
            if (fromDate >= toDate) {
                return res.redirect(`/service/search-result?fromDate=${req.session.flash_from}&&toDate=${req.session.flash_to}&&type=${req.session.flash_room}`)
            }
            req.session.flash_from = fromDate
            req.session.flash_to = toDate
            req.session.flash_room = type

            let dataSearch = []
            let response
            if(type === 'all') {
                response = await roomServices.roomSearchAllTypeWithPrice(from, to, parseInt(price))
            } else {
                response = await roomServices.roomSearch(from, to, type, parseInt(price))
            }
            dataSearch = response.result
            console.log(dataSearch)
            let { flash_from, flash_to, flash_room } = req.session
            let nameUser = utilStorage.getItem('nameUser');
            let mailUser = utilStorage.getItem('mailUser');
            if (dataSearch.length > 0) {
                return res.render('SearchResult', { title: 'Search Result', nameUser, mailUser, dataSearch, flash_from, flash_to, flash_room, price })
            } else {
                return res.render('SearchResult', { title: 'Search Result', nameUser, mailUser, flash_from, flash_to, flash_room, price })
            }
        }
    }

    async confirmBooking(req, res) {
        let role = utilStorage.getItem('role')
        if (role === 'admin') {
            return res.redirect('/admin/user')
        }

        let { flash_from, flash_to, flash_room } = req.session
        if (!flash_from || !flash_to || !flash_room) {
            return res.redirect('/')
        }
        let serviceData = []
        let response = await roomServices.getAllServices()
        serviceData = response.result
        // console.log('serviceData:', serviceData);
        let room_price = utilStorage.getItem('room_price')
        let curCus = JSON.parse(utilStorage.getItem('curCustomer'))
        // console.log('curCustomer:', curCus)
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        let cusId = utilStorage.getItem('idUser')
        let roomId = utilStorage.getItem('room_id');

        let roomType = utilStorage.getItem('room_type');

        if (curCus) {
            res.render('ConfirmBooking', { title: 'Confirm Booking', nameUser, mailUser, cusId, roomId, flash_from, flash_to, roomType, serviceData, room_price, curCus })
        } else {
            res.render('ConfirmBooking', { title: 'Confirm Booking', nameUser, mailUser, cusId, roomId, flash_from, flash_to, roomType, serviceData, room_price })
        }
    }

    async historyBooking(req, res) {
        let role = utilStorage.getItem('role')
        if (role !== 'user') {
            if (role == 'admin') {
                return res.redirect('/admin/user')
            }
            return res.redirect('/')
        }

        let rooms = await Room.find({}).lean()
        let services = await Service.find({}).lean()
        utilStorage.setItem('dataHbsRooms', JSON.stringify(rooms))
        utilStorage.setItem('dataHbsServices', JSON.stringify(services))
        // console.log('r:', utilStorage.getItem('dataHbs'))

        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        let cusId = utilStorage.getItem('idUser');
        let response = await roomServices.getHistoryBooking(cusId)
        let hitories = []
        if (response.success) {
            hitories = response.result
        }
        if (hitories.length > 0) {
            res.render('HistoryBooking', { title: 'History Booking', nameUser, mailUser, hitories })
        } else {
            res.render('HistoryBooking', { title: 'History Booking', nameUser, mailUser })
        }
    }

    async bookingSuccess(req, res) {
        let role = utilStorage.getItem('role')
        if (role == 'admin') {
            return res.redirect('/admin/user')
        }

        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        let { flash_from, flash_to, flash_room } = req.session
        let curBooking = utilStorage.getItem('curBooking')
        curBooking = JSON.parse(curBooking)
        console.log('curBooking:', curBooking);

        if (!flash_from || !flash_to || !flash_room || !curBooking) {
            return res.redirect('/')
        }

        let roomType = utilStorage.getItem('room_type');

        return res.render('BookingSuccess', { title: 'Booking Success', nameUser, mailUser, flash_from, flash_to, roomType, curBooking })
    }

    async createBooking(req, res) {
        console.log('create booking:', req.body);
        let { customerId, roomId, checkInDate, checkOutDate, price, services, name, phone, idCard, address } = req.body
        if (!name || !phone || !idCard || !address || !checkInDate || !checkOutDate || !price || !services) {
            return res.json({ code: 2, message: 'Missing parameter !', data: [] })
        }
        
        if (!customerId) {
            customerId = null;
        }
        checkInDate = convertStringToDate(checkInDate)
        checkOutDate = convertStringToDate(checkOutDate)
        services = JSON.parse(services)
        price = parseInt(price)

        let response = await roomServices.bookingRoom({ customerId, roomId, checkInDate, checkOutDate, price, services, name, phone, idCard, address })
        if (response.success) {
            utilStorage.setItem('curBooking', JSON.stringify(response.result))
            return res.json({ code: 0, message: 'Booking success !', data: response.result })
        } else {
            return res.json({ code: 1, message: 'Booking fail, try again !', data: response.error })
        }
    }

    async detailRoom(req, res, next) {
        // console.log(req.params)
        let { flash_from, flash_to, flash_room } = req.session
        if (!flash_from || !flash_to || !flash_room) {
            return res.redirect('/')
        }
        const { id } = req.params
        if (!id) {
            return next()
        } else {
            let response = await roomServices.getDetailRoom(id)
            let roomDetail = {
                name: '',
                type: '',
                price: '',
                status: '',
                description: '',
                image: ''
            }
            if (response.success === true) {
                roomDetail = response.result
            }
            // console.log(roomDetail)
            let nameUser = utilStorage.getItem('nameUser');
            let mailUser = utilStorage.getItem('mailUser');
            
            res.render('RoomDetail', { title: 'Room Detail', roomDetail, flash_from, flash_to, flash_room, nameUser, mailUser })
        }
    }

    writePriceAndIdForRoom(req, res) {
        console.log(req.query);
        let { price, id, type } = req.query
        if (price) {
            utilStorage.setItem('room_price', price)
        }
        if (id) {
            utilStorage.setItem('room_id', id)
        }
        if (type) {
            utilStorage.setItem('room_type', type)
        }
    }
}

module.exports = new ServiceController();