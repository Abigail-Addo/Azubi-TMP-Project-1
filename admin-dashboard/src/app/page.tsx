"use client"




import React from 'react'
import DefaultLayout from './DefaultLayout'
import dynamic from 'next/dynamic'
const Tracks = dynamic(() => import('@/components/homepage/Tracks'), { ssr: false });
const Card = dynamic(() => import('@/components/homepage/Card'), { ssr: false });
const Chart = dynamic(() => import('@/components/homepage/Chart'), { ssr: false });
const Invoice = dynamic(() => import('@/components/homepage/Invoice'), { ssr: false });

const Dashboard = () => {

  return (
    <>
      <DefaultLayout>
        <div className='grid grid-cols-1 gap-8 w-full'>
          {/* header */}
          <header className='h-24 grid grid-cols-1 items-center'>
            <h1 className='font-bold text-xl'>Welcome Admin&#128075;</h1>
            <p>Track activity, trends, and popular destinations in real time</p>
          </header>

          {/* card */}
          <Card />

          {/* tracks */}
          <Tracks />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* charts */}
            <Chart />

            {/* invoice */}
            <Invoice />
          </div>
        </div>

      </DefaultLayout>
    </>
  )
}

export default Dashboard
