"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { resetEnrollmentState } from "@/lib/features/trackEnrollment/trackEnrollmentSlice";

const PaymentModal = () => {
    const dispatch = useAppDispatch();
    const { loading, success, error, message, transactionUrl } = useAppSelector(
        (state) => state.enrollment
    );

    const handleClose = () => {
        dispatch(resetEnrollmentState());
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold">Processing your enrollment...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            {success && transactionUrl ? (
                <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Enrollment Successful!</h2>
                    <p className="mb-4">{message}</p>
                    <a
                        href={transactionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Proceed to Payment
                    </a>
                    <button
                        onClick={handleClose}
                        className="mt-3 underline text-green-700"
                    >
                        Close
                    </button>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-800 px-6 py-4 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Enrollment Failed</h2>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={handleClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <p className="text-gray-600">Click &quot; Enroll&quot; to start your enrollment.</p>
            )}
        </div>
    );
};

export default PaymentModal;
