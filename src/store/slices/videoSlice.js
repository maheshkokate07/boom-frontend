import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Slice for fetch videos
export const fetchVideos = createAsyncThunk(
    "videos/fetchVideos",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.auth?.user?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/video/all`, config);
            return response.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch videos"
            );
        }
    }
);

const videoSlice = createSlice({
    name: "videos",

    // Initial state for vidoes in redux
    initialState: {
        videos: [],
        loading: false,
        error: null
    },
    reducers: {
        // On reset video set videos empty in state
        resetVideos: (state) => {
            state.videos = { videos: [] };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.videos = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
});

export const { resetVideos } = videoSlice.actions;
export default videoSlice.reducer;