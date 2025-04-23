export const normalizeItems = (items) => {
    if (items) {
        return items.map((item) => {
            const children = [];

            if (item.children?.length > 0) {
                children.push(...normalizeItems(item.children));
            }

            if (item.files?.length > 0) {
                children.push(...item.files.map(file => ({
                    ...file,
                    isFile: true,
                    id: file._id,
                })));
            }

            return {
                ...item,
                id: item._id,
                children,
            };
        });
    }
    return []
};
