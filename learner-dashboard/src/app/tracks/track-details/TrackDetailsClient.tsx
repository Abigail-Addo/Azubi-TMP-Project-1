"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getSingleTrack, getAllTracks } from "@/lib/features/tracks/trackSlice";
import DefaultLayout from "../../DefaultLayout";
import Image from "next/image";
import Rating from "@/components/rating/Rating";
import Link from "next/link";
import { enrollTrack, resetEnrollmentState } from "@/lib/features/trackEnrollment/trackEnrollmentSlice";

const TrackDetailsClient = () => {
    const dispatch = useAppDispatch();
    const { tracks, fetchOneLoading } = useAppSelector((state) => state.tracks);
    const { loading, success, error, message, transactionUrl } = useAppSelector(
        (state) => state.enrollment
    );

    const searchParams = useSearchParams();
    const trackId = searchParams.get("id");
    const track = tracks.find((t) => t.id === trackId);

    // Fetch track data
    React.useEffect(() => {
        dispatch(getAllTracks());
        if (trackId) dispatch(getSingleTrack(trackId));
    }, [dispatch, trackId]);

    const handleEnroll = () => {
        if (!track) return;
        dispatch(
            enrollTrack({
                track: track.id,
                amount: track.price,
                paystackCallbackUrl: "http://localhost:3000/payment",
            })
        );
    };

    const handleCloseModal = () => dispatch(resetEnrollmentState());

    const renderModal = () => {
        if (!success && !error) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
                    {success ? (
                        <>
                            <h2 className="text-2xl font-bold mb-2">Enrollment Successful!</h2>
                            <p className="mb-4">{message}</p>
                            <a
                                href={transactionUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Proceed to Payment
                            </a>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-2 text-red-600">Enrollment Failed</h2>
                            <p className="mb-4">{error}</p>
                        </>
                    )}
                    <button
                        onClick={handleCloseModal}
                        className="mt-4 underline text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    if (fetchOneLoading || !tracks.length) {
        return (
            <DefaultLayout>
                <div className="container mx-auto py-20">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-full mt-2"></div>
                        <div className="h-32 bg-gray-300 rounded mt-4"></div>
                        <div className="flex gap-4 mt-4">
                            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            {/* Hero Section */}
            <div className="relative bg-[#01589A] py-16 text-white">
                <div className="container mx-auto flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 relative z-10">
                        <p className="text-sm text-gray-200 flex gap-5">
                            <Link href="/" className="hover:underline">Home</Link> &gt;{" "}
                            <Link href="/tracks" className="hover:underline">Tracks</Link> &gt;{" "}
                            <span className="text-white font-bold">{track?.name}</span>
                        </p>
                        <h1 className="text-3xl font-bold mt-4">{track?.name}</h1>
                        <p className="mt-4 max-w-2xl">{track?.description}</p>
                        <div className="mt-6 flex gap-12">
                            <div>
                                <p className="font-semibold">Instructor</p>
                                <p>{track?.instructor || "John Doe"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">1 review</p>
                                <div className="flex items-center gap-1"><Rating /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay Card */}
                <div className="absolute bottom-0 right-25 translate-y-1/2 bg-white text-black p-5 rounded-lg shadow-lg max-w-sm w-full">
                    <div className="relative w-full h-32">
                        <Image
                            src={track?.image || "/assets/images.png"}
                            alt="Course image"
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="flex justify-between">
                            <span>Duration</span>
                            <span>{track?.duration || "12 weeks"}</span>
                        </div>
                        <hr className="text-gray-200" />
                        <div className="flex justify-between">
                            <span>Courses</span>
                            <span>{track?.courses?.length || 4}</span>
                        </div>
                        <hr className="text-gray-200" />
                        <div className="flex justify-between">
                            <span>Instructor</span>
                            <span>{track?.instructor || "John Doe"}</span>
                        </div>
                        <hr className="text-gray-200" />
                        <div className="flex justify-between">
                            <span>Date</span>
                            <span>{track?.createdAt ? new Date(track.createdAt).toLocaleDateString() : "N/A"}</span>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xl font-bold">${track?.price}</p>
                        <button
                            className="mt-3 w-full bg-[#01589A] hover:bg-[#014273] text-white py-2 rounded-lg"
                            onClick={handleEnroll}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Enroll"}
                        </button>
                    </div>
                </div>
            </div>

            {/* What you'll learn */}
            <div className="container mx-auto py-24">
                <div className="w-2/4 border border-gray-300 p-6">
                    <h2 className="text-xl font-bold mb-4">What you&apos;ll learn</h2>
                    <p className="mt-4 max-w-2xl">{track?.description}</p>
                </div>
            </div>

            {/* Related Courses */}
            <div className="container mx-auto pb-20">
                <h2 className="text-xl font-bold mb-6">Explore related courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tracks.slice(0, 2).map((t) => (
                        <div key={t.id} className="bg-white rounded-lg shadow-md p-6 grid grid-cols-3 gap-4">
                            <div className="relative w-full h-24 rounded-lg overflow-hidden">
                                <Image
                                    src={t.image}
                                    alt="Track Image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-lg"
                                />
                            </div>
                            <p className="text-gray-600 col-span-2 p-2">{t.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enrollment Modal */}
            {renderModal()}
        </DefaultLayout>
    );
};

export default TrackDetailsClient;
