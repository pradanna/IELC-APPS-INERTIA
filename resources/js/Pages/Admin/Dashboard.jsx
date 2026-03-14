import React from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard(props) {
    return (
        <SuperAdminLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                            <p className="mt-2">Welcome to the main dashboard!</p>
                            <p className="mt-4">This area will be populated with statistics and quick actions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
