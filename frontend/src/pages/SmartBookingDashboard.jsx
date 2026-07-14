import React, { useState } from 'react';
import VenuesSection from '../components/VenuesSection';

const SidebarItem = ({ icon, label, active = false, onClick }) => (
    <div onClick={onClick} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
        {icon}
        <span className="font-medium">{label}</span>
    </div>
);

const SmartBookingDashboard = () => {
    const [activeTab, setActiveTab] = useState('venues');

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 hidden md:flex">
                <div className="flex items-center space-x-2 mb-8 px-2">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xl font-bold text-gray-800">Smart Booking</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <SidebarItem
                        active={activeTab === 'venues'}
                        onClick={() => setActiveTab('venues')}
                        label="Our Venues"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                    />
                    <SidebarItem
                        active={activeTab === 'bookings'}
                        onClick={() => setActiveTab('bookings')}
                        label="My Bookings"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    />
                    <SidebarItem
                        active={activeTab === 'payments'}
                        onClick={() => setActiveTab('payments')}
                        label="Payments"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    />
                    <SidebarItem
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                        label="Settings"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-blue-600 font-medium capitalize">{activeTab}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-600">English</div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'venues' && <VenuesSection />}
                    {activeTab === 'bookings' && (
                        <div className="text-center text-gray-500 mt-20">
                            <p className="text-xl font-semibold">My Bookings</p>
                            <p className="text-sm mt-2">Your bookings will appear here.</p>
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <div className="text-center text-gray-500 mt-20">
                            <p className="text-xl font-semibold">Payments</p>
                            <p className="text-sm mt-2">Your payment history will appear here.</p>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="text-center text-gray-500 mt-20">
                            <p className="text-xl font-semibold">Settings</p>
                            <p className="text-sm mt-2">Settings will appear here.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SmartBookingDashboard;

