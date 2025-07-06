import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPatients, getIncidents, resetToMockData } from '../utils/storage';
import type { Patient, Incident } from '../types';
import {
    Users,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/atoms/Button';

const Dashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            const allPatients = getPatients();
            const allIncidents = getIncidents();

            if (currentUser?.role === 'Patient') {
                // Filter data for patient
                const patientIncidents = allIncidents.filter(
                    i => i.patientId === currentUser.patientId
                );
                const currentPatient = allPatients.find(p => p.id === currentUser.patientId);

                setIncidents(patientIncidents);
                setPatient(currentPatient || null);
            } else {
                // Admin sees all data
                setPatients(allPatients);
                setIncidents(allIncidents);
            }

            setLoading(false);
        };

        loadData();
    }, [currentUser]);

    const handleResetData = () => {
        if (window.confirm('This will reset all data to the default mock data. Continue?')) {
            resetToMockData();
            window.location.reload();
        }
    };

    const getUpcomingAppointments = () => {
        const now = new Date();
        return incidents
            .filter(i => new Date(i.appointmentDate) > now && i.status === 'Pending')
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
            .slice(0, 10);
    };

    const getTopPatients = () => {
        const patientCounts = incidents.reduce((acc, incident) => {
            acc[incident.patientId] = (acc[incident.patientId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(patientCounts)
            .map(([patientId, count]) => ({
                patient: patients.find(p => p.id === patientId),
                count
            }))
            .filter(item => item.patient)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    const getRevenueStats = () => {
        const completedIncidents = incidents.filter(i => i.status === 'Completed' && i.cost);
        const totalRevenue = completedIncidents.reduce((sum, i) => sum + (i.cost || 0), 0);
        const pendingRevenue = incidents
            .filter(i => i.status === 'Pending' && i.cost)
            .reduce((sum, i) => sum + (i.cost || 0), 0);
        const averageRevenue = completedIncidents.length > 0 ? totalRevenue / completedIncidents.length : 0;

        return { totalRevenue, pendingRevenue, averageRevenue };
    };

    const getTreatmentStats = () => {
        const completed = incidents.filter(i => i.status === 'Completed').length;
        const pending = incidents.filter(i => i.status === 'Pending').length;
        const cancelled = incidents.filter(i => i.status === 'Cancelled').length;
        const total = incidents.length;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        return { completed, pending, cancelled, total, completionRate };
    };

    const getMonthlyStats = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyIncidents = incidents.filter(i => {
            const incidentDate = new Date(i.appointmentDate);
            return incidentDate.getMonth() === currentMonth && incidentDate.getFullYear() === currentYear;
        });

        return {
            monthlyAppointments: monthlyIncidents.length,
            monthlyRevenue: monthlyIncidents
                .filter(i => i.status === 'Completed' && i.cost)
                .reduce((sum, i) => sum + (i.cost || 0), 0)
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const upcomingAppointments = getUpcomingAppointments();
    const topPatients = getTopPatients();
    const { totalRevenue, pendingRevenue, averageRevenue } = getRevenueStats();
    const { completed, pending, cancelled, total, completionRate } = getTreatmentStats();
    const { monthlyAppointments, monthlyRevenue } = getMonthlyStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {currentUser?.role === 'Admin' ? 'Doctor' : 'Patient'}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening at ANKUR Dental Center
                    </p>
                </div>
                {currentUser?.role === 'Admin' && (
                    <Button
                        onClick={handleResetData}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Data
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentUser?.role === 'Admin' ? (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                    <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">My Appointments</p>
                                    <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                    <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{completed}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Cost</p>
                                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Additional KPI Cards for Admin */}
            {currentUser?.role === 'Admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">{monthlyAppointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Revenue/Treatment</p>
                                <p className="text-2xl font-bold text-gray-900">${averageRevenue.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${pendingRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Information Card (Patient only) */}
            {currentUser?.role === 'Patient' && patient && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-medium text-gray-600">Name:</span>
                            <p className="text-gray-900">{patient.name}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Contact:</span>
                            <p className="text-gray-900">{patient.contact}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                            <p className="text-gray-900">{new Date(patient.dob).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-600">Health Info:</span>
                            <p className="text-gray-900">{patient.healthInfo}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {currentUser?.role === 'Admin' ? 'Upcoming Appointments' : 'My Upcoming Appointments'}
                        </h2>
                    </div>
                    <div className="p-6">
                        {upcomingAppointments.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((incident) => {
                                    const patient = patients.find(p => p.id === incident.patientId);
                                    return (
                                        <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                {currentUser?.role === 'Admin' && (
                                                    <p className="font-medium text-gray-900">
                                                        {patient?.name || 'Unknown Patient'}
                                                    </p>
                                                )}
                                                <p className={`${currentUser?.role === 'Admin' ? 'text-sm' : 'font-medium'} text-gray-${currentUser?.role === 'Admin' ? '600' : '900'}`}>
                                                    {incident.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(incident.appointmentDate), 'MMM dd, yyyy h:mm a')}
                                                </p>
                                            </div>
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Treatment Status */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {currentUser?.role === 'Admin' ? 'Treatment Status' : 'My Treatment Status'}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                    <span className="text-gray-700">Completed</span>
                                </div>
                                <span className="font-semibold text-gray-900">{completed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                                    <span className="text-gray-700">Pending</span>
                                </div>
                                <span className="font-semibold text-gray-900">{pending}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-red-600 mr-3" />
                                    <span className="text-gray-700">Cancelled</span>
                                </div>
                                <span className="font-semibold text-gray-900">{cancelled}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Patients (Admin only) */}
            {currentUser?.role === 'Admin' && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Top Patients by Appointments</h2>
                        <p className="text-sm text-gray-600 mt-1">Patients with the most appointments</p>
                    </div>
                    <div className="p-6">
                        {topPatients.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No patient data available</p>
                        ) : (
                            <div className="space-y-4">
                                {topPatients.map((item, index) => (
                                    <div key={item.patient?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <span className="font-medium text-gray-900">{item.patient?.name}</span>
                                                <p className="text-xs text-gray-500">{item.patient?.contact}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-900">{item.count} appointments</span>
                                            <p className="text-xs text-gray-500">
                                                {((item.count / total) * 100).toFixed(1)}% of total
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard; 