import React from 'react'
import Image from 'next/image'

const Footer = () => {
    const [year, setYear] = React.useState<number | null>(null);

    React.useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <footer className='bg-[#01589A] text-white h-64'>
                <div className='container mx-auto my-auto grid grid-cols-2 items-center justify-center h-full w-full'>
                    <div className='w-fit h-fit '>
                        <Image
                            src="/logo/azubi-logo.png"
                            alt="Logo Small"
                            width={250}
                            height={250}
                            className=""
                            objectFit='fill'
                            priority
                        />
                    </div>

                    <div className='flex items-center justify-evenly'>
                        <div className='flex flex-col items-start justify-center gap-4'>
                            <h1 className='font-bold'>Home</h1>
                            <nav>Menu</nav>
                            <nav>Courses</nav>
                        </div>
                        <div className='flex flex-col items-start justify-center gap-4'>
                            <h1 className='font-bold'>Contact</h1>
                            <nav>+23341002000</nav>
                            <nav>New  Reiss ,Ghana, Accra </nav>
                        </div>
                        <div className='flex flex-col items-start justify-center gap-4'>
                            <h1 className='font-bold'>Social</h1>
                            <nav>LinkedIn</nav>
                            <nav>Facebook</nav>
                        </div>
                    </div>

                    <div className='col-span-2'>
                        <hr />
                        <p className='pt-6'>&copy; copyright {year ?? ""} - G-client, All rights reserved</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
