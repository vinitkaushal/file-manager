const Folder = require('../models/Folder');
const File = require('../models/File');
const fs = require('fs');
const path = require('path');

/**
 * Recursively deletes a folder, its subfolders, and all files inside them.
 * @param {ObjectId} folderId
 */
const deleteFolderRecursively = async (folderId) => {
    const subfolders = await Folder.find({ parent: folderId });
    for (const sub of subfolders) {
        const error = await deleteFolderRecursively(sub._id);
        if (error) return error;
    }

    const files = await File.find({ folder: folderId });

    for (const file of files) {
        const filePath = path.resolve(file.path.replace(/\\/g, '/'));

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                return `File not found: ${filePath}`;
            }
        } catch (err) {
            return `Error deleting file: ${filePath}, ${err.message}`;
        }
    }

    await File.deleteMany({ folder: folderId });
    await Folder.findByIdAndDelete(folderId);

    return null;
};

module.exports = deleteFolderRecursively;