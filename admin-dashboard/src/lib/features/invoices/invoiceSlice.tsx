import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// ==== Types ====
interface Learner {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    contact: string;
    description: string;
    disabled: boolean;
    location: string;
    profileImage: string;
}

interface Track {
    _id: string;
    admin: string;
    name: string;
    price: number;
    instructor: string;
    duration: string;
    image: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface Invoice {
    _id: string;
    learner: Learner;
    track: Track;
    amount: number;
    status: string;
    dueDate: string;
    paystackReference: string;
    createdAt: string;
    updatedAt: string;
    paidAt: string;
    paystackTransactionId: string;
}

interface InvoiceSliceState {
    invoices: Invoice[];
    createLoading: boolean;
    fetchAllLoading: boolean;
    fetchOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: InvoiceSliceState = {
    invoices: [],
    createLoading: false,
    fetchAllLoading: false,
    fetchOneLoading: false,
    editLoading: false,
    deleteLoading: false,
    success: false,
    error: null,
};



// create
export const createInvoice = createAsyncThunk(
    'invoice/createInvoice',
    async (invoiceData: Partial<Invoice>, thunkAPI) => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });
            const result = await response.json();
            if (!response.ok) return thunkAPI.rejectWithValue(result.message);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// get all
export const getAllInvoices = createAsyncThunk(
    'invoice/getAllInvoices',
    async (_, thunkAPI) => {
        try {
            const response = await fetch('/api/invoices');
            const result = await response.json();
            if (!response.ok) return thunkAPI.rejectWithValue(result.message);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// get one
export const getSingleInvoice = createAsyncThunk(
    'invoice/getSingleInvoice',
    async (invoiceId: string | number | null, thunkAPI) => {
        try {
            if (!invoiceId) throw new Error('No invoice ID provided');
            const response = await fetch(`/api/invoices?invoiceId=${invoiceId}`);
            const result = await response.json();
            if (!response.ok) return thunkAPI.rejectWithValue(result.message);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// update
export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async (
        payload: { invoiceId: string | number | null; invoiceData: Partial<Invoice> },
        thunkAPI
    ) => {
        const { invoiceId, invoiceData } = payload;
        try {
            if (!invoiceId) throw new Error('No invoice ID provided');

            const response = await fetch(`/api/invoices?invoiceId=${invoiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });
            const result = await response.json();
            if (!response.ok) return thunkAPI.rejectWithValue(result.message);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// delete
export const deleteInvoice = createAsyncThunk(
    'invoice/deleteInvoice',
    async (invoiceId: string | number | null, thunkAPI) => {
        try {
            if (!invoiceId) throw new Error('No invoice ID provided');
            const response = await fetch(`/api/invoices?invoiceId=${invoiceId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (!response.ok) return thunkAPI.rejectWithValue(result.message);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// ==== SLICE ====
export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // create
            .addCase(createInvoice.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createInvoice.fulfilled, (state, action) => {
                state.createLoading = false;
                state.success = true;
                state.invoices.push(action.payload.invoice);
            })
            .addCase(createInvoice.rejected, (state, action) => {
                state.createLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // fetch all
            .addCase(getAllInvoices.pending, (state) => {
                state.fetchAllLoading = true;
            })
            .addCase(getAllInvoices.fulfilled, (state, action) => {
                state.fetchAllLoading = false;
                state.success = true;
                state.invoices = action.payload.invoices;
            })
            .addCase(getAllInvoices.rejected, (state, action) => {
                state.fetchAllLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // fetch one
            .addCase(getSingleInvoice.pending, (state) => {
                state.fetchOneLoading = true;
            })
            .addCase(getSingleInvoice.fulfilled, (state, action) => {
                state.fetchOneLoading = false;
                state.success = true;
                state.invoices = state.invoices.map((inv) =>
                    inv._id === action.payload._id ? action.payload : inv
                );
            })
            .addCase(getSingleInvoice.rejected, (state, action) => {
                state.fetchOneLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // update
            .addCase(updateInvoice.pending, (state) => {
                state.editLoading = true;
            })
            .addCase(updateInvoice.fulfilled, (state, action) => {
                state.editLoading = false;
                state.success = true;
                state.invoices = state.invoices.map((inv) =>
                    inv._id === action.payload._id ? action.payload : inv
                );
            })
            .addCase(updateInvoice.rejected, (state, action) => {
                state.editLoading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // delete
            .addCase(deleteInvoice.pending, (state) => {
                state.deleteLoading = true;
            })
            .addCase(deleteInvoice.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = true;
                state.invoices = state.invoices.filter(
                    (inv) => inv._id !== action.payload._id
                );
            })
            .addCase(deleteInvoice.rejected, (state, action) => {
                state.deleteLoading = false;
                state.success = false;
                state.error = action.payload as string;
            });
    },
});

export default invoiceSlice.reducer;
