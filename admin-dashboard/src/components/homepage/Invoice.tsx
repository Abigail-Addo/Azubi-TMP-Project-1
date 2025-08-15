import React from 'react'
import Image from 'next/image'

const invoices = [
    {
        name: 'James Anderson',
        amount: '$320',
        image: '/assets/user.png',
    },
    {
        name: 'Michael Johnson',
        amount: '$210',
        image: '/assets/user.png',
    },
    {
        name: 'David Brown',
        amount: '$315',
        image: '/assets/user.png',
    },
    {
        name: 'Orlando Diggs',
        amount: '$250',
        image: '/assets/user.png',
    },
];

const Invoice = () => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
            <h1 className="text-lg font-bold mb-4">Latest Invoice</h1>
            <hr className="border-[#E5E5EF]" />

            <div className="text-sm text-gray-400 flex justify-between px-2 py-3">
                <p>NAME</p>
                <p>AMOUNT</p>
            </div>

            <div className="space-y-2">
                {invoices.map((invoice, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between px-2 py-3 rounded-lg ${index % 2 === 0 ? 'bg-[#F9FAFB]' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={invoice.image}
                                alt={invoice.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                            <p className="">{invoice.name}</p>
                        </div>
                        <p className="">{invoice.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Invoice;
