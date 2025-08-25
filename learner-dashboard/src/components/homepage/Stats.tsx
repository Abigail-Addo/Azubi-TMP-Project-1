import Image from "next/image";

const items = [
    { label: "Courses", value: "4+", icon: "/assets/student-cap-svgrepo-com 1.png" },
    { label: "Course students", value: "200+", icon: "/assets/student-person-part-2-svgrepo-com (1) 1.png" },
    { label: "Hours of content", value: "250+", icon: "/assets/clock-circle-svgrepo-com 1.png" },
];

const Stats = () => {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-2 text-center text-3xl font-bold">We are proud</h2>
                <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
                    We take pride in our achievements and commitment to excellence. Join
                    us in celebrating innovation, growth, and success.
                </p>

                <div className="grid gap-6 sm:grid-cols-3">
                    {items.map((it) => (
                        <div
                            key={it.label}
                            className="border-r border-r-[#679BC2] flex flex-col justify-center items-center"
                        >
                            <div className="mb-3">
                                <Image
                                    src={it.icon}
                                    alt={it.label}
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className="text-4xl font-extrabold text-[#01589A]">
                                {it.value}
                            </div>
                            <div className="mt-1 text-slate-600">{it.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

export default Stats;
