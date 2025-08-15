import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// define the learner
interface LearnerAuth {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
  token: string;
  baseResetURL: string;
  profileImage: string;
  created_at: string;
  updated_at: string;
}

export interface LearnerAuthSliceState {
  learnerAuth: LearnerAuth[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: LearnerAuthSliceState = {
  learnerAuth: [],
  loading: false,
  success: false,
  error: null,
};

// sign up an learner
export const signUp = createAsyncThunk(
  "learnerAuth/registerLearner",
  async (learnerData: Partial<LearnerAuth>, thunkAPI) => {
    try {
      const response = await fetch("api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "signUp",
          learnerData,
        }),
      });
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (![200, 201].includes(response.status)) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// login an learner
export const login = createAsyncThunk(
  "learnerAuth/login",
  async (learnerData: Partial<LearnerAuth>, thunkAPI) => {
    try {
      const response = await fetch("api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          type: "login",
          learnerData,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.status !== 200 && response.status !== 201) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// forgot password
export const forgotPassword = createAsyncThunk(
  "learnerAuth/forgotPassword",
  async (learnerData: Partial<LearnerAuth>, thunkAPI) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          type: "forgotPassword",
          learnerData,
        }),
      });

      const data = await response.json();

      console.log(data);
      if (![200, 201].includes(response.status)) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// reset password
export const resetPassword = createAsyncThunk(
  "learnerAuth/resetPassword",
  async (learnerData: Partial<LearnerAuth>, thunkAPI) => {
    try {
      const response = await fetch(`/api/auth?token=${learnerData.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          type: "resetPassword",
          learnerData,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (![200, 201].includes(response.status)) {
        return thunkAPI.rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// otp verification
export const otpVerification = createAsyncThunk(
  "learnerAuth/otpVerification",
  async (learnerData: Partial<LearnerAuth>, thunkAPI) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "otpVerification",
          learnerData,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200 && response.status !== 201) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// resend otp
export const resendOtp = createAsyncThunk(
  "learnerAuth/resendOtp",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "resendOtp",
        }),
      });

      const data = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// logout
export const logout = createAsyncThunk(
  "learnerAuth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "logout" }),
      });

      const data = await response.json();
      console.log(data)
      if (![200, 201].includes(response.status)) {
        return thunkAPI.rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "learnerAuth/updateProfile",
  async (formData: FormData, thunkAPI) => {
    try {

      formData.append("type", "updateProfile");

      const response = await fetch("/api/auth", {
        method: "PUT",
        body: formData,
      });
      console.log(response)
      const data = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        return thunkAPI.rejectWithValue(data.message);
      }
      console.log(data)
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const learnerAuthSlice = createSlice({
  name: "learnerAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // sign up an learner
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;

        const user = action.payload?.user;

        if (user) {
          const { firstName, lastName, email, profileImage, contact } = user;
          localStorage.setItem(
            "user",
            JSON.stringify({ firstName, lastName, email, profileImage, contact })
          );
        }
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // login an learner
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;

        const user = action.payload?.user;

        if (user) {
          const { firstName, lastName, profileImage, email, contact } = user;
          localStorage.setItem(
            "user",
            JSON.stringify({ firstName, lastName, profileImage, email, contact })
          );
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // otp verification
      .addCase(otpVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(otpVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;
      })
      .addCase(otpVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // resend otp
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = [];
        state.error = null;
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.learnerAuth = [action.payload]; // assuming single learner object
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

  },
});

export default learnerAuthSlice.reducer;
