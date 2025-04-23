const File = require('../models/File');
const { sendProgress, addClient } = require('../utils/sseManager');
const path = require('path');
const fs = require('fs');


// Upload File
exports.uploadFile = async (req, res) => {
    try {

        let { folder, isParentFile } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        if (folder === 'null' || folder === '') {
            folder = null;
        }
        if (!folder && !isParentFile) {
            return res.status(400).json({ success: false, message: 'Folder ID is required' });
        }
        for (let i = 0; i <= 100; i += 10) {
            sendProgress({ name: req.file.originalname, progress: i });
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        const newFile = new File({
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            isParentFile: isParentFile,
            folder
        });

        await newFile.save();



        res.status(201).json({ success: true, file: newFile });

    } catch (err) {
        console.error('Upload failed:', err.message);
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: err.message
        });
    }
};

// Stream Upload
exports.sseProgress = (req, res) => {

    try {
        addClient(res, req);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to initialize upload progress stream',
            error: err.message
        });
    }
};


// View File in iframe
exports.viewFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found');
        }

        const filePath = path.resolve(file.path);
        const fileName = file.name;

        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error viewing file:', error);
        res.status(500).send('Error viewing file');
    }
};

//  Delete file
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const filePath = path.resolve(file.path.replace(/\\/g, '/'));

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                return res.status(500).json({
                    success: false,
                    message: `File not found on server: ${filePath}`
                });
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: `Failed to delete file from uploads folder`,
                error: err.message
            });
        }

        await File.findByIdAndDelete(id);

        res.json({ success: true, message: 'File deleted successfully' });

    } catch (err) {
        console.error('Delete File Error:', err.message);
        res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
    }
};