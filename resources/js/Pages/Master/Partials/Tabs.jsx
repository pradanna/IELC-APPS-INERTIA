import React, { useState } from 'react';

export default function Tabs({ tabs, initialTab }) {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0].name);

    const activeTabData = tabs.find((tab) => tab.name === activeTab);

    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`
                                whitespace-nowrap py-3 px-1 border-b-2
                                font-medium text-sm transition-colors
                                ${
                                    activeTab === tab.name
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-5">
                {activeTabData && activeTabData.content}
            </div>
        </div>
    );
}
