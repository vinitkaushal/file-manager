const File = require('../models/File');

/**
 * Recursively builds the tree of folders with nested subfolders and files.
 * @param {Array} folders - All folders from DB
 * @param {Array} allFiles - All files from DB
 * @param {ObjectId|null} parentId - The parent folder ID (or null for root)
 * @returns Array of folder trees
 */
const buildChildrenTree = async (folders, files, parentId, allowedFolderIds) => {
    const childrenFolders = folders.filter(
        folder => String(folder.parent) === String(parentId) && allowedFolderIds.has(String(folder._id))
    );

    const result = [];

    for (const folder of childrenFolders) {
        const folderFiles = files.filter(file => String(file.folder) === String(folder._id));
        const children = await buildChildrenTree(folders, files, folder._id, allowedFolderIds);

        result.push({
            _id: folder._id,
            name: folder.name,
            description: folder.description,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            isFile: false,
            files: folderFiles,
            children,
            count: folderFiles.length + children.length
        });
    }

    return result;
};
module.exports = buildChildrenTree;
