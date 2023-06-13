const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');

// render home page
router.get('/', siteController.home);

module.exports = router;