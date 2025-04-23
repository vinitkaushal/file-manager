const Folder = require('../models/Folder');
const File = require('../models/File');
const buildChildrenTree = require('../utils/buildChildrenTree');

// Get paginated + filtered folder and file hierarchy
exports.getHierarchy = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            name,
            description,
            date
        } = req.body;

        const skip = (page - 1) * limit;

        let allFolders = await Folder.find();
        let allFiles = await File.find();

        const nameRegex = name ? new RegExp(name, 'i') : null;
        const descRegex = description ? new RegExp(description, 'i') : null;
        let dateStart, dateEnd;

        if (date) {
            dateStart = new Date(date);
            dateEnd = new Date(dateStart);
            dateEnd.setDate(dateStart.getDate() + 1);
        }

        const matchedFolders = allFolders.filter(folder => {
            return (!nameRegex || nameRegex.test(folder.name)) &&
                (!descRegex || descRegex.test(folder.description || '')) &&
                (!dateStart || (new Date(folder.createdAt) >= dateStart && new Date(folder.createdAt) < dateEnd));
        });

        const matchedFiles = allFiles.filter(file => {
            return (!nameRegex || nameRegex.test(file.name)) &&
                (!descRegex || descRegex.test(file.description || '')) &&
                (!dateStart || (new Date(file.createdAt) >= dateStart && new Date(file.createdAt) < dateEnd));
        });

        const matchedFolderIds = new Set(matchedFolders.map(f => String(f._id)));
        const matchedFileFolderIds = new Set(matchedFiles.map(f => f.folder ? String(f.folder) : null));

        const allFolderMap = new Map(allFolders.map(f => [String(f._id), f]));
        const allowedFolderIds = new Set();

        const addAncestors = (id) => {
            if (!id || allowedFolderIds.has(id)) return;
            allowedFolderIds.add(id);
            const folder = allFolderMap.get(id);
            if (folder && folder.parent) addAncestors(String(folder.parent));
        };

        for (const id of [...matchedFolderIds, ...matchedFileFolderIds]) {
            if (id) addAncestors(id);
        }

        const rootFolders = allFolders
            .filter(folder => folder.parent === null && allowedFolderIds.has(String(folder._id)))
            .filter(folder => {
                return (!nameRegex || nameRegex.test(folder.name)) &&
                    (!descRegex || descRegex.test(folder.description || '')) &&
                    (!dateStart || (new Date(folder.createdAt) >= dateStart && new Date(folder.createdAt) < dateEnd));
            })
            .map(folder => ({
                type: 'folder',
                data: folder
            }));

        const topFiles = allFiles
            .filter(file => file.isParentFile && (!file.folder || file.folder === null))
            .filter(file => {
                return (!nameRegex || nameRegex.test(file.name)) &&
                    (!descRegex || descRegex.test(file.description || '')) &&
                    (!dateStart || (new Date(file.createdAt) >= dateStart && new Date(file.createdAt) < dateEnd));
            })
            .map(file => ({
                type: 'file',
                data: file
            }));

        const combined = [...rootFolders, ...topFiles]
            .sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

        const total = combined.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = combined.slice(skip, skip + parseInt(limit));

        const hierarchy = [];

        for (const item of paginated) {
            if (item.type === 'folder') {
                const folder = item.data;
                const filesInFolder = allFiles.filter(
                    file => String(file.folder) === String(folder._id)
                );
                const children = await buildChildrenTree(allFolders, allFiles, folder._id, allowedFolderIds);

                hierarchy.push({
                    _id: folder._id,
                    name: folder.name,
                    description: folder.description,
                    createdAt: folder.createdAt,
                    updatedAt: folder.updatedAt,
                    isFile: false,
                    files: filesInFolder,
                    children,
                    count: filesInFolder.length + children.length
                });
            } else if (item.type === 'file') {
                const file = item.data;
                hierarchy.push({
                    _id: file._id,
                    name: file.name,
                    description: '',
                    createdAt: file.createdAt,
                    updatedAt: file.updatedAt,
                    isFile: true,
                    files: [],
                    children: [],
                    count: 0
                });
            }
        }

        res.json({
            success: true,
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            totalCount: {
                file: allFiles.length,
                folder: allFolders.length
            },
            data: hierarchy
        });
    } catch (err) {
        console.error('Hierarchy Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve folder hierarchy',
            error: err.message
        });
    }
};