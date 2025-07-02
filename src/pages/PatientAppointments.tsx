import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIncidents, getPatients } from '../utils/storage';
import type { Incident, Patient } from '../types';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

const PatientAppointments: React.FC = () => {
    const { currentUser } = useAuth();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (currentUser?.patientId) {
            const allIncidents = getIncidents();
            const allPatients = getPatients();

            const patientIncidents = allIncidents.filter(
                i => i.patientId === currentUser.patientId
            );
            const currentPatient = allPatients.find(p => p.id === currentUser.patientId);

            setIncidents(patientIncidents);
            setPatient(currentPatient || null);
        }
    }, [currentUser]);

    const filteredIncidents = incidents.filter(incident => {
        if (filterStatus === 'all') return true;
        return incident.status === filterStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUpcomingAppointments = () => {
        const now = new Date();
        if (filterStatus === 'all') {
            return incidents
                .filter(i => new Date(i.appointmentDate) > now && i.status === 'Pending')
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
        }
        return filteredIncidents
            .filter(i => new Date(i.appointmentDate) > now && i.status === 'Pending')
            .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    };

    const getPastAppointments = () => {
        const now = new Date();
        if (filterStatus === 'all') {
            return incidents
                .filter(i => new Date(i.appointmentDate) <= now || i.status === 'Completed')
                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        }
        return filteredIncidents
            .filter(i => new Date(i.appointmentDate) <= now || i.status === 'Completed')
            .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    };

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const upcomingAppointments = getUpcomingAppointments();
    const pastAppointments = getPastAppointments();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-600">View and manage your dental appointments</p>
            </div>

            {/* Filter */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Appointments</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingAppointments.map((incident) => (
                                <div key={incident.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                            {incident.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">
                                                {format(new Date(incident.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">
                                                {format(new Date(incident.appointmentDate), 'h:mm a')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Description:</span>
                                            <p className="mt-1 text-gray-900">{incident.description}</p>
                                        </div>
                                        {incident.comments && (
                                            <div>
                                                <span className="font-medium text-gray-600">Comments:</span>
                                                <p className="mt-1 text-gray-900">{incident.comments}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Past Appointments */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Past Appointments</h3>
                </div>
                <div className="p-6">
                    {pastAppointments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No past appointments</p>
                    ) : (
                        <div className="space-y-4">
                            {pastAppointments.map((incident) => (
                                <div key={incident.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                            {incident.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">
                                                {format(new Date(incident.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">
                                                {format(new Date(incident.appointmentDate), 'h:mm a')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Description:</span>
                                            <p className="mt-1 text-gray-900">{incident.description}</p>
                                        </div>
                                        {incident.comments && (
                                            <div>
                                                <span className="font-medium text-gray-600">Comments:</span>
                                                <p className="mt-1 text-gray-900">{incident.comments}</p>
                                            </div>
                                        )}
                                        {incident.nextDate && (
                                            <div>
                                                <span className="font-medium text-gray-600">Next Appointment:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {format(new Date(incident.nextDate), 'MMM dd, yyyy h:mm a')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments; 