import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFilesAndFolders = createAsyncThunk(
    'files/fetchFilesAndFolders',
    async (filters, { rejectWithValue }) => {
        const base_URL = import.meta.env.VITE_BASE_URL;
        try {
            const response = await axios.post(`${base_URL}/api/getFilesAndFolders`, filters);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Fetch failed');
        }
    }
);

const filesSlice = createSlice({
    name: 'files',
    initialState: {
        loading: false,
        error: null,
        data: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilesAndFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilesAndFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchFilesAndFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default filesSlice.reducer;
