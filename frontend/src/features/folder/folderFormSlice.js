import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    description: '',
    parentFolderId: ''
};

const folderFormSlice = createSlice({
    name: 'folderForm',
    initialState,
    reducers: {
        setFolderName: (state, action) => {
            state.name = action.payload;
        },
        setFolderDescription: (state, action) => {
            state.description = action.payload;
        },
        setParentFolderId: (state, action) => {
            state.parentFolderId = action.payload;
        },
        resetFolderForm: (state) => {
            state.name = '';
            state.description = '';
            state.parentFolderId = null;
        }
    }
});

export const { setFolderName, setFolderDescription, resetFolderForm, setParentFolderId } = folderFormSlice.actions;
export default folderFormSlice.reducer;
