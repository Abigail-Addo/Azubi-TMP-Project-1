"use client"

import {
    Alert,
    Autocomplete,
    Fade,
    Modal,
    Stack,
    TextField
} from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import { IoIosClose } from 'react-icons/io';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllInvoices, createInvoice, updateInvoice } from '@/lib/features/invoices/invoiceSlice';
import { getAllLearners } from '@/lib/features/learner/learnerSlice';

const AlertDialog = dynamic(() => import('../dialogue/AlertDialogue'), { ssr: false });

interface InvoiceModalProps {
    open: boolean;
    handleClose: () => void;
    mode: "create" | "edit";
    invoiceData?: IFormInput | null;
    onSuccess?: () => void;
}

interface IFormInput {
    _id: string;
    learner: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken: string;
        verificationTokenExpiresAt: string;
        lastLogin: string;
        createdAt: string;
        updatedAt: string;
        contact: string;
        description: string;
        disabled: boolean;
        location: string;
        profileImage: string;
    };
    amount: number;
    dueDate: string;
    paymentLink: string;
    paymentDetails: string;
    createdAt: string;
    paystackCallbackUrl?: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, handleClose, mode, invoiceData, onSuccess }) => {
    const dispatch = useAppDispatch();
    const { learner } = useAppSelector((state) => state.learner);
    const [dialogueVisible, setDialogueVisible] = React.useState(false);
    const alertRef = React.useRef<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm<IFormInput>({
        defaultValues: invoiceData || {
            learner: { _id: '', firstName: '', lastName: '' },
            amount: 0,
            dueDate: '',
            paymentDetails: '',
            paystackCallbackUrl: 'http://localhost:3000/payment',
        }
    });

    // show alert
    const showAlert = (severity: 'success' | 'error', message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    React.useEffect(() => {
        dispatch(getAllLearners());

        if (mode === 'edit' && invoiceData) {
            setValue("learner", invoiceData.learner);
            setValue("amount", invoiceData.amount);
            setValue("dueDate", invoiceData.dueDate);
            setValue("paymentDetails", invoiceData.paymentDetails);
        } else {
            reset();
        }
    }, [mode, invoiceData, reset, dispatch, setValue]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {

            const payload = {
                ...data,
                learner: data.learner._id
            };

            if (mode === 'create') {
                console.log(payload)
                const result = await dispatch(createInvoice(payload));
                if (createInvoice.fulfilled.match(result)) {
                    dispatch(getAllInvoices());
                    showAlert('success', 'Invoice created');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else {
                    showAlert('error', result.payload as string);
                    console.log(result.payload as string)
                }
            } else if (mode === 'edit' && invoiceData) {
                const result = await dispatch(updateInvoice({
                    invoiceId: invoiceData._id,
                    invoiceData: data
                }));
                if (updateInvoice.fulfilled.match(result)) {
                    dispatch(getAllInvoices());
                    showAlert('success', 'Invoice updated');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else {
                    showAlert('error', result.payload as string);
                    console.log(result.payload as string)
                }
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            showAlert('error', message);
            console.log(message)
        }
    };

    const learnerOptions = learner.map(l => ({
        label: `${l.firstName} ${l.lastName}`,
        value: l._id
    }));

    const handleConfirm = () => {
        setDialogueVisible(false);
        handleSubmit(onSubmit)();
    };

    return (
        <>
            {alertVisible && alertRef.current && (
                <Stack sx={{ width: '100%', my: 2 }}>
                    <Alert severity={alertRef.current.severity} onClose={() => setAlertVisible(false)}>
                        {alertRef.current.message}
                    </Alert>
                </Stack>
            )}

            <Modal open={open} onClose={handleClose} className='outline-none w-full flex items-center justify-center backdrop-blur-sm px-2'>
                <Fade in={open}>
                    <div className='w-full lg:w-2/4 bg-white max-h-[80vh] h-fit overflow-y-auto'>
                        {/* Close Icon */}
                        <div className='border-b-4 text-2xl font-bold border-gray-400 p-4 flex items-center justify-between'>
                            <h1>{mode === "create" ? "Add New Course" : "Edit Course"}</h1>
                            <IoIosClose
                                onClick={() => {
                                    reset();
                                    handleClose();
                                }}
                                className=" cursor-pointer"
                            />
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className='py-10 px-6 grid grid-cols-1 gap-6'>
                            {/* Learner */}
                            <div>
                                <Controller
                                    name="learner"
                                    control={control}
                                    rules={{ required: "Please select a learner" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            options={learnerOptions}
                                            getOptionLabel={(option) => option.label}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            value={
                                                learnerOptions.find((opt) => opt.value === field.value?._id) || null
                                            }
                                            onChange={(_, newValue) =>
                                                field.onChange(
                                                    newValue ? { _id: newValue.value, firstName: '', lastName: '' } : null
                                                )
                                            }
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.value}>
                                                    {option.label}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{
                                                        '& .MuiInputLabel-root.Mui-focused ': {
                                                            color: '#01589A',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '&:hover fieldset': {
                                                                borderColor: '#01589A',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#01589A',
                                                            },
                                                        },
                                                    }}

                                                    {...params}
                                                    label="Learner"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {errors.learner && <p className="text-red-500 text-sm">{errors.learner.message}</p>}
                            </div>

                            {/* Amount */}
                            <div>
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            type="text"
                                            value={field.value ?? ''} // ensure it shows the initial value
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const numericValue = value.replace(/[^0-9.-]+/g, '');
                                                field.onChange(numericValue === '' ? '' : parseFloat(numericValue));
                                            }}
                                            label="Amount"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root.Mui-focused ': {
                                                    color: '#01589A',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: '#01589A',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#01589A',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            {/* Due Date */}
                            <div>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    rules={{ required: "Due date is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Due Date"
                                            type="date"
                                            value={field.value ? field.value.split('T')[0] : ''}
                                            onChange={field.onChange}
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: true,
                                                },
                                            }}
                                            fullWidth
                                            error={!!errors.dueDate}
                                            helperText={errors.dueDate?.message}
                                        />
                                    )}
                                />
                            </div>

                            {/* Payment Details */}
                            <div>
                                <Controller
                                    name="paymentDetails"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            id="outlined-basic"
                                            label="Description"
                                            variant="outlined"
                                            className="w-full"
                                            autoComplete="off"
                                            type="text"
                                            sx={{
                                                '& .MuiInputLabel-root.Mui-focused ': {
                                                    color: '#01589A',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: '#01589A',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#01589A',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.paymentDetails && <p className="text-red-500 text-sm">{errors.paymentDetails.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                                    onClick={() => {
                                        const { learner, paymentDetails } = getValues();
                                        const allFilled = learner && paymentDetails;

                                        if (allFilled) {
                                            setDialogueVisible(true);
                                        }
                                    }}
                                >
                                    {(mode === "edit" ? "Edit Invoice" : "Create Invoice")}
                                </button>
                            </div>

                        </form>
                    </div>
                </Fade>
            </Modal>

            {/* Dialogue */}
            {dialogueVisible && (
                <AlertDialog
                    text={(mode === "edit" ? "You're about to update the invoice. Confirm to continue." : "You're about to create a new invoice. Confirm to continue.")}
                    onConfirm={handleConfirm}
                    onCancel={() => setDialogueVisible(false)}
                />
            )}
        </>
    );
};

export default InvoiceModal;
