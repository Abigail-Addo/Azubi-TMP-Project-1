import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define types
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

export interface Track {
    id: string;
    name: string;
    price: number;
    instructor: string;
    duration: string;
    description: string;
    image: string;
    admin: Admin;
}

interface Course {
    _id: string;
    track: Track;
    title: string;
    admin: Admin;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

// Slice State
export interface CourseSliceState {
    course: Course[];
    createLoading: boolean;
    fetchAllLoading: boolean;
    fetchOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: CourseSliceState = {
    course: [],
    createLoading: false,
    fetchAllLoading: false,
    fetchOneLoading: false,
    editLoading: false,
    deleteLoading: false,
    success: false,
    error: null,
};

// asyncthunk to fetch all course
export const getAllCourses = createAsyncThunk(
    "course/getAllCourses",
    async (_, thunkAPI) => {
        try {

            const response = await fetch(`/api/courses`);
            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                return thunkAPI.rejectWithValue(data.message);
            }
            console.log(data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// asyncthunk to create course
export const createCourse = createAsyncThunk(
    "course/createCourse",
    async (formData: FormData, thunkAPI) => {
        try {
            const response = await fetch("/api/courses", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                return thunkAPI.rejectWithValue(data.message);
            }

            return data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);


// asyncthunk to fetch a single course by id
export const getSingleCourse = createAsyncThunk(
    "course/getSingleCourse",
    async (courseId: string | number | null, thunkAPI) => {
        try {
            if (!courseId) throw new Error("No course  provided");

            const response = await fetch(`/api/courses?courseId=${courseId}`);
            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(data.message);
            }

            console.log(data);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// asyncthunk to update a single course by id
export const updateCourse = createAsyncThunk(
    "course/updateCourse ",
    async (
        payload: { formData: FormData; courseId: string | number | null },
        thunkAPI
    ) => {
        try {
            const { formData, courseId } = payload;

            if (!courseId) {
                throw new Error("No course ID provided");
            }

            const response = await fetch(`/api/courses?courseId=${courseId}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                console.log(data);
                return thunkAPI.rejectWithValue(data.message);
            }

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error || "An unexpected error occurred");
        }
    }
);


// asyncthunk to delete a single course by id
export const deleteCourse = createAsyncThunk(
    "course/deleteCourse ",
    async (courseId: string | number, thunkAPI) => {
        try {

            const response = await fetch(`/api/courses?courseId=${courseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            console.log(result);
            if (!response.ok) {
                console.log(result);
                return thunkAPI.rejectWithValue(result.message);
            }
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Create the course slice
export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // create course
            .addCase(createCourse.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.createLoading = false;
                state.success = true;
                state.course.push(action.payload.course);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.createLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // get all course
            .addCase(getAllCourses.pending, (state) => {
                state.fetchAllLoading = true;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.fetchAllLoading = false;
                state.success = true;
                state.course = action.payload.courses;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.fetchAllLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // get a single course
            .addCase(getSingleCourse.pending, (state) => {
                state.fetchOneLoading = true;
            })
            .addCase(getSingleCourse.fulfilled, (state, action) => {
                state.fetchOneLoading = false;
                state.success = true;
                state.course = state.course.map((c) =>
                    c._id === action.payload._id ? action.payload : c
                );
            })
            .addCase(getSingleCourse.rejected, (state, action) => {
                state.fetchOneLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // update an course
            .addCase(updateCourse.pending, (state) => {
                state.editLoading = true;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.editLoading = false;
                state.success = true;
                state.course = state.course.map((c) =>
                    c._id === action.payload._id ? action.payload : c
                );
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.editLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            // delete an course
            .addCase(deleteCourse.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;
                state.course = state.course.filter(
                    (c) => c._id !== action.payload._id
                );
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.deleteLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });
        // .addDefaultCase();
    },
});

export default courseSlice.reducer;
