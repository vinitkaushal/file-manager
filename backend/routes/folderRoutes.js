const express = require('express');
const router = express.Router();
const { createFolder, editFolder, deleteFolder } = require('../controllers/folderController');

router.post('/create', createFolder);
router.patch('/edit', editFolder);
router.delete('/delete/:id', deleteFolder);

module.exports = router;
