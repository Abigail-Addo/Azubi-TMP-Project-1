"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdLogin } from "react-icons/md";

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const handlePortal = () => {
        router.push('/portal');
    };

    return (
        <header className='flex items-center justify-between container mx-auto h-24'>
            <div className='flex gap-6'>
                {/* Logo */}
                <div className="flex justify-center">
                    <Image
                        src="/logo/logo-mobile.png"
                        alt="Logo Small"
                        width={100}
                        height={40}
                        className="block md:hidden w-auto h-auto"
                        priority
                    />
                    <Image
                        src="/logo/logo-tablet.png"
                        alt="Logo Medium"
                        width={100}
                        height={30}
                        className="hidden md:block lg:hidden w-auto h-auto"
                        priority
                    />
                    <Image
                        src="/logo/logo-tablet.png"
                        alt="Logo Large"
                        width={100}
                        height={40}
                        className="hidden lg:block w-auto h-auto"
                        priority
                    />
                </div>

                <nav className='flex items-center justify-center gap-6'>
                    <button onClick={() => router.push('/home')}>Home</button>
                    <button onClick={() => router.push('/tracks')}>Tracks</button>
                </nav>
            </div>

            <div className='flex items-center justify-center gap-6 relative'>
                {!user ? (
                    <>
                        <button
                            onClick={handleLogin}
                            className='flex items-center justify-center gap-2 border border-[#01589A] hover:text-[#014273] text-[#01589A] h-10 w-32 cursor-pointer'
                        >
                            Login <MdLogin />
                        </button>

                        <button
                            onClick={handleSignup}
                            className='flex items-center justify-center gap-2 h-10 w-32 bg-[#01589A] hover:bg-[#014273] text-white cursor-pointer'
                        >
                            Signup <MdLogin />
                        </button>
                    </>
                ) : (
                    <div className='flex items-center gap-2'>
                        <div
                            className='w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-[#01589A]'
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <Image
                                src="/assets/user.png"
                                alt="Profile"
                                width={40}
                                height={40}
                                className='object-cover'
                            />
                        </div>

                        {dropdownOpen && (
                            <div className='absolute right-0 mt-12 bg-white shadow-lg border rounded w-40 z-50'>
                                <button
                                    onClick={handlePortal}
                                    className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    Portal
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
