import React from 'react';
import { Package, TrendingUp, Award } from 'lucide-react';

export default function TopPackages({ data = [] }) {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
                        <Package size={18} className="text-primary-600" />
                        Top Performing Packages
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Highest cumulative enrollments</p>
                </div>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Award size={20} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Paket & Type</th>
                            <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Price</th>
                            <th scope="col" className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Siswa Terdaftar</th>
                            <th scope="col" className="px-4 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 uppercase tracking-tight">
                        {data.length > 0 ? (
                            data.map((pkg, index) => (
                                <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                                    <th scope="row" className="px-4 py-4 pr-10 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-none">{pkg.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">MASTER PACKAGE</p>
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-700">{pkg.price}</span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-sm font-bold text-gray-900">{pkg.sales}</span>
                                            <span className="text-[11px] font-bold text-gray-500">SISWA</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1 px-2 bg-green-50 text-green-600 rounded-md text-[10px] font-bold flex items-center gap-1 ml-auto w-fit">
                                            <TrendingUp size={12} />
                                            TOP SELL
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-10 text-center text-gray-400 italic text-sm">
                                    Belum ada data penjualan paket kursus.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
