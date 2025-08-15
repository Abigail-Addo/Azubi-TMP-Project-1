"use client"


import { Alert, Autocomplete, Button, Fade, InputAdornment, Modal, OutlinedInput, Snackbar, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react'
import { IoIosClose } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllCourses, createCourse, updateCourse } from '@/lib/features/courses/courseSlice';
import { getAllTracks } from '@/lib/features/tracks/trackSlice';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
const AlertDialog = dynamic(() => import('../dialogue/AlertDialogue'), { ssr: false });


interface CourseModalProps {
    open: boolean;
    handleClose: () => void;
    mode: "create" | "edit";
    courseData?: IFormInput | null;
    onSuccess?: () => void;
}

interface IFormInput {
    _id: string | number;
    title: string;
    image: string;
    description: string;
    track: {
        id: string;
        name: string;
        price: number;
        instructor: string;
        duration: string;
        description: string;
        image: string;
    }
    createdAt: string;
};

const CourseModal: React.FC<CourseModalProps> = ({ open, handleClose, mode, courseData, onSuccess }) => {
    const dispatch = useAppDispatch();
    const { tracks } = useAppSelector((state) => state.tracks)
    const [dialogueVisible, setDialogueVisible] = React.useState(false);
    const { handleSubmit, control, formState: { errors }, getValues, reset, setValue } = useForm<IFormInput>({
        defaultValues: courseData || {
            title: '',
            track: { id: '', name: '' },
            image: '',
            description: '',
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
        dispatch(getAllTracks());
        console.log(courseData)
        if (mode === "edit" && courseData) {
            setValue("title", courseData.title);
            setValue("track", courseData.track);
            setValue("image", courseData.image);
            setValue("description", courseData.description);
        } else {
            reset();
        }
    }, [mode, courseData, setValue, reset, dispatch]);

    React.useEffect(() => {
        if (mode === 'edit' && courseData?.image) {
            const imageName = courseData.image.split('/').pop();
            setFileName(imageName || 'No file chosen');
            setSelectedFile(null);
        } else if (mode === 'create') {
            setFileName('No file chosen');
            setSelectedFile(null);
        }
    }, [mode, courseData]);

    // function to create or edit a course
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const formData = new FormData();

            formData.append('title', data.title);
            formData.append('track', data.track.id);
            formData.append('description', data.description);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            if (mode === "create") {
                const result = await dispatch(createCourse(formData));
                console.log(formData)
                if (createCourse.fulfilled.match(result)) {
                    dispatch(getAllCourses());
                    showAlert('success', 'Course created');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else if (createCourse.rejected.match(result)) {
                    showAlert('error', result.payload as string);
                }
            } else if (mode === "edit" && courseData) {
                const result = await dispatch(updateCourse({ formData, courseId: courseData._id }));

                if (updateCourse.fulfilled.match(result)) {
                    dispatch(getAllCourses());
                    showAlert('success', 'Course updated');
                    onSuccess?.();
                    handleClose();
                    reset();
                } else if (updateCourse.rejected.match(result)) {
                    showAlert('error', result.payload as string);
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            showAlert('error', errorMessage);
        }

    };

    // Trigger confirmation dialog before submitting
    const handleFormSubmit = () => {
        setDialogueVisible(true);
    };

    const handleConfirm = () => {
        setDialogueVisible(false);
        handleSubmit(onSubmit)();
    };

    // Tracks options data
    const tracksOptions = tracks.map((t) => ({
        label: t.name,
        value: t.id,
    }));

    console.log(tracksOptions)


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
                className='outline-none w-full flex items-center justify-center backdrop-blur-sm px-2'
            >

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

                        {/* Modal content */}
                        <div>
                            <form
                                onSubmit={handleSubmit(handleFormSubmit)}
                                className="w-full h-full"
                            >
                                <div className="py-10 px-5 md:px-16 lg:px-16 md:py-16 grid grid-cols-1 gap-8">
                                    {/* title */}
                                    <div>
                                        <Controller
                                            name="title"
                                            control={control}
                                            rules={{
                                                required: "Please enter a valid title"
                                            }}
                                            render={({ field }) =>
                                                <TextField
                                                    {...field}
                                                    id="outlined-basic"
                                                    label="Title"
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
                                        {errors.title && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* track */}
                                    <div >
                                        <Controller
                                            name="track"
                                            control={control}
                                            rules={{ required: "Please select an option" }}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={tracksOptions}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    value={tracksOptions.find((opt) => opt.value === field.value?.id) || null}
                                                    onChange={(_, newValue) => field.onChange(newValue ? { id: newValue.value, name: newValue.label } : null)}
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
                                                            label="Track"
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.track && (
                                            <p role="alert" className="text-red-500 text-sm">{errors.track.message}</p>
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

                                    {/* button */}
                                    <div className="w-full flex justify-center">
                                        <button
                                            type="submit"
                                            className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                                            onClick={() => {
                                                const { title, track, image, description } = getValues();
                                                const allFilled = title && track && image && description;

                                                if (allFilled) {
                                                    setDialogueVisible(true);
                                                }
                                            }}
                                        >
                                            {(mode === "edit" ? "Edit Course" : "Create Course")}
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
                    text={(mode === "edit" ? "You're about to update the course. Confirm to continue." : "You're about to create a new course. Confirm to continue.")}
                    onConfirm={handleConfirm}
                    onCancel={() => setDialogueVisible(false)}
                // loading={mode === "edit" ? editACLoading : createACLoading}
                />
            )}
        </>
    )
}

export default CourseModal
