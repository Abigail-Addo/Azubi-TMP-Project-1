import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdLogin } from "react-icons/md";
// import { useRouter } from 'next/navigation';

const Header = () => {
    // const router = useRouter();

    return (
        <>
            <header className='flex items-center justify-between container mx-auto h-24'>
                <div className='flex gap-6'>
                    {/* logo */}
                    <div className="flex justify-center">
                        {/* Small screen logo */}
                        <Image
                            src="/logo/logo-mobile.png"
                            alt="Logo Small"
                            width={100}
                            height={40}
                            className="block md:hidden w-auto h-auto"
                            priority
                        />
                        {/* Medium screen logo */}
                        <Image
                            src="/logo/logo-tablet.png"
                            alt="Logo Medium"
                            width={100}
                            height={30}
                            className="hidden md:block lg:hidden w-auto h-auto"
                            priority
                        />
                        {/* Large screen logo */}
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
                        <Link href="/home" >Home</Link>
                        <Link href="/courses" >Courses</Link>
                    </nav>
                </div>

                <div className='flex items-center justify-center gap-6'>
                    <button className='flex items-center justify-center gap-2 border border-[#01589A] text-[#01589A] h-10 w-32 cursor-pointer'>
                        Login <MdLogin />
                    </button>

                    <button className='flex items-center justify-center gap-2 h-10 w-32 bg-[#01589A] text-white cursor-pointer'>
                        Signup <MdLogin />
                    </button>
                </div>
            </header >
        </>
    )
}

export default Header
