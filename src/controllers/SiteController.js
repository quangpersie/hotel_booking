const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Service = require('../models/Service');

const { mutipleMoongoseToObject } = require('../utils/moongose');
const roomService = require('../services/roomServices');
const userService = require('../services/userServices');
const adminServices = require('../services/adminServices');
const utilStorage = require('../utils/storage')

class SiteController {
    async home(req, res) {
        let role = utilStorage.getItem('role')
        if (role === 'admin') {
            return res.redirect('/admin/user')
        }

        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        // console.log(nameUser, mailUser);
        return res.render('HomePage', { title: 'Home Page', nameUser, mailUser });
    }
}

module.exports = new SiteController();