import Image from "next/image";

const tech = [
    "ReactJs",
    "NextJs",
    "NodeJs",
    "Django",
    "MongoDB",
    "VueJs",
    "AWS",
    "Azure",
    "PowerBI",
    "Python",
    "Excel",
    "Tableau",
];

const borderColors = ['#28ACE2', '#77C053', '#A61D24', '#E6E6E6', '#999999', '#D89614'];

const NextStep = () => {
    return (
        <section className="relative overflow-hidden bg-[#0E5DA8] py-16 text-white">
            <div className="container mx-auto px-4">
                <div className="grid items-center gap-10 md:grid-cols-2">
                    {/* Left text and tech stack */}
                    <div>
                        <h2 className="text-3xl font-bold">What will be next step</h2>
                        <p className="mt-3 text-white/90">
                            Discover our diverse stack of solutions, including software
                            development, data science, and cloud tools. Sign up today and
                            kickstart your journey!
                        </p>

                        <div className="mt-6 grid grid-cols-4 gap-4">
                            {tech.map((t, index) => (
                                <span
                                    key={t}
                                    className="rounded-lg px-3 py-1 text-sm font-medium flex items-center justify-center"
                                    style={{ border: `1px solid ${borderColors[index % borderColors.length]}` }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right images */}
                    <div className="relative mx-auto w-full max-w-md flex justify-center items-center">
                        {/* Main image */}
                        <Image
                            src="/assets/section2.png"
                            alt="Devices preview"
                            width={800}
                            height={460}
                            className="rounded-xl"
                        />
                        {/* Smaller bottom-left overlapping image */}
                        <Image
                            src="/assets/section1.png"
                            alt="Second device preview"
                            width={100} // smaller than main image
                            height={100} // maintain aspect ratio
                            className="absolute bottom-4 left-23 rounded-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NextStep;
