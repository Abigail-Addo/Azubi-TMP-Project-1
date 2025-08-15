"use client"



import React from 'react'
import DefaultLayout from '../DefaultLayout'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { CiSearch } from "react-icons/ci";
import Image from 'next/image';
const TracksModal = dynamic(() => import('@/components/modal/TracksModal'), { ssr: false });
import dynamic from "next/dynamic";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllTracks } from '@/lib/features/tracks/trackSlice';
import { Skeleton } from '@mui/material';

const Tracks = () => {
    const [modalMode, setModalMode] = React.useState<'create' | 'edit'>('create');
    const [openModal, setOpenModal] = React.useState(false);
    const dispatch = useAppDispatch();
    const { tracks, fetchAllLoading } = useAppSelector((state) => state.tracks)


    React.useEffect(() => {
        dispatch(getAllTracks());
    }, [dispatch])

    // function to open the edit modal
    const showModal = (newOpen: boolean) => () => {
        if (!newOpen) {
            // setSelectedTransGate(null);
        }
        setOpenModal(newOpen);
    };


    return (
        <>
            <DefaultLayout>
                <div className='grid grid-cols-1 gap-8 w-full'>
                    {/* header */}
                    <header className='h-24 grid grid-cols-1 items-center'>
                        <h1 className='font-bold text-xl'>Manage Tracks</h1>
                        <p>Filter, sort and access detailed tracks</p>
                    </header>

                    <div className='flex flex-col lg:flex-row gap-4 items-center lg:justify-between justify-end w-full'>
                        {/* search */}
                        <FormControl sx={{ m: 1, width: '35ch' }} >
                            <OutlinedInput
                                id="outlined-adornment-search"
                                placeholder="Search Track"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CiSearch />
                                    </InputAdornment>
                                }
                                aria-describedby="outlined-search-helper-text"
                                inputProps={{
                                    'aria-label': 'search track',
                                }}
                                sx={{
                                    backgroundColor: '#F9FAFB',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                    borderRadius: '8px',
                                    height: '40px',
                                }}
                            />
                        </FormControl>
                        {/* button */}
                        <div className="flex ml-auto">
                            <button
                                type="submit"
                                className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer`}
                                onClick={() => {
                                    setOpenModal(true);
                                    setModalMode('create');
                                }}
                            >
                                + Add track
                            </button>
                        </div>
                    </div>

                    <div>
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
                                    {tracks.map((track, index) => (

                                        <div key={track.id || index} className='grid grid-cols-1 bg-white shadow-lg rounded-2xl h-full'>
                                            {/* image */}
                                            <div className='w-full h-72 overflow-hidden rounded-t-2xl'>
                                                <Image
                                                    src={track?.image ?? "/assets/images.png"}
                                                    alt={track?.name ?? "track image"}
                                                    width={1000}
                                                    height={1000}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>

                                            <div className='py-6 px-4 flex flex-col gap-6 flex-grow'>
                                                {/* name */}
                                                <h1 className='text-lg font-bold h-8 '>{track.name}</h1>
                                                {/* description */}
                                                <p className="h-16">
                                                    {track?.description?.length > 50
                                                        ? track.description.substring(0, 50) + "..."
                                                        : track.description}
                                                </p>
                                                {/* duration */}
                                                <p className='flex gap-3 items-center h-6'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="calendar">
                                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                        <path d="M20 3h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H7V2c0-.55-.45-1-1-1s-1 .45-1 1v1H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 18H5c-.55 0-1-.45-1-1V8h16v12c0 .55-.45 1-1 1z"></path>
                                                    </svg>
                                                    {track.duration}
                                                </p>
                                                {/* instructor */}
                                                <p className='flex gap-3 items-center h-6'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                                    {track.instructor}
                                                </p>
                                                {/* courses */}
                                                <div className='flex items-center gap-2 flex-wrap h-6'>
                                                    {track?.courses && track.courses?.length > 0 ? (
                                                        <p className='text-[#175CD3] bg-[#E9F3FB] rounded-full py-1 px-4'>
                                                            {track.courses[0].title}
                                                        </p>
                                                    ) : (
                                                        <p className="text-gray-400 text-sm">No course available</p>
                                                    )}
                                                </div>


                                                <Link href={`/tracks/track-details?id=${track.id}`} className='underline text-blue-600 text-sm text-end h-6'>View details</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </DefaultLayout>

            {/* Track modal */}
            <TracksModal
                open={openModal}
                handleClose={showModal(false)}
                // trackData={selectedAccountCate}
                mode={modalMode}
            />
        </>
    )
}

export default Tracks
