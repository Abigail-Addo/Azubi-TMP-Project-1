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
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import Image from "next/image";
import {
    getAllInvoices,
    deleteInvoice,
    getSingleInvoice,
} from "@/lib/features/invoices/invoiceSlice";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

const AlertDialog = dynamic(() => import("@/components/dialogue/AlertDialogue"), {
    ssr: false,
});
const InvoiceModal = dynamic(() => import("@/components/modal/InvoiceModal"), {
    ssr: false,
});

type Invoice = {
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
    status: string;
    dueDate: string;
    paymentLink: string;
    paymentDetails: string;
    createdAt: string;
    paystackCallbackUrl?: string;
};

type Row = Invoice;

const Invoices = () => {
    const { invoice, fetchAllLoading, } = useAppSelector((state) => state.invoice)
    const dispatch = useAppDispatch();

    const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
    const [openModal, setOpenModal] = React.useState(false);

    const [selectedInvoice, setSelectedInvoice] = React.useState(null);
    const alertRef = React.useRef<{ severity: "success" | "error"; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [dialogueVisible, setDialogueVisible] = React.useState(false);

    // Show Alert Function
    const showAlert = (severity: "success" | "error", message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    // Fetch all invoices
    React.useEffect(() => {
        dispatch(getAllInvoices());
    }, [dispatch]);

    const showModal = (newOpen: boolean) => () => {
        if (!newOpen) {
            setSelectedInvoice(null);
        }
        setOpenModal(newOpen);
    };

    const disable = React.useCallback(
        (id: GridRowId) => async () => {
            try {
                const result = await dispatch(getSingleInvoice(id));
                if (getSingleInvoice.fulfilled.match(result)) {
                    setSelectedInvoice(result.payload._id || id);
                    setDialogueVisible(true);
                } else {
                    showAlert('error', 'Failed to fetch invoice');
                }
            } catch (error) {
                showAlert('error', (error as Error).message || 'Unexpected error');
            }
        },
        [dispatch],
    );

    const handleDeleteConfirm = async () => {
        if (!selectedInvoice) {
            showAlert('error', 'No invoice selected for deletion');
            setDialogueVisible(false);
            return;
        }

        try {
            const result = await dispatch(deleteInvoice(selectedInvoice));
            if (deleteInvoice.fulfilled.match(result)) {
                showAlert('success', 'Invoice deleted');
                setDialogueVisible(false);
                setSelectedInvoice(null);
                dispatch(getAllInvoices());
            } else {
                showAlert('error', 'Failed to delete invoice');
            }
        } catch (error) {
            showAlert('error', (error as Error).message || 'Unexpected error during deletion');
        }
    };

    const edit = React.useCallback(
        (id: GridRowId) => async () => {
            try {
                const result = await dispatch(getSingleInvoice(id));
                if (getSingleInvoice.fulfilled.match(result)) {

                    setModalMode('edit');
                    setOpenModal(true);
                    setSelectedInvoice(result.payload.invoice);
                    console.log(result.payload.invoice)
                } else {
                    showAlert('error', 'Failed to fetch invoice');
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
                    const { learner } = params.row;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={learner.profileImage || '/assets/user.png'}
                                    alt={`${learner.firstName} ${learner.lastName}`}
                                    width={40}
                                    height={40}
                                    className="object-cover rounded-full"
                                />
                            </div>
                            <span>{learner.firstName} {learner.lastName}</span>
                        </div>
                    );
                },
            },
            {
                field: "email",
                headerName: "Email",
                type: "string",
                flex: 1,
                renderCell: (params) => <p>{params.row.learner.email}</p>,
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
            {
                field: "amount",
                headerName: "Amount",
                flex: 1,
                type: "number",
                renderCell: (params) => `$${params.value}`,
                headerAlign: 'left',
                align: 'left',
            },
            {
                field: "status",
                headerName: "Status",
                flex: 1,
                type: "string",
                renderCell: (params) => {
                    let colorClass = '';
                    switch (params.value) {
                        case 'paid':
                            colorClass = 'text-green-500';
                            break;
                        case 'pending':
                            colorClass = 'text-yellow-500';
                            break;
                        case 'failed':
                            colorClass = 'text-red-500';
                            break;
                        default:
                            colorClass = 'text-gray-500';
                    }
                    return <span className={colorClass}>{params.value}</span>;
                },
            },
            {
                field: "dueDate",
                headerName: "Due Date",
                flex: 1,
                type: "string",
                renderCell: (params) => {
                    const date = new Date(params.value);
                    return <p>{date.toISOString().split("T")[0]}</p>;
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                getActions: (params) => [
                    <GridActionsCellItem
                        key={`edit-${params.id}`}
                        icon={<MdOutlineEdit className="text-xl font-bold text-gray-950" />}
                        label="Edit"
                        onClick={edit(params.id)}
                    />,
                    <GridActionsCellItem
                        key={`delete-${params.id}`}
                        icon={<MdDeleteOutline className="text-xl font-bold text-gray-950" />}
                        label="Delete"
                        onClick={disable(params.id)}
                    />,
                ],
            },
        ],
        [disable, edit]
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
                        <h1 className="font-bold text-xl">Manage Invoices</h1>
                        <p>Filter, sort and access detailed Invoices</p>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-4 items-center lg:justify-end justify-end w-full">
                        <div className="flex ml-auto">
                            <button
                                type="button"
                                className="bg-[#01589A] text-white px-5 py-2 rounded transition duration-300 hover:bg-[#014273]"
                                onClick={() => {
                                    setOpenModal(true);
                                    setModalMode("create");
                                }}
                            >
                                Add Invoice
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
                        }}
                    >
                        <DataGrid
                            rows={invoice}
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

            {dialogueVisible && (
                <AlertDialog
                    text="You're about to delete an invoice. Confirm to continue."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDialogueVisible(false)}
                />
            )}

            <InvoiceModal
                open={openModal}
                handleClose={showModal(false)}
                invoiceData={selectedInvoice}
                mode={modalMode}
            />
        </>
    );
};

export default Invoices;
