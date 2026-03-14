import React from 'react';

const topPackagesData = [
    {
        name: 'Group Kids A (Beginner)',
        level: 'Kids',
        price: 1500000,
        students: 78,
    },
    {
        name: 'IELTS Intensive',
        level: 'Exam Prep',
        price: 3250000,
        students: 45,
    },
    {
        name: 'General English (Private)',
        level: 'Adult',
        price: 4500000,
        students: 32,
    },
];

export default function TopPackages() {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Top Performing Packages</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 font-medium">Package Name</th>
                            <th scope="col" className="px-4 py-3 font-medium">Price</th>
                            <th scope="col" className="px-4 py-3 font-medium text-right">Students Enrolled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topPackagesData.map((pkg) => (
                            <tr key={pkg.name} className="bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                    {pkg.name}
                                    <p className="text-xs text-gray-500 font-normal">{pkg.level}</p>
                                </th>
                                <td className="px-4 py-3">
                                    {pkg.price.toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    })}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900">{pkg.students}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
