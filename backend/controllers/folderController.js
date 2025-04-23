const Folder = require('../models/Folder');
const File = require('../models/File');
const deleteFolderRecursively = require('../utils/deleteFolderTree');

// Create a new folder
exports.createFolder = async (req, res) => {
    try {
        const { name, parent = null, description = '' } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Folder name is required' });
        }

        const folder = new Folder({ name, parent, description });
        await folder.save();

        res.status(201).json({ success: true, message: 'Folder crated', folder });
    } catch (err) {
        console.error('Create Folder Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create folder',
            error: err.message
        });
    }
};


// Edit folder name and description
exports.editFolder = async (req, res) => {
    try {
        const { name, description, parent } = req.body;

        if (!name && !description && !parent) {
            return res.status(400).json({ success: false, message: 'Nothing to update' });
        }

        const updated = await Folder.findByIdAndUpdate(
            parent,
            { name, description },
            { new: false }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Folder not found' });
        }

        res.json({ success: true, message: 'Folder updated', folder: updated });
    } catch (err) {
        console.error('Edit Folder Error:', err.message);
        res.status(500).json({ success: false, message: 'Update failed', error: err.message });
    }
};

//  Delete folder and all subfolders/files recursively
exports.deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({ success: false, message: 'Folder not found' });
        }

        const error = await deleteFolderRecursively(id);
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'File deletion failed',
                error
            });
        }

        res.json({ success: true, message: 'Folder and its contents deleted' });
    } catch (err) {
        console.error('Delete Folder Error:', err.message);
        res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
    }
};
