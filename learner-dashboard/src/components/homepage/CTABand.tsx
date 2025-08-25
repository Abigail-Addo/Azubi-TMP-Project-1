import Image from "next/image";

const CtaBand = () => {
    return (
        <section className="relative overflow-hidden bg-[#0E5DA8] opacity-90 py-16">
            <div className="container mx-auto">
                {/* Background image with overlay */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/assets/cta-hero.jpg"
                        alt="CTA background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#0E5DA8] opacity-70"></div>
                </div>

                {/* Content */}
                <div className="relative mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            It&apos;s time to start investing in yourself
                        </h3>
                        <p className="text-white mt-2">
                            Online courses open the opportunity for learning to almost anyone, regardless of their scheduling commitments.
                        </p>
                    </div>
                    <a
                        href="#solutions"
                        className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-[#0E5DA8] shadow hover:bg-slate-100"
                    >
                        Get started
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CtaBand;
