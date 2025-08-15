"use client";

import React from 'react';
import DefaultLayout from '../DefaultLayout';
import { Alert, Box, Snackbar } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, } from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllCourses, deleteCourse, getSingleCourse } from '@/lib/features/courses/courseSlice';
const AlertDialog = dynamic(() => import('@/components/dialogue/AlertDialogue'), { ssr: false });
const CourseModal = dynamic(() => import('@/components/modal/CourseModal'), { ssr: false });

type Course = {
    _id: GridRowId;
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
    admin: {
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
    };
    createdAt: string;
};

type Row = Course;

const Courses = () => {
    const { course, fetchAllLoading } = useAppSelector((state) => state.course)
    const dispatch = useAppDispatch();

    const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
    const [openModal, setOpenModal] = React.useState(false);

    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const alertRef = React.useRef<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [dialogueVisible, setDialogueVisible] = React.useState(false);

    // Show Alert Function
    const showAlert = (severity: 'success' | 'error', message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    React.useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch])

    const showModal = (newOpen: boolean) => () => {
        if (!newOpen) {
            setSelectedCourse(null);
        }
        setOpenModal(newOpen);
    };

    const disable = React.useCallback(
        (id: GridRowId) => async () => {
            try {
                const result = await dispatch(getSingleCourse(id));
                if (getSingleCourse.fulfilled.match(result)) {
                    setSelectedCourse(result.payload._id || id);
                    setDialogueVisible(true);
                } else {
                    showAlert('error', 'Failed to fetch course');
                }
            } catch (error) {
                showAlert('error', (error as Error).message || 'Unexpected error');
            }
        },
        [dispatch],
    );

    const handleDeleteConfirm = async () => {
        if (!selectedCourse) {
            showAlert('error', 'No course selected for deletion');
            setDialogueVisible(false);
            return;
        }

        try {
            const result = await dispatch(deleteCourse(selectedCourse));
            if (deleteCourse.fulfilled.match(result)) {
                showAlert('success', 'Course deleted');
                setDialogueVisible(false);
                setSelectedCourse(null);
                dispatch(getAllCourses());
            } else {
                showAlert('error', 'Failed to delete course');
            }
        } catch (error) {
            showAlert('error', (error as Error).message || 'Unexpected error during deletion');
        }
    };

    const edit = React.useCallback(
        (id: GridRowId) => async () => {
            try {
                const result = await dispatch(getSingleCourse(id));
                if (getSingleCourse.fulfilled.match(result)) {

                    setModalMode('edit');
                    setOpenModal(true);
                    setSelectedCourse(result.payload.course);
                    console.log(result.payload.course)
                } else {
                    showAlert('error', 'Failed to fetch course');
                }
            } catch (error) {
                showAlert('error', (error as Error).message || 'Unexpected error');
            }
        },
        [dispatch],
    );

    const columns = React.useMemo<GridColDef<Row>[]>(
        () => [
            {
                field: 'title',
                renderHeader: () => (
                    <p className='font-bold whitespace-normal'>
                        {'Courses'}
                    </p>
                ),
                type: 'string',
                editable: true,
                flex: 1,
                renderCell: (params) => {
                    const { row } = params;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={row.image || '/assets/user.png'}
                                    alt={row.title}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span>{row.title}</span>
                        </div>
                    );
                }
            },
            {
                field: 'track',
                renderHeader: () => (
                    <p className='font-bold whitespace-normal'>
                        {'Tracks'}
                    </p>
                ),
                type: 'string',
                editable: true,
                flex: 1,
                // minWidth: 300,
                // maxWidth: 300,
                renderCell: (params) => {
                    const { row } = params;
                    return <span>{row.track?.name || 'No Track'}</span>;
                }
            },
            {
                field: 'createdAt',
                renderHeader: () => (
                    <p className='font-bold whitespace-normal'>
                        {'Date Joined'}
                    </p>
                ),
                flex: 1,
                type: 'string',
                editable: true,
                renderCell: (params) => {
                    const date = new Date(params.value);
                    return <p>{date.toISOString().split('T')[0]}</p>;
                },
            },
            {
                field: 'actions',
                type: 'actions',
                renderHeader: () => (
                    <p className='font-bold whitespace-normal'>
                        {'Actions'}
                    </p>
                ),
                getActions: (params) => [
                    <GridActionsCellItem
                        key={`edit-${params.id}`}
                        icon={<MdOutlineEdit className='text-xl font-bold text-gray-950' />}
                        label="Edit"
                        onClick={edit(params.id)}
                    />,
                    <GridActionsCellItem
                        key={`delete-${params.id}`}
                        icon={<MdDeleteOutline className='text-xl font-bold text-gray-950' />}
                        label="Delete"
                        onClick={disable(params.id)}
                    />,
                ],
            },
        ],
        [disable, edit],
    );

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

            <DefaultLayout>
                <div className='grid grid-cols-1 gap-8 w-full'>
                    <header className='h-24 grid grid-cols-1 items-center'>
                        <h1 className='font-bold text-xl'>Manage Courses</h1>
                        <p>Filter, sort and access detailed courses</p>
                    </header>

                    <div className='flex flex-col lg:flex-row gap-4 items-center lg:justify-end justify-end w-full'>
                        <div className="flex ml-auto">
                            <button
                                type="button"
                                className="bg-[#01589A] text-white px-5 py-2 rounded transition duration-300 hover:bg-[#014273]"
                                onClick={() => {
                                    setOpenModal(true);
                                    setModalMode('create');
                                }}
                            >
                                Add Course
                            </button>
                        </div>
                    </div>

                    <Box
                        sx={{
                            width: "100%",
                            borderColor: "#EEF9FF",
                            "& .MuiDataGrid-columnHeaders": { backgroundColor: '#f3f4f6' },
                            height: "auto",
                            "& .MuiDataGrid-root": {
                                height: "auto !important",
                            },
                            "& .MuiDataGrid-main": {
                                height: "auto !important",
                            },
                            "& .MuiDataGrid-cell": {
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                padding: "1.5rem 1rem",
                            },
                            "& .MuiButton-text": {
                                color: "#000",
                            },
                            "& .css-1eed5fa-MuiInputBase-root-MuiInput-root::after": {
                                borderBottom: "2px solid #000",
                            },
                            "& .MuiDataGrid-cell:hover": {
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-cell:focus": {
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-scrollbar": {
                                display: "none",
                            },
                            "& .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-checked, .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.MuiCheckbox-indeterminate":
                            {
                                color: "#DC3545",
                            },
                        }}>
                        <DataGrid
                            loading={fetchAllLoading}
                            rows={course}
                            columns={columns}
                            getRowId={(row) => row._id}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            showToolbar
                            slotProps={{
                                loadingOverlay: {
                                    variant: 'circular-progress',
                                    noRowsVariant: 'circular-progress',
                                },
                            }}
                            checkboxSelection
                        />
                    </Box>
                </div>
            </DefaultLayout>

            {dialogueVisible && (
                <AlertDialog
                    text="You're about to delete a course. Confirm to continue."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDialogueVisible(false)}
                />
            )}

            <CourseModal
                open={openModal}
                handleClose={showModal(false)}
                courseData={selectedCourse}
                mode={modalMode}
            />
        </>
    );
};

export default Courses;
