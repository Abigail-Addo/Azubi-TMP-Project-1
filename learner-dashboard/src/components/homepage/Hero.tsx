import React from 'react'
import Image from 'next/image'

const Hero = () => {
    return (
        <section className="relative overflow-hidden min-h-[70vh]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/hero.jpg"
                    alt="Hero background"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#01589A]/95 via-[#01589A]/80 to-transparent opacity-60"></div>
            </div>

            {/* Content */}
            <div className="relative container mx-auto py-20 sm:py-24  w-full">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    <div className="text-white">
                        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                            Unlock Your Potential with
                            <br />
                            <span className="text-white/95">Industry-Leading Courses!</span>
                        </h1>
                        <p className="mt-4 max-w-xl text-white/85">
                            &quot;Join thousands of learners gaining real-world skills and
                            advancing their careers. Our expert-led courses are designed to
                            empower you to succeed.&quot;
                        </p>
                        <div className="mt-8">
                            <button className='flex items-center justify-center gap-2 h-10 w-32 bg-[#01589A] hover:bg-[#014273] text-white cursor-pointer'>
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
