"use client"



import React, { ReactNode } from 'react'
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

type DefaultLayoutProps = {
    children: ReactNode
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <>
            <main className='w-screen h-screen relative overflow-y-scroll '>
                <Header />
                <div className=''>
                    {children}
                </div>

                <Footer />
            </main>
        </>
    )
}

export default DefaultLayout
