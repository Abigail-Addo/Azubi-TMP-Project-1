"use client"

import { Fade, Modal, Skeleton } from '@mui/material';
import React from 'react'
import { IoIosClose } from 'react-icons/io';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';

interface LearnerModalProps {
    open: boolean;
    handleClose: () => void;
    learnerData?: Learners | null;
}

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

const LearnerModal: React.FC<LearnerModalProps> = ({ open, handleClose, learnerData }) => {
    const { fetchAllLoading } = useAppSelector((state) => state.learner)

    return (
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
                        <IoIosClose
                            onClick={() => handleClose()}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Modal content */}
                    <div className="p-6 flex flex-col items-center">
                        {fetchAllLoading ? (
                            // Skeleton Loading
                            <>
                                <Skeleton variant="circular" width={128} height={128} className="mb-4" />
                                <Skeleton variant="text" width={200} height={30} className="mb-1" />
                                <Skeleton variant="text" width={180} height={20} className="mb-4" />
                                <Skeleton variant="rectangular" width="100%" height={120} className="rounded shadow" />
                            </>
                        ) : (
                            // Actual Learner Data
                            <>
                                <Image
                                    src={learnerData?.profileImage || '/assets/user.png'}
                                    alt='Learner'
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                    width={1000}
                                    height={1000}
                                />
                                <h2 className="text-xl font-bold mb-1">{learnerData?.firstName} {learnerData?.lastName}</h2>
                                <p className="text-gray-500 mb-4">{learnerData?.email}</p>

                                <div className="w-full bg-gray-50 p-4 rounded shadow">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Contact:</span>
                                            <span>{learnerData?.contact || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Location:</span>
                                            <span>{learnerData?.location || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Bio:</span>
                                            <span>{learnerData?.description || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Status:</span>
                                            <span className={learnerData?.disabled ? 'text-red-500' : 'text-green-500'}>
                                                {learnerData?.disabled ? 'Disabled' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}

export default LearnerModal;
