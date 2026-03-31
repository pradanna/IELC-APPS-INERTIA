import React from "react";
import { Building2, Target, TrendingUp } from "lucide-react";

export default function BranchPerformance({ data = [] }) {
    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
                        <Building2 size={18} className="text-primary-600" />
                        Branch Performance
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Real-time enrollment track</p>
                </div>
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <TrendingUp size={20} />
                </div>
            </div>

            <div className="space-y-8">
                {data.length > 0 ? (
                    data.map((branch, index) => {
                        const percentage = branch.goal > 0 
                            ? Math.min(Math.round((branch.enrolled / branch.goal) * 100), 100) 
                            : 0;
                        
                        return (
                            <div key={index} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{branch.name}</p>
                                        <p className="text-[11px] text-gray-400 uppercase font-bold mt-0.5">TARGET CABANG</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{branch.enrolled} / {branch.goal}</p>
                                        <p className="text-[11px] text-primary-600 font-bold mt-0.5">{percentage}% ACHIEVED</p>
                                    </div>
                                </div>
                                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                                            percentage >= 100 ? 'bg-green-500' : 'bg-primary-600'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    >
                                        {percentage > 10 && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-10 text-center text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                        Belum ada data performa cabang bulan ini.
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enrollment</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Goal</span>
                 </div>
            </div>
        </div>
    );
}
