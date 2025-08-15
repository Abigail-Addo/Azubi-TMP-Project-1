"use client"


import { Alert, Button, Fade, FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, Snackbar, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react'
import { IoIosClose } from 'react-icons/io';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
const AlertDialog = dynamic(() => import('../dialogue/AlertDialogue'), { ssr: false });
import { getAllTracks, updateTrack, createTrack } from '@/lib/features/tracks/trackSlice';
import { useAppDispatch } from '@/lib/hooks';

interface TracksModalProps {
    open: boolean;
    handleClose: () => void;
    mode: "create" | "edit";
    trackData?: IFormInput | null;
    onSuccess?: () => void;
}

interface IFormInput {
    id: string | number;
    name: string;
    price: number;
    instructor: string;
    duration: string;
    description: string;
    image: string;
}

const TracksModal: React.FC<TracksModalProps> = ({ open, handleClose, mode, trackData, onSuccess }) => {
    const dispatch = useAppDispatch();
    const [dialogueVisible, setDialogueVisible] = React.useState(false);
    const { handleSubmit, control, formState: { errors }, getValues, reset, setValue } = useForm<IFormInput>({
        defaultValues: trackData || {
            name: '',
            price: 1,
            instructor: '',
            duration: '',
            description: '',
            image: '',
        },
    });
    const alertRef = React.useRef<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = React.useState('No file chosen');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // show alert
    const showAlert = (severity: 'success' | 'error', message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    React.useEffect(() => {
        if (mode === "edit" && trackData) {
            setValue("name", trackData.name);
            setValue("price", trackData.price);
            setValue("instructor", trackData.instructor);
            setValue("duration", trackData.duration);
            setValue("description", trackData.description);
            setValue("image", trackData.image);
        } else {
            reset();
        }
    }, [mode, trackData, setValue, reset]);

    React.useEffect(() => {
        if (mode === 'edit' && trackData?.image) {
            const imageName = trackData.image.split('/').pop();
            setFileName(imageName || 'No file chosen');
            setSelectedFile(null);
        } else if (mode === 'create') {
            setFileName('No file chosen');
            setSelectedFile(null);
        }
    }, [mode, trackData]);

    // create/edit a course
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('price', String(data.price));
            formData.append('instructor', data.instructor);
            formData.append('duration', data.duration);
            formData.append('description', data.description);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            if (mode === "create") {
                const result = await dispatch(createTrack(formData));
                console.log(formData)
                if (createTrack.fulfilled.match(result)) {
                    dispatch(getAllTracks());
                    showAlert('success', 'Track created');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else if (createTrack.rejected.match(result)) {
                    showAlert('error', result.payload as string);
                }
            } else if (mode === "edit" && trackData) {
                formData.append('trackId', String(trackData.id));

                const result = await dispatch(updateTrack({ formData, trackId: trackData.id }));

                if (updateTrack.fulfilled.match(result)) {
                    dispatch(getAllTracks());
                    showAlert('success', 'Track updated');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else if (updateTrack.rejected.match(result)) {
                    showAlert('error', result.payload as string);
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            showAlert('error', errorMessage);
        }
    };

    // Trigger confirmation dialog before submitting
    const handleFormSubmit = (data: IFormInput) => {
        console.log('Validated Data:', data);
        setDialogueVisible(true);
    };

    const handleConfirm = () => {
        setDialogueVisible(false);
        handleSubmit(onSubmit)();
    };


    return (
        <>
            <Snackbar
                open={alertVisible}
                autoHideDuration={6000}
                onClose={() => setAlertVisible(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={alertRef.current?.severity || 'success'}
                    onClose={() => setAlertVisible(false)}
                    sx={{ width: '100%' }}
                >
                    {alertRef.current?.message || ''}
                </Alert>
            </Snackbar>

            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={(e, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        handleClose();
                    }
                }}
                className='outline-none w-full flex items-center justify-center backdrop-blur-sm px-2 relative'
            >

                <Fade in={open}>
                    <div className='w-full lg:w-2/4 bg-white max-h-[80vh] h-fit overflow-y-auto'>

                        {/* Close Icon */}
                        <div className='border-b-4 text-2xl font-bold border-gray-400 p-4 flex items-center justify-between'>
                            <h1>{mode === "create" ? "Add New Track" : "Edit Track"}</h1>
                            <IoIosClose
                                onClick={() => {
                                    reset();
                                    handleClose();
                                }}
                                className=" cursor-pointer"
                            />
                        </div>

                        {/* Modal content */}
                        <div>
                            <form
                                onSubmit={handleSubmit(handleFormSubmit)}
                                className="w-full h-full"
                            >
                                <div className="py-10 px-5 md:px-16 lg:px-16 md:py-16 grid grid-cols-1 gap-8">
                                    {/* name */}
                                    <div>
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid name"
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Name"
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
                                            }
                                        />
                                        {errors.name && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* price */}
                                    <div>
                                        <Controller
                                            name="price"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid price",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: "Only digits are allowed in this field"
                                                },
                                            }}
                                            render={({ field }) =>
                                                <FormControl fullWidth variant="outlined" error={!!errors.price}>
                                                    <InputLabel htmlFor="price-input">Price</InputLabel>
                                                    <OutlinedInput
                                                        {...field}
                                                        id="price-input"
                                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                        label="Price"
                                                        autoComplete="off"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Allow only digits
                                                            if (/^\d*$/.test(value)) {
                                                                field.onChange(Number(value));
                                                            }
                                                        }}
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
                                                </FormControl>
                                            }
                                        />
                                        {errors.price && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.price.message}</p>
                                        )}
                                    </div>

                                    {/* instructor */}
                                    <div>
                                        <Controller
                                            name="instructor"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid instructor"
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Instructor"
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
                                            }
                                        />
                                        {errors.instructor && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.instructor.message}</p>
                                        )}
                                    </div>

                                    {/* duration */}
                                    <div>
                                        <Controller
                                            name="duration"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid duration"
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Duration"
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
                                            }
                                        />
                                        {errors.duration && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.duration.message}</p>
                                        )}
                                    </div>

                                    {/* description */}
                                    <div>
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid description"
                                            }}
                                            render={({ field }) =>
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
                                            }
                                        />
                                        {errors.description && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.description.message}</p>
                                        )}
                                    </div>

                                    {/* image */}
                                    <div>
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        style={{ display: 'none' }}
                                                        onChange={(event) => {
                                                            if (event.target.files && event.target.files[0]) {
                                                                const selected = event.target.files[0];
                                                                setFileName(selected.name);
                                                                setSelectedFile(selected);
                                                                field.onChange(selected);
                                                            } else {
                                                                setFileName('No file chosen');
                                                                setSelectedFile(null);
                                                                field.onChange(null);
                                                            }
                                                        }}

                                                    />
                                                    <OutlinedInput
                                                        fullWidth
                                                        value={fileName}
                                                        readOnly
                                                        notched={false}
                                                        sx={{
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                border: 'none',
                                                            },
                                                            height: 40,
                                                            paddingLeft: 0,
                                                        }}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Button variant="contained" onClick={handleButtonClick}>
                                                                    Choose File
                                                                </Button>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </>
                                            )}
                                        />
                                        {errors.image && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.image.message}</p>
                                        )}

                                    </div>

                                    {/* button */}
                                    <div className="w-full flex justify-center">
                                        <button
                                            type="submit"
                                            className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                                            onClick={() => {
                                                const { name, price, instructor, duration, description, image } = getValues();
                                                const allFilled = name && price && instructor && duration && description && image;

                                                if (allFilled) {
                                                    setDialogueVisible(true);
                                                }
                                            }}
                                        >
                                            {(mode === "edit" ? "Edit Track" : "Create Track")}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Fade>
            </Modal>


            {/* Dialogue */}
            {dialogueVisible && (
                <AlertDialog
                    text={(mode === "edit" ? "You're about to update the track. Confirm to continue." : "You're about to create a new track. Confirm to continue.")}
                    onConfirm={handleConfirm}
                    onCancel={() => setDialogueVisible(false)}
                // loading={mode === "edit" ? editACLoading : createACLoading}
                />
            )}
        </>
    )
}

export default TracksModal
