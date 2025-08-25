import React from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllTracks } from '@/lib/features/tracks/trackSlice';
import { Skeleton } from '@mui/material';

const Tracks = () => {
    const dispatch = useAppDispatch();
    const { tracks, fetchAllLoading } = useAppSelector((state) => state.tracks);

    React.useEffect(() => {
        dispatch(getAllTracks());
    }, [dispatch]);

    const firstFourTracks = tracks.slice(0, 4);

    return (
        <>
            <section className='py-10'>
                <div className='container mx-auto '>
                    <div className='flex flex-col items-center justify-between py-6 gap-4'>
                        <h1 className='text-2xl font-bold'>Our Solutions</h1>
                        <p>Create your account quickly with just your email or social media login, then explore a wide range </p>
                    </div>
                    {/* loading tracks spinner */}
                    {fetchAllLoading ? (
                        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className='grid grid-cols-1 items-center justify-between bg-white shadow-lg rounded-2xl h-fit max-h-96'>
                                    <Skeleton variant="rectangular" height={192} className="rounded-t-lg w-full" />
                                    <div className='py-6 px-4 flex flex-col gap-6'>
                                        <Skeleton variant="text" width="80%" height={32} />
                                        <Skeleton variant="text" width="60%" height={24} />
                                        <Skeleton variant="rounded" width={100} height={28} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) :
                        // no tracks rows
                        tracks?.length === 0 ? (
                            <div className='w-full flex justify-center items-center h-full"'>
                                <p>No tracks available</p>
                            </div>
                        ) : (

                            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                                {firstFourTracks.map((track) => (
                                    <div key={track.id} className='grid grid-cols-1 items-center justify-between bg-white shadow-lg rounded-2xl h-fit max-h-96'>
                                        <div className='w-full'>
                                            <Image
                                                src={track.image || "/assets/images.png"}
                                                alt={track.name || "Track image"}
                                                width={1000}
                                                height={1000}
                                                className='rounded-t-lg object-cover h-48 w-full'
                                            />
                                        </div>

                                        <div className='py-6 px-4 flex flex-col gap-6'>
                                            <h1 className='text-lg font-bold  h-8'>{track.name}</h1>

                                            <p className='flex gap-3 items-center h-6'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="calendar">
                                                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                    <path d="M20 3h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H7V2c0-.55-.45-1-1-1s-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 18H5c-.55 0-1-.45-1-1V8h16v12c0 .55-.45 1-1 1z"></path>
                                                </svg>
                                                {track.duration}
                                            </p>

                                            <div className='flex items-center gap-2 flex-wrap h-6'>
                                                {track.courses && track.courses.length > 0 ? (
                                                    <p className='text-[#175CD3] bg-[#E9F3FB] rounded-full py-1 px-4'>
                                                        {track.courses[0].title}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-400 text-sm">No course</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </section>
        </>
    )
}

export default Tracks
