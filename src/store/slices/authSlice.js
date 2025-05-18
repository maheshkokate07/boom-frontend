import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "../../utils/decodeJwt";
import axios from "axios";

export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async (credentials, { rejectWithValue }) => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials, config);
            console.log(response);
            const { token } = response.data;

            if (!token) return rejectWithValue("Invalid token received from server");

            // Decode token

            const decodedToken = decodeToken(token);

            if (decodedToken) {
                return {
                    token, decodedToken
                }
            }

            return rejectWithValue("Invalid token")
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
)

const authSlice = createSlice({
    name: "auth",

    // Initial redux state for auth
    initialState: {
        user: {
            token: null,
            data: null,
            isAuthenticated: false
        },
        loading: false,
        error: null
    },

    reducers: {
        logout: (state) => {
            state.user.isAuthenticated = false;
            state.user.token = null;
            state.user.data = null;
            state.loading = false;
            state.error = null;
            window.location.href = "/login";
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // login fulfilled store the user token and data in redux state
            .addCase(loginUser.fulfilled, (state, action) => {
                const { token, decodedToken } = action.payload;
                state.user.token = token;
                state.user.isAuthenticated = true;
                state.user.data = decodedToken;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;