const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/ServiceController');
const {verifyAccessToken} = require('../middlewares/index')

// write value to local storage for using after
router.get('/write-price-id', serviceController.writePriceAndIdForRoom);
// render ui of search result page
router.get('/search-result', serviceController.searchResult);
// render ui of room detail using id param
router.get('/room-detail/:id', serviceController.detailRoom);
// render ui of confirm booking page
router.get('/confirm-booking', serviceController.confirmBooking);
// xu ly create booking page
router.post('/confirm-booking', serviceController.createBooking);
// render ui of booking success page
router.get('/booking-success', serviceController.bookingSuccess);
// render ui of history booking
router.get('/history-booking', verifyAccessToken, serviceController.historyBooking);

module.exports = router;