import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface EnrollmentState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    transactionUrl: string | null;
}

const initialState: EnrollmentState = {
    loading: false,
    error: null,
    success: false,
    message: null,
    transactionUrl: null,
};

export const enrollTrack = createAsyncThunk(
    "enrollment/enrollTrack",
    async (
        payload: { track: string; amount?: number; paystackCallbackUrl: string },
        thunkAPI
    ) => {
        try {
            const res = await fetch("/api/trackEnrollment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to enroll");
            console.log(data)
            return data;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        resetEnrollmentState(state) {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
            state.transactionUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(enrollTrack.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
                state.transactionUrl = null;
            })
            .addCase(enrollTrack.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.message = action.payload.message;
                state.transactionUrl = action.payload.transactionUrl;
            })
            .addCase(enrollTrack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetEnrollmentState } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
