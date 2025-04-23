import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isOpen: false,
        modalType: null,
        sidebarOpen: true,
        selectedFolderId: null,
        openFolders: []
    },
    reducers: {
        showModal: (state, action) => {
            state.isOpen = true;
            state.modalType = action.payload;
        },
        hideModal: (state) => {
            state.isOpen = false;
            state.modalType = "";
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        selectFolder: (state, action) => {
            state.selectedFolderId = action.payload;
        },
        toggleFolderOpen: (state, action) => {
            const id = action.payload;
            if (state.openFolders.includes(id)) {
                state.openFolders = state.openFolders.filter(folderId => folderId !== id);
            } else {
                state.openFolders.push(id);
            }
        }
    }
});

export const { toggleSidebar, showModal, hideModal, selectFolder, toggleFolderOpen } = uiSlice.actions;
export default uiSlice.reducer;
