import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIncidents, getPatients } from '../utils/storage';
import type { Incident, Patient } from '../types';
import { Calendar, Clock, FileText, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { downloadFile, getFileIcon } from '../utils/fileUtils';

const PatientTreatments: React.FC = () => {
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

    // Filter to show only treatments (completed appointments with treatment details)
    const treatments = incidents.filter(incident => {
        const hasBasicFilter = filterStatus === 'all' || incident.status === filterStatus;
        // Only show incidents that have treatment information or are completed
        const hasTreatmentInfo = incident.treatment || incident.cost || incident.status === 'Completed';
        return hasBasicFilter && hasTreatmentInfo;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTotalCost = () => {
        return treatments
            .filter(t => t.cost && t.status === 'Completed')
            .reduce((sum, t) => sum + (t.cost || 0), 0);
    };

    const getCompletedTreatments = () => {
        return treatments.filter(t => t.status === 'Completed').length;
    };

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalCost = getTotalCost();
    const completedTreatments = getCompletedTreatments();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Treatments</h1>
                <p className="text-gray-600">Treatment history and medical records</p>
            </div>

            {/* Treatment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed Treatments</p>
                            <p className="text-2xl font-bold text-gray-900">{completedTreatments}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Treatment Cost</p>
                            <p className="text-2xl font-bold text-gray-900">${totalCost}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Treatments</p>
                            <p className="text-2xl font-bold text-gray-900">{treatments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Treatment History</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Treatments</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">In Progress</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Treatments List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Treatment Records</h3>
                </div>
                <div className="p-6">
                    {treatments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No treatment records found</p>
                    ) : (
                        <div className="space-y-6">
                            {treatments
                                .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                                .map((incident) => (
                                    <div key={incident.id} className="border rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-900">{incident.title}</h4>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                                {incident.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Treatment Details */}
                                            <div className="space-y-3">
                                                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Treatment Details</h5>

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

                                                {incident.treatment && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-600">Treatment Provided:</span>
                                                        <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{incident.treatment}</p>
                                                    </div>
                                                )}

                                                {incident.description && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-600">Description:</span>
                                                        <p className="mt-1 text-gray-900">{incident.description}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Additional Information */}
                                            <div className="space-y-3">
                                                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Additional Information</h5>

                                                {incident.cost && (
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <div className="flex items-center">
                                                            <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
                                                            <span className="text-sm font-medium text-gray-600">Treatment Cost:</span>
                                                        </div>
                                                        <span className="text-lg font-bold text-blue-600">${incident.cost}</span>
                                                    </div>
                                                )}

                                                {incident.comments && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-600">Doctor's Notes:</span>
                                                        <p className="mt-1 text-gray-900 bg-yellow-50 p-3 rounded-lg">{incident.comments}</p>
                                                    </div>
                                                )}

                                                {incident.nextDate && (
                                                    <div className="bg-green-50 p-3 rounded-lg">
                                                        <span className="text-sm font-medium text-gray-600">Next Appointment:</span>
                                                        <p className="text-green-700 font-medium">
                                                            {format(new Date(incident.nextDate), 'MMM dd, yyyy h:mm a')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Files Section */}
                                        {incident.files.length > 0 && (
                                            <div className="mt-6 pt-4 border-t">
                                                <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Medical Files & Documents</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {incident.files.map((file, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => downloadFile(file)}
                                                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                            title={file.name}
                                                        >
                                                            <FileText className="h-5 w-5 text-blue-600 mr-3" />
                                                            <div className="text-left">
                                                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{getFileIcon(file.type)} {file.type}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientTreatments;
