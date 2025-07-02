import React, { useState, useEffect } from 'react';
import { getIncidents, getPatients, addIncident, updateIncident, deleteIncident } from '../utils/storage';
import type { Incident, Patient } from '../types';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import Input from '../components/atoms/Input';
import Textarea from '../components/atoms/Textarea';
import Select from '../components/atoms/Select';
import { format } from 'date-fns';
import { downloadFile, getFileIcon } from '../utils/fileUtils';

const Incidents: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const [formData, setFormData] = useState({
        patientId: '',
        title: '',
        description: '',
        comments: '',
        appointmentDate: '',
        cost: '',
        status: 'Pending' as 'Pending' | 'Completed' | 'Cancelled',
        treatment: '',
        nextDate: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let filtered = incidents;

        if (searchTerm) {
            filtered = filtered.filter(incident => {
                const patient = patients.find(p => p.id === incident.patientId);
                return (
                    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient?.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(incident => incident.status === statusFilter);
        }

        setFilteredIncidents(filtered);
    }, [incidents, patients, searchTerm, statusFilter]);

    const loadData = () => {
        const allIncidents = getIncidents();
        const allPatients = getPatients();
        setIncidents(allIncidents);
        setPatients(allPatients);
    };

    const handleAddIncident = () => {
        setEditingIncident(null);
        setFormData({
            patientId: '',
            title: '',
            description: '',
            comments: '',
            appointmentDate: '',
            cost: '',
            status: 'Pending',
            treatment: '',
            nextDate: ''
        });
        setIsModalOpen(true);
    };

    const handleEditIncident = (incident: Incident) => {
        setEditingIncident(incident);
        setFormData({
            patientId: incident.patientId,
            title: incident.title,
            description: incident.description,
            comments: incident.comments,
            appointmentDate: incident.appointmentDate.slice(0, 16),
            cost: incident.cost?.toString() || '',
            status: incident.status,
            treatment: incident.treatment || '',
            nextDate: incident.nextDate?.slice(0, 16) || ''
        });
        setIsModalOpen(true);
    };

    const handleDeleteIncident = (incidentId: string) => {
        if (window.confirm('Are you sure you want to delete this incident?')) {
            deleteIncident(incidentId);
            loadData();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const incidentData = {
            ...formData,
            cost: formData.cost ? parseFloat(formData.cost) : undefined,
            nextDate: formData.nextDate || undefined
        };

        if (editingIncident) {
            const updatedIncident: Incident = {
                ...editingIncident,
                ...incidentData
            };
            updateIncident(updatedIncident);
        } else {
            const newIncident: Incident = {
                id: `i${Date.now()}`,
                ...incidentData,
                files: []
            };
            addIncident(newIncident);
        }

        setIsModalOpen(false);
        loadData();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Incidents & Appointments</h1>
                    <p className="text-gray-600">Manage patient incidents and appointments</p>
                </div>
                <Button onClick={handleAddIncident}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Incident
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by title or patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'Cancelled', label: 'Cancelled' }
                    ]}
                    className="sm:w-48"
                />
            </div>

            {/* Incidents List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Appointment Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cost
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Files
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredIncidents.map((incident) => {
                                const patient = patients.find(p => p.id === incident.patientId);
                                return (
                                    <tr key={incident.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {patient?.name || 'Unknown Patient'}
                                            </div>
                                            <div className="text-sm text-gray-500">{patient?.contact}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                                            <div className="text-sm text-gray-500">{incident.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(incident.appointmentDate), 'MMM dd, yyyy')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {format(new Date(incident.appointmentDate), 'h:mm a')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                                {incident.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {incident.cost ? `$${incident.cost}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {incident.files.map((file, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => downloadFile(file)}
                                                        className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                                                        title={file.name}
                                                    >
                                                        {getFileIcon(file.type)} {file.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditIncident(incident)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIncident(incident.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredIncidents.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Get started by adding a new incident.'}
                    </p>
                </div>
            )}

            {/* Add/Edit Incident Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingIncident ? 'Edit Incident' : 'Add New Incident'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Patient"
                            value={formData.patientId}
                            onChange={(value) => handleInputChange('patientId', value)}
                            options={patients.map(p => ({ value: p.id, label: p.name }))}
                            placeholder="Select a patient"
                            required
                        />

                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(value) => handleInputChange('title', value)}
                            placeholder="Enter incident title"
                            required
                        />
                    </div>

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(value) => handleInputChange('description', value)}
                        placeholder="Enter incident description"
                        required
                    />

                    <Textarea
                        label="Comments"
                        value={formData.comments}
                        onChange={(value) => handleInputChange('comments', value)}
                        placeholder="Enter additional comments"
                        rows={2}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Appointment Date & Time"
                            type="datetime-local"
                            value={formData.appointmentDate}
                            onChange={(value) => handleInputChange('appointmentDate', value)}
                            required
                        />

                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(value) => handleInputChange('status', value)}
                            options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Completed', label: 'Completed' },
                                { value: 'Cancelled', label: 'Cancelled' }
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Cost ($)"
                            type="number"
                            value={formData.cost}
                            onChange={(value) => handleInputChange('cost', value)}
                            placeholder="Enter cost"
                        />

                        <Input
                            label="Next Appointment Date & Time"
                            type="datetime-local"
                            value={formData.nextDate}
                            onChange={(value) => handleInputChange('nextDate', value)}
                        />
                    </div>

                    <Textarea
                        label="Treatment"
                        value={formData.treatment}
                        onChange={(value) => handleInputChange('treatment', value)}
                        placeholder="Enter treatment details"
                        rows={3}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingIncident ? 'Update Incident' : 'Add Incident'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Incidents; 