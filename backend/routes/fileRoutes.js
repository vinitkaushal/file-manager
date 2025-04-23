const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    uploadFile,
    sseProgress,
    viewFile,
    deleteFile
} = require('../controllers/fileController');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/progress', sseProgress);
router.get('/view/:id', viewFile);
router.delete('/delete/:id', deleteFile);

module.exports = router;
