import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export interface Learner {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    contact: string;
    description: string;
    disabled: boolean;
    location: string;
    profileImage: string;
}


export interface LearnerSliceState {
    learner: Learner[];
    createLoading: boolean;
    fetchAllLoading: boolean;
    fetchOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: LearnerSliceState = {
    learner: [],
    createLoading: false,
    fetchAllLoading: false,
    fetchOneLoading: false,
    editLoading: false,
    deleteLoading: false,
    success: false,
    error: null,
};

// Get all learners
export const getAllLearners = createAsyncThunk(
    "learner/getAllLearners",
    async (_, thunkAPI) => {
        try {
            const response = await fetch(`/api/learner`);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Get single learner
export const getSingleLearner = createAsyncThunk(
    "learner/getSingleLearner",
    async (id: string | number | null, thunkAPI) => {
        try {
            if (!id) throw new Error("No learner ID provided");
            const response = await fetch(`/api/learner?learnerId=${id}`);
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Slice
export const learnerSlice = createSlice({
    name: "learner",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all learners
            .addCase(getAllLearners.pending, (state) => {
                state.fetchAllLoading = true;
            })
            .addCase(getAllLearners.fulfilled, (state, action) => {
                state.fetchAllLoading = false;
                state.success = true;
                state.learner = action.payload.learners;
            })
            .addCase(getAllLearners.rejected, (state, action) => {
                state.fetchAllLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // get single learner
            .addCase(getSingleLearner.pending, (state) => {
                state.fetchOneLoading = true;
            })
            .addCase(getSingleLearner.fulfilled, (state, action) => {
                state.fetchOneLoading = false;
                state.success = true;
                state.learner = state.learner.map((l) =>
                    l._id === action.payload._id ? action.payload : l
                );
            })
            .addCase(getSingleLearner.rejected, (state, action) => {
                state.fetchOneLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export default learnerSlice.reducer;
