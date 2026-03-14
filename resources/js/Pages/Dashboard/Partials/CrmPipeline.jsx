import React from 'react';
import { Filter, Star, UserCheck, UserPlus } from 'lucide-react';

const funnelData = [
    { name: 'New', count: 85, icon: <UserPlus className="text-gray-500" /> },
    { name: 'Placement Test', count: 45, icon: <Filter className="text-gray-500" /> },
    { name: 'Joined', count: 21, icon: <UserCheck className="text-gray-500" /> },
];

const leadSourcesData = [
    { name: 'Instagram', value: '45%', icon: <Star size={16} className="text-yellow-400" /> },
    { name: 'TikTok', value: '25%', icon: <Star size={16} className="text-yellow-400" /> },
    { name: 'Walk-in', value: '15%', icon: <Star size={16} className="text-yellow-400" /> },
    { name: 'Referral', value: '10%', icon: <Star size={16} className="text-gray-300" /> },
    { name: 'Website', value: '5%', icon: <Star size={16} className="text-gray-300" /> },
];

const FunnelStage = ({ stage, isLast }) => (
    <div className="flex items-center text-center">
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full ring-4 ring-white">
                {stage.icon}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800">{stage.count}</p>
            <p className="text-xs text-gray-500">{stage.name}</p>
        </div>
        {!isLast && <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-4"></div>}
    </div>
);

const LeadSourceItem = ({ source }) => (
    <li className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <div className="flex items-center">
            {source.icon}
            <span className="text-sm text-gray-700 ml-3">{source.name}</span>
        </div>
        <span className="text-sm font-medium text-gray-900">{source.value}</span>
    </li>
);

export default function CrmPipeline() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Funnel */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">CRM Pipeline</h3>
                <div className="flex items-center justify-between">
                    {funnelData.map((stage, index) => (
                        <React.Fragment key={stage.name}>
                            <FunnelStage stage={stage} isLast={index === funnelData.length - 1} />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Top Lead Sources */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Top Lead Sources</h3>
                <ul>
                    {leadSourcesData.map((source) => (
                        <LeadSourceItem key={source.name} source={source} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
