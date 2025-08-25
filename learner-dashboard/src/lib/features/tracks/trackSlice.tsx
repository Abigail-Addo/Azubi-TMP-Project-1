import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    contact: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    resetPasswordExpiresAt?: string;
    resetPasswordToken?: string;
    description?: string;
    disabled?: boolean;
    location?: string;
    profileImage?: string;
}

export interface Course {
    _id: string;
    admin: string;
    track: string;
    title: string;
    stacks: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Rating {
    _id: string;
    learner: string;
    track: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Track {
    _id: string;
    admin: Admin;
    name: string;
    price: number;
    instructor: string;
    duration: string;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
    courses: Course[];
    ratings: Rating[];
}

interface TrackSliceState {
    tracks: Track[];
    createLoading: boolean;
    fetchAllLoading: boolean;
    fetchOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: TrackSliceState = {
    tracks: [],
    createLoading: false,
    fetchAllLoading: false,
    fetchOneLoading: false,
    editLoading: false,
    deleteLoading: false,
    success: false,
    error: null,
};

// Get All
export const getAllTracks = createAsyncThunk(
    'tracks/getAllTracks',
    async (_, thunkAPI) => {
        try {
            const res = await fetch('/api/tracks');
            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

// Get One
export const getSingleTrack = createAsyncThunk(
    'tracks/getSingleTrack',
    async (trackId: string | null, thunkAPI) => {
        try {
            if (!trackId) throw new Error('No trackId provided');
            const res = await fetch(`/api/tracks?trackId=${trackId}`);
            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

// ==== SLICE ====
export const trackSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTracks.pending, (state) => {
                state.fetchAllLoading = true;
            })
            .addCase(getAllTracks.fulfilled, (state, action) => {
                state.fetchAllLoading = false;
                state.success = true;
                state.tracks = action.payload.tracks;
            })
            .addCase(getAllTracks.rejected, (state, action) => {
                state.fetchAllLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            .addCase(getSingleTrack.pending, (state) => {
                state.fetchOneLoading = true;
            })
            .addCase(getSingleTrack.fulfilled, (state, action) => {
                state.fetchOneLoading = false;
                state.success = true;
                state.tracks = state.tracks.map((trk) =>
                    trk._id === action.payload._id ? action.payload : trk
                );
            })
            .addCase(getSingleTrack.rejected, (state, action) => {
                state.fetchOneLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })
    },
});

export default trackSlice.reducer;
