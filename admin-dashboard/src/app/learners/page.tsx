"use client";

import React from "react";
import DefaultLayout from "../DefaultLayout";
import { Alert, Box, Stack, styled } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
} from "@mui/x-data-grid";
import dynamic from "next/dynamic";
import { FaRegEye } from "react-icons/fa";
import Image from "next/image";
import { getAllLearners, getSingleLearner } from "@/lib/features/learner/learnerSlice";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
const LearnerModal = dynamic(() => import("@/components/modal/LearnerModal"), {
    ssr: false,
});


type Learners = {
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

type Row = Learners;

const Learners = () => {
    const { learner, fetchAllLoading, } = useAppSelector((state) => state.learner)
    const dispatch = useAppDispatch();
    const [openModal, setOpenModal] = React.useState(false);

    const [selectedLearner, setSelectedLearner] = React.useState(null);
    const alertRef = React.useRef<{ severity: "success" | "error"; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);

    // Show Alert Function
    const showAlert = (severity: "success" | "error", message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    // Fetch all learners
    React.useEffect(() => {
        dispatch(getAllLearners());
    }, [dispatch]);

    const showModal = (newOpen: boolean) => () => {
        if (!newOpen) {
            setSelectedLearner(null);
        }
        setOpenModal(newOpen);
    };

    const view = React.useCallback(
        (id: GridRowId) => async () => {
            try {
                const result = await dispatch(getSingleLearner(id));
                if (getSingleLearner.fulfilled.match(result)) {
                    setOpenModal(true);
                    setSelectedLearner(result.payload.learner);
                    console.log(result.payload)
                } else {
                    showAlert('error', 'Failed to fetch learner');
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
                field: "learner",
                headerName: "Learner",
                flex: 1,
                renderCell: (params) => {
                    const { row } = params;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={row.profileImage || '/assets/user.png'}
                                    alt={`${row.firstName} ${row.lastName}`}
                                    width={40}
                                    height={40}
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <span>{row.firstName} {row.lastName}</span>
                        </div>
                    );
                },
            },
            {
                field: "email",
                headerName: "Email",
                type: "string",
                flex: 1,
                renderCell: (params) => <p>{params.row.email}</p>,
            },
            {
                field: "createdAt",
                headerName: "Date Joined",
                flex: 1,
                type: "string",
                renderCell: (params) => {
                    const date = new Date(params.value);
                    return <p>{date.toISOString().split("T")[0]}</p>;
                },
            },
            // {
            //     field: "disabled",
            //     headerName: "Status",
            //     flex: 1,
            //     type: "string",
            //     renderCell: (params) => {
            //         let colorClass = '';
            //         switch (params.value) {
            //             case 'true':
            //                 colorClass = 'text-green-500';
            //                 break;
            //             case 'false':
            //                 colorClass = 'text-red-500';
            //                 break;
            //             default:
            //                 colorClass = 'text-gray-500';
            //         }
            //         return <span className={colorClass}>{params.value}</span>;
            //     },
            // },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <GridActionsCellItem
                        key={`view-${params.id}`}
                        icon={<FaRegEye className="text-xl font-bold text-gray-950" />}
                        label="View"
                        onClick={view(params.id)}
                    />,
                ],
            },
        ],
        [view]
    );

    // custom styles for the no results overlay
    const StyledGridOverlay = styled("div")(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        "& .no-results-primary": {
            fill: "#DC3545",
        },
        "& .no-results-secondary": {
            fill: "#DC3545",
        },
    }));

    //function for the no results overlay
    const CustomNoResultsOverlay = () => {
        return (
            <StyledGridOverlay>
                <Box
                    sx={{
                        height: 400,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="50"
                        height="50"
                        viewBox="0 0 523 299"
                        aria-hidden
                        focusable="false"
                    >
                        <path
                            className="no-results-primary"
                            d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
                        />
                        <path
                            className="no-results-primary"
                            d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
                        />
                        <path
                            className="no-results-primary"
                            d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
                        />
                        <path
                            className="no-results-secondary"
                            d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
                        />
                    </svg>
                    <p>No results found.</p>
                </Box>
            </StyledGridOverlay>
        );
    };

    return (
        <>
            {alertVisible && alertRef.current && (
                <Stack sx={{ width: "100%", my: 2 }}>
                    <Alert
                        severity={alertRef.current.severity}
                        onClose={() => setAlertVisible(false)}
                    >
                        {alertRef.current.message}
                    </Alert>
                </Stack>
            )}

            <DefaultLayout>
                <div className="grid grid-cols-1 gap-8 w-full">
                    <header className="h-24 grid grid-cols-1 items-center">
                        <h1 className="font-bold text-xl">Manage Learners</h1>
                        <p>Filter, sort and access detailed learner profiles</p>
                    </header>

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
                        }}
                    >
                        <DataGrid
                            rows={learner}
                            columns={columns}
                            getRowId={(row) => row._id}
                            loading={fetchAllLoading}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 25, 50]}
                            showToolbar
                            slots={{
                                noResultsOverlay: CustomNoResultsOverlay,
                            }}
                            slotProps={{
                                loadingOverlay: {
                                    variant: "circular-progress",
                                    noRowsVariant: "circular-progress",
                                },
                            }}
                            checkboxSelection
                        />
                    </Box>
                </div>
            </DefaultLayout>

            <LearnerModal
                open={openModal}
                handleClose={showModal(false)}
                learnerData={selectedLearner}
            />
        </>
    );
};

export default Learners;
