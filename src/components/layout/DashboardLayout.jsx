import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f0e17]">
            {/* Sidebar */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onClose={() => setIsSidebarOpen(false)} 
            />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 flex flex-col min-h-screen ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Navbar */}
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8">
                    <div className="max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
