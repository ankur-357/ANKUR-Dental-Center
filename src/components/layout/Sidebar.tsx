import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    LogOut
} from 'lucide-react';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const adminNavItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/patients', label: 'Patients', icon: Users },
        { path: '/appointments', label: 'Appointments', icon: Calendar },
        { path: '/incidents', label: 'Incidents', icon: FileText },
    ];

    const patientNavItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/patient-appointments', label: 'My Appointments', icon: Calendar },
        { path: '/treatments', label: 'My Treatments', icon: FileText },
    ];

    const navItems = currentUser?.role === 'Admin' ? adminNavItems : patientNavItems;

    // Hide sidebar on mobile if not open
    const sidebarClasses = `bg-white shadow-lg w-64 min-h-screen z-40 fixed md:static top-0 left-0 transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:block`;

    return (
        <div className={sidebarClasses} style={{ maxWidth: 256 }}>
            <div className="p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">ANKUR</h1>
                </div>
                <p className="text-sm text-gray-600 mt-1">Dental Center</p>
            </div>

            <nav className="mt-8">
                <div className="px-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {currentUser?.role === 'Admin' ? 'Admin Panel' : 'Patient Portal'}
                    </div>
                </div>

                <ul className="space-y-1 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(item.path)
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                `}
                                    onClick={() => {
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-64 p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {currentUser?.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            {currentUser?.role}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 