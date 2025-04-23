import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import fileReducer from '../features/fetchFilesAndFolders/fetchFilesAndFolders';
import folderFormReducer from '../features/folder/folderFormSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        files: fileReducer,
        folderForm: folderFormReducer
    }
});
