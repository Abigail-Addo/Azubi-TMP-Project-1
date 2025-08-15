"use client"



import React, { ReactNode } from 'react'


import Sidebar from '@/components/sidebar/Sidebar';
type DefaultLayoutProps = {
    children: ReactNode
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <>
            <main className='lg:grid lg:grid-cols-4 w-screen h-screen gap-0 overflow-x-hidden overflow-y-auto'>
                <Sidebar />
                <div className='lg:col-span-3 container mx-auto px-8 pt-8 pb-12 overflow-y-auto'>
                    {children}
                </div>
            </main>
        </>
    )
}

export default DefaultLayout
