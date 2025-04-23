const express = require('express');
const { getHierarchy } = require('../controllers/fileManagerController');
const router = express.Router();

router.post('/', getHierarchy);

module.exports = router;
