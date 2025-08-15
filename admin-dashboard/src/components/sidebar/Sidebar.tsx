"use client"



import React from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import { FiFileText } from "react-icons/fi";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('./Footer'), { ssr: false });
import { RiGraduationCapLine } from "react-icons/ri";
import { TbUsersGroup } from "react-icons/tb";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <>
            <aside className='hidden lg:block bg-[#01589A] p-6 overflow-x-hidden overflow-y-auto relative'>
                {/* logo */}
                <div className="flex justify-center bg-white p-6 rounded-md">
                    <Image
                        src="/logo/logo-tablet.png"
                        alt="Logo Large"
                        width={100}
                        height={40}
                        className="hidden lg:block w-auto h-auto"
                        priority
                    />
                </div>

                <div className='py-8 grid grid-cols-1 gap-2'>
                    {/* dashboard */}
                    <Link href="/"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <MdOutlineDashboard className='text-2xl' />
                        Dashboard
                    </Link>
                    {/* invoice */}
                    <Link href="/invoices"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/invoices'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <FiFileText className='text-2xl' />
                        Invoices
                    </Link>
                    {/* learners */}
                    <Link href="/learners"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/learners'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <TbUsersGroup className='text-2xl' />
                        Learners
                    </Link>
                    {/* tracks */}
                    <Link href="/tracks"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/tracks'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <RiGraduationCapLine className='text-2xl' />
                        Tracks
                    </Link>
                    {/* courses */}
                    <Link href="/courses"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/courses'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <RiGraduationCapLine className='text-2xl' />
                        Courses
                    </Link>
                    {/* report */}
                    <Link href="/report"
                        className={clsx(
                            'flex items-center gap-6 text-xl py-6 p-3 transition-colors duration-200 rounded-md',
                            pathname === '/report'
                                ? 'bg-[#E6EFF5] text-[#014273] hover:text-[#01589A]'
                                : 'text-white hover:text-[#014273] focus:text-[#014273] ] focus:bg-[#E6EFF5] hover:bg-[#E6EFF5]'
                        )}>
                        <MdOutlineDashboard className='text-2xl' />
                        Report
                    </Link>
                </div>

                {/* footer */}
                <Footer />

            </aside>
        </>
    )
}

export default Sidebar
