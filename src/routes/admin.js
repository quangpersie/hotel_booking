const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const {upload} = require('../middlewares/handleUpload')

// render ui page login
router.get('/login', adminController.login);
// xu ly login
router.post('/login', adminController.signin);

// render ui page customer management
router.get('/user', adminController.userAdmin);
// get all customer data
router.post('/history/customer', adminController.dataAllCustomer);

// render ui page room management
router.get('/room', adminController.roomAdmin);
// get all room data
router.post('/history/room', adminController.dataAllRoom);
// xu ly them room
router.post('/room/add', adminController.addRoomAdmin);
// xu ly sua room
router.post('/room/edit', adminController.editRoomAdmin);
// xu ly xoa room
router.post('/room/delete', adminController.deleteRoomAdmin);

// render ui page booking management
router.get('/history', adminController.historyAdmin);
// xu ly them booking
router.post('/history/add', adminController.addhistoryAdmin);
// xu ly sua booking
router.post('/history/edit', adminController.edithistoryAdmin);
// xu ly xoa booking
router.post('/history/delete', adminController.deletehistoryAdmin);

// render ui page service management
router.get('/service', adminController.serviceAdmin);
// xu ly them service
router.post('/service/add', adminController.addServiceAdmin);
// xu ly sua service
router.post('/service/edit', adminController.editServiceAdmin);
// xu ly xoa service
router.post('/service/delete', adminController.deleteServiceAdmin);

// xu ly upload img cho room
router.post('/upload', upload.single('attachment'), (req, res) => {
    res.json({code: 0, message: 'upload executed'})
});

module.exports = router;