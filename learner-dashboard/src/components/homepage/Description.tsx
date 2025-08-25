"use client";

import Image from "next/image";

const loginSteps = [
    {
        id: 1,
        title: "Secure Login",
        img: "/assets/undraw_secure-login_m11a.png",
    },
    {
        id: 2,
        title: "Authentication",
        img: "/assets/undraw_authentication_tbfc.png",
    },
    {
        id: 3,
        title: "Choose a course",
        img: "",
        courses: [
            {
                name: "Software Development",
                desc: "Unlock your potential with comprehensive training in modern software development.",
                price: "$350",
                icon: "/assets/code-svgrepo-com 1.png",
            },
            {
                name: "Data Science Mastery",
                desc: "Equip yourself with the skills to analyze, interpret, and leverage data, becoming an expert.",
                price: "$350",
                icon: "/assets/data-collection-svgrepo-com 1.png",
            },
            {
                name: "Cloud Computing Expertise",
                desc: "Gain hands-on experience in cloud architecture, preparing you to manage scalable solutions.",
                price: "$350",
                icon: "/assets/cloud-svgrepo-com 1.png",
            },
        ],
    },
];

const descriptionSteps = [
    {
        id: 1,
        title: "Sign Up and Choose Your Course",
        text: "Create your account quickly with just your email or social media login, then explore a wide range.",
        img: "/assets/login-2-svgrepo-com 1.png",
    },
    {
        id: 2,
        title: "Onboarding",
        text: "Get started seamlessly with a smooth onboarding experience. Learn the essentials and set yourself up for success from day one.",
        img: "/assets/onboard-svgrepo-com 1.png",
    },
    {
        id: 3,
        title: "Start Learning",
        text: "Begin your learning journey with practical, hands-on experience. Build the skills needed to implement effective solutions.",
        img: "/assets/student-svgrepo-com 1.png",
    },
];

const Description = () => {
    return (
        <section className="bg-white py-16 h">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="grid grid-cols-1 justify-between h-full">
                    {descriptionSteps.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center w-full">
                            <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl bg-white p-6 shadow-md w-full h-full">
                                <div className="flex-shrink-0">
                                    <Image src={s.img} alt={s.title} width={40} height={40} className="object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">{s.title}</h4>
                                    <p className="mt-2 text-slate-600">{s.text}</p>
                                </div>
                            </div>

                            {i < descriptionSteps.length - 1 && (
                                <div className="flex justify-center items-center">
                                    <Image
                                        src="/assets/Arrow 1.png"
                                        alt="Arrow"
                                        width={30}
                                        height={30}
                                        className="object-contain"
                                    />
                                </div>
                            )}


                        </div>
                    ))}
                </div>

                {/* Right column */}
                <div className="rounded-2xl bg-white p-6 shadow-md flex flex-col h-full">
                    <div className="grid md:grid-cols-2 gap-10 text-center items-start h-full">
                        {loginSteps.map((s) => (
                            <div key={s.id} className={`flex flex-col items-center gap-4 ${s.courses ? "md:col-span-2" : ""} h-full`}>
                                <p className="font-semibold">Step {s.id}</p>
                                <h4 className="text-lg font-semibold">{s.title}</h4>

                                {s.img && (
                                    <Image src={s.img} alt={s.title} width={180} height={180} className="object-contain" />
                                )}

                                {s.courses && (
                                    <div className="mt-6 grid md:grid-cols-3 gap-6 w-full h-full">
                                        {s.courses.map((c) => (
                                            <div key={c.name} className="flex flex-col h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left hover:shadow-md transition">
                                                <div className="flex-shrink-0 mb-4">
                                                    <Image src={c.icon} alt={c.name} width={30} height={30} />
                                                </div>
                                                <h5 className="font-semibold mb-2">{c.name}</h5>
                                                <p className="text-slate-600 text-sm flex-grow">{c.desc}</p>
                                                <p className="mt-4 font-semibold">Price: {c.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Description;
