import React, { useState, useEffect } from 'react';
import { getPatients, addPatient, updatePatient, deletePatient } from '../utils/storage';
import type { Patient } from '../types';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import Input from '../components/atoms/Input';
import Textarea from '../components/atoms/Textarea';

const Patients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        contact: '',
        healthInfo: ''
    });

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.contact.includes(searchTerm)
        );
        setFilteredPatients(filtered);
    }, [patients, searchTerm]);

    const loadPatients = () => {
        const allPatients = getPatients();
        setPatients(allPatients);
    };

    const handleAddPatient = () => {
        setEditingPatient(null);
        setFormData({
            name: '',
            dob: '',
            contact: '',
            healthInfo: ''
        });
        setIsModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setEditingPatient(patient);
        setFormData({
            name: patient.name,
            dob: patient.dob,
            contact: patient.contact,
            healthInfo: patient.healthInfo
        });
        setIsModalOpen(true);
    };

    const handleDeletePatient = (patientId: string) => {
        if (window.confirm('Are you sure you want to delete this patient? This will also delete all related incidents.')) {
            deletePatient(patientId);
            loadPatients();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPatient) {
            const updatedPatient: Patient = {
                ...editingPatient,
                ...formData
            };
            updatePatient(updatedPatient);
        } else {
            const newPatient: Patient = {
                id: `p${Date.now()}`,
                ...formData
            };
            addPatient(newPatient);
        }

        setIsModalOpen(false);
        loadPatients();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-600">Manage patient information and records</p>
                </div>
                <Button onClick={handleAddPatient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search patients by name or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <div key={patient.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-gray-600">ID: {patient.id}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditPatient(patient)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDeletePatient(patient.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                                <p className="text-sm text-gray-900">{new Date(patient.dob).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Contact:</span>
                                <p className="text-sm text-gray-900">{patient.contact}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Health Info:</span>
                                <p className="text-sm text-gray-900">{patient.healthInfo}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new patient.'}
                    </p>
                </div>
            )}

            {/* Add/Edit Patient Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(value) => handleInputChange('name', value)}
                        placeholder="Enter patient's full name"
                        required
                    />

                    <Input
                        label="Date of Birth"
                        type="date"
                        value={formData.dob}
                        onChange={(value) => handleInputChange('dob', value)}
                        required
                    />

                    <Input
                        label="Contact Number"
                        value={formData.contact}
                        onChange={(value) => handleInputChange('contact', value)}
                        placeholder="Enter contact number"
                        required
                    />

                    <Textarea
                        label="Health Information"
                        value={formData.healthInfo}
                        onChange={(value) => handleInputChange('healthInfo', value)}
                        placeholder="Enter health information, allergies, etc."
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
                            {editingPatient ? 'Update Patient' : 'Add Patient'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Patients; 