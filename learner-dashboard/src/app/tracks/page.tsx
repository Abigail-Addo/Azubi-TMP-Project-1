"use client";

import React from 'react';
import DefaultLayout from '../DefaultLayout';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getAllTracks } from '@/lib/features/tracks/trackSlice';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';

const Rating = dynamic(() => import('@/components/rating/Rating'), { ssr: false });

const Tracks = () => {
    const dispatch = useAppDispatch();
    const { tracks, fetchAllLoading } = useAppSelector((state) => state.tracks);
    const router = useRouter();

    React.useEffect(() => {
        dispatch(getAllTracks());
    }, [dispatch]);

    return (
        <DefaultLayout>
            <div className='bg-[#01589A] h-64 flex items-center justify-center text-white text-3xl'>
                <h1>Tracks</h1>
            </div>

            <div className='container mx-auto py-20'>
                <h1 className='font-bold text-3xl pb-8'>Top Tracks</h1>

                {fetchAllLoading ? (
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className='bg-white overflow-hidden flex flex-col h-full'
                            >
                                <Skeleton variant="rectangular" height={192} className="w-full" />
                                <div className='p-4 flex flex-col gap-4 flex-1'>
                                    <Skeleton variant="text" width="80%" height={32} />
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="rounded" width={100} height={28} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : tracks?.length === 0 ? (
                    <div className='w-full flex justify-center items-center h-64'>
                        <p>No tracks available</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className='bg-white overflow-hidden flex flex-col h-full'
                            >
                                <div className='w-full relative h-48'>
                                    <Image
                                        src={track.image || "/assets/images.png"}
                                        alt={track.name || "Track image"}
                                        fill
                                        className='object-cover'
                                    />
                                </div>

                                <div className='p-4 flex flex-col gap-3 flex-1'>
                                    <h1 className='text-lg font-bold'>{track.name}</h1>

                                    <p className='text-gray-700 truncate h-8'>{track.description}</p>

                                    <div className='flex items-center justify-between h-8'>
                                        <Rating />
                                        <p className='flex'><span className='font-bold'>Price:</span> ${track.price}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/tracks/track-details?id=${track.id}`)}
                                    className='flex items-center justify-center gap-2 h-10 w-full bg-[#01589A] hover:bg-[#014273] text-white cursor-pointer'
                                >
                                    Preview track
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Tracks;
