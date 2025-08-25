"use client"




import React from 'react'
import DefaultLayout from './DefaultLayout'
import dynamic from 'next/dynamic'
const Hero = dynamic(() => import('@/components/homepage/Hero'), { ssr: false });
const Tracks = dynamic(() => import('@/components/homepage/Tracks'), { ssr: false });
const NextStep = dynamic(() => import('@/components/homepage/NextSteps'), { ssr: false });
const Stats = dynamic(() => import('@/components/homepage/Stats'), { ssr: false });
const CtaBand = dynamic(() => import('@/components/homepage/CTABand'), { ssr: false });
const Description = dynamic(() => import('@/components/homepage/Description'), { ssr: false });

const Dashboard = () => {

  return (
    <>
      <DefaultLayout>
        <div className="h-full">
          <Hero />
          <Tracks />
          <NextStep />
          <Stats />
          <CtaBand />
          <Description />
        </div>
      </DefaultLayout>
    </>
  )
}

export default Dashboard
