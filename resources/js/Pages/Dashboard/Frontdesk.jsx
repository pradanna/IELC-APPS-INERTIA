import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import ExecutiveKpiCards from "./Partials/ExecutiveKpiCards";
import { UserPlus, Calendar, PhoneCall, ExternalLink, Clock } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Frontdesk({ branchName, stats, recentLeads, upcomingFollowups }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            Frontdesk Dashboard <span className="text-primary-600">@{branchName}</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">Welcome back! Here's what's happening at your branch today.</p>
                    </div>
                </div>

                {/* KPI Section */}
                <ExecutiveKpiCards stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leads Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <UserPlus size={16} className="text-primary-500" />
                                Recent Leads
                            </h3>
                            <Link href={route('admin.crm.leads.index')} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                View All <ExternalLink size={10} />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentLeads.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-xs font-bold ring-1 ring-primary-100">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{lead.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                                            {lead.lead_source?.name || 'Manual'}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-400">
                                                            Registered {new Date(lead.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div 
                                                className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter"
                                                style={{ 
                                                    backgroundColor: `${lead.lead_status?.bg_color || '#f3f4f6'}`, 
                                                    color: `${lead.lead_status?.text_color || '#374151'}` 
                                                }}
                                            >
                                                {lead.lead_status?.name}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-xs">No recent leads found.</div>
                            )}
                        </div>
                    </div>

                    {/* Pending Follow-ups Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <PhoneCall size={16} className="text-amber-500" />
                                Critical Follow-ups
                            </h3>
                            <Link href="#" className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                CRM Calendar <ExternalLink size={10} />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {upcomingFollowups.length > 0 ? (
                                upcomingFollowups.map((followup) => (
                                    <div key={followup.id} className="p-4 hover:bg-amber-50/20 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${
                                                    new Date(followup.scheduled_at) <= new Date() ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900 uppercase tracking-tight">{followup.lead?.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">
                                                        Scheduled: {new Date(followup.scheduled_at).toLocaleDateString()} @ {new Date(followup.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                new Date(followup.scheduled_at) <= new Date() ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {new Date(followup.scheduled_at) <= new Date() ? 'Overdue' : 'Upcoming'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-xs">No pending follow-ups for today.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
