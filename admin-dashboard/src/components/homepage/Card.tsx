import React from 'react'
import Image from 'next/image'

const Card = () => {
    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='flex items-center justify-between p-8 bg-white shadow-lg rounded-2xl'>
                    <div>
                        <p className='pb-6'>Total Learners</p>
                        <h1 className='text-2xl font-bold pb-4'>12,450</h1>
                        <p className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="up-arrow" className='fill-[#027A48] w-6 h-6'>
                                <path d="M16,12a1,1,0,0,1-.71-.29L12,8.41,8.71,11.71a1,1,0,0,1-1.41-1.41l4-4a1,1,0,0,1,1.41,0l4,4A1,1,0,0,1,16,12Z"></path>
                                <path d="M12,18a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0V17A1,1,0,0,1,12,18Z"></path>
                            </svg>
                            <span className='text-[#027A48]'>12% </span>  vs last month
                        </p>
                    </div>
                    <div className='w-16 h-16'>
                        <Image src="/assets/VectorHome.png" alt='icon' width={100} height={100} />
                    </div>
                </div>
                <div className='flex items-center justify-between p-8 bg-white shadow-lg rounded-2xl'>
                    <div>
                        <p className='pb-6'>Revenue</p>
                        <h1 className='text-2xl font-bold pb-4'>12,450</h1>
                        <p className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="up-arrow" className='fill-[#027A48] w-6 h-6'>
                                <path d="M16,12a1,1,0,0,1-.71-.29L12,8.41,8.71,11.71a1,1,0,0,1-1.41-1.41l4-4a1,1,0,0,1,1.41,0l4,4A1,1,0,0,1,16,12Z"></path>
                                <path d="M12,18a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0V17A1,1,0,0,1,12,18Z"></path>
                            </svg>
                            <span className='text-[#027A48]'>12% </span>  vs last month
                        </p>
                    </div>
                    <div className='w-16 h-16'>
                        <Image src="/assets/Subtract.png" alt='icon' width={100} height={100} />
                    </div>
                </div>
                <div className='flex items-center justify-between p-8 bg-white shadow-lg rounded-2xl'>
                    <div>
                        <p className='pb-6'>Invoice</p>
                        <h1 className='text-2xl font-bold pb-4'>100</h1>
                        <p className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="up-arrow" className='fill-[#027A48] w-6 h-6'>
                                <path d="M16,12a1,1,0,0,1-.71-.29L12,8.41,8.71,11.71a1,1,0,0,1-1.41-1.41l4-4a1,1,0,0,1,1.41,0l4,4A1,1,0,0,1,16,12Z"></path>
                                <path d="M12,18a1,1,0,0,1-1-1V7a1,1,0,0,1,2,0V17A1,1,0,0,1,12,18Z"></path>
                            </svg>
                            <span className='text-[#027A48]'>12% </span>  vs last month
                        </p>
                    </div>
                    <div className='w-16 h-16'>
                        <Image src="/assets/Frame.png" alt='icon' width={100} height={100} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
