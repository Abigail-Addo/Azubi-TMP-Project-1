"use client";

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getSingleTrack, getAllTracks, deleteTrack } from '@/lib/features/tracks/trackSlice';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import dynamic from 'next/dynamic';
import { Alert, Skeleton, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";

const Rating = dynamic(() => import('@/components/rating/Rating'), { ssr: false });
const AlertDialog = dynamic(() => import('@/components/dialogue/AlertDialogue'), { ssr: false });
const TracksModal = dynamic(() => import('@/components/modal/TracksModal'), { ssr: false });

const TrackDetailsContent: React.FC = () => {
    const alertRef = React.useRef<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('edit');
    const [openModal, setOpenModal] = React.useState(false);
    const [dialogueVisible, setDialogueVisible] = React.useState(false);
    const router = useRouter();

    const dispatch = useAppDispatch();
    const { tracks, fetchOneLoading } = useAppSelector((state) => state.tracks);

    const searchParams = useSearchParams();
    const trackId = searchParams.get('id');

    const track = tracks.find((t) => t.id === trackId);

    React.useEffect(() => {
        dispatch(getAllTracks());
        if (trackId) {
            dispatch(getSingleTrack(trackId));
        }
    }, [dispatch, trackId]);

    // Show Alert Function
    const showAlert = (severity: 'success' | 'error', message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    const disable = () => setDialogueVisible(true);

    const handleDeleteConfirm = async () => {
        if (!trackId) {
            showAlert('error', 'No track found');
            return;
        }
        const result = await dispatch(deleteTrack(trackId));
        if (deleteTrack.fulfilled.match(result)) {
            await dispatch(getAllTracks());
            showAlert('success', 'Track deleted');
            setDialogueVisible(false);
            router.back();
        } else {
            showAlert('error', 'Failed to delete track');
            setDialogueVisible(false);
        }
    };

    const edit = () => {
        setModalMode('edit');
        setOpenModal(true);
    };

    const showModal = (newOpen: boolean) => () => setOpenModal(newOpen);

    return (
        <>
            {/* Snackbar for alerts */}
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

            {/* Back button */}
            <div onClick={() => router.back()}>
                <p className='flex items-center gap-2 text-md cursor-pointer text-blue-500'>
                    <IoArrowBack /> Go back
                </p>
            </div>

            {/* Track content */}
            {fetchOneLoading || !track ? (
                // Skeleton Loader
                <div className='flex w-full lg:w-3/4 mx-auto'>
                    <div className='grid grid-cols-1 bg-white shadow-lg rounded-2xl h-fit max-h-full mx-auto w-full'>
                        <Skeleton variant="rectangular" height={288} className="rounded-t-2xl w-full" />
                        <div className='py-6 px-8 flex flex-col gap-6'>
                            <Skeleton variant="text" width="40%" height={40} />
                            <div className='flex justify-between items-center'>
                                <Skeleton variant="text" width={120} height={30} />
                                <Skeleton variant="text" width={120} height={30} />
                                <Skeleton variant="text" width={60} height={30} />
                            </div>
                            <div className='flex items-center justify-between flex-wrap gap-2'>
                                <Skeleton variant="rounded" width={100} height={30} />
                                <Skeleton variant="text" width={80} height={30} />
                            </div>
                            <Skeleton variant="text" width="100%" height={80} />
                            <div className='flex items-center justify-end gap-2'>
                                <Skeleton variant="circular" width={48} height={48} />
                                <Skeleton variant="circular" width={48} height={48} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Track details
                <div className='flex w-full lg:w-3/4 mx-auto'>
                    <div className='grid grid-cols-1 bg-white shadow-lg rounded-2xl h-fit max-h-full mx-auto'>
                        <div className='w-full h-72 overflow-hidden rounded-t-2xl'>
                            <Image
                                src={track.image || "/assets/images.png"}
                                alt='icon'
                                width={1000}
                                height={1000}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <div className='py-6 px-8 flex flex-col gap-6'>
                            <h1 className='text-2xl font-bold'>{track.name}</h1>

                            <div className='flex justify-between items-center'>
                                <div className='flex gap-6'>
                                    <p className='flex gap-3 items-center'>{track.duration}</p>
                                    <p className='flex gap-3 items-center'>{track.instructor}</p>
                                </div>
                                <p className='text-xl font-bold'>${track.price}</p>
                            </div>

                            <div className='flex items-center justify-between flex-wrap gap-2'>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    {track?.courses && track.courses.length > 0 && track.courses[0]?.title ? (
                                        <p className='text-[#027A48] bg-[#ECFDF3] rounded-full py-1 px-4'>
                                            {track.courses[0].title}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 text-sm">No course available</p>
                                    )}
                                </div>
                                <Rating />
                            </div>

                            <p className='text-justify'>{track.description}</p>

                            <div className='flex items-center justify-end gap-2'>
                                <div className='text-2xl bg-[#EEF9FF] p-4 cursor-pointer' onClick={edit}>
                                    <MdOutlineEdit />
                                </div>
                                <div className='text-2xl bg-[#EEF9FF] p-4 cursor-pointer' onClick={disable}>
                                    <MdDeleteOutline />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Dialogue */}
            {dialogueVisible && (
                <AlertDialog
                    text="You're about to delete a track. Confirm to continue."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDialogueVisible(false)}
                />
            )}

            {/* Modal */}
            <TracksModal
                open={openModal}
                handleClose={showModal(false)}
                trackData={track}
                mode={modalMode}
            />
        </>
    );
};

export default TrackDetailsContent;
