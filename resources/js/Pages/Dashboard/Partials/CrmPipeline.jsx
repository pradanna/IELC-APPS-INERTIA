import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Filter, Users } from "lucide-react";

export default function CrmPipeline({ data = [] }) {
    const totalLeads = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
                        <Filter size={18} className="text-primary-600" />
                        CRM Lead Distribution
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Current Pipeline Status</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 leading-none">{totalLeads}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Total Prospek</p>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1500}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '8px 12px'
                                }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                        Belum ada data prospek.
                    </div>
                )}
                
                {data.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <Users size={24} className="mx-auto text-gray-300" />
                    </div>
                )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                            <span className="text-[11px] font-bold text-gray-600 truncate uppercase tracking-tight">{item.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900 ml-2">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
