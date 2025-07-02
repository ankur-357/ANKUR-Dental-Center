import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPatients, updatePatient } from '../utils/storage';
import type { Patient } from '../types';
import { User, Edit, Save, X, Phone, Calendar, Heart, Mail } from 'lucide-react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Textarea from '../components/atoms/Textarea';

const Profile: React.FC = () => {
    const { currentUser } = useAuth();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        contact: '',
        healthInfo: ''
    });

    useEffect(() => {
        if (currentUser?.patientId) {
            const allPatients = getPatients();
            const currentPatient = allPatients.find(p => p.id === currentUser.patientId);

            if (currentPatient) {
                setPatient(currentPatient);
                setFormData({
                    name: currentPatient.name,
                    dob: currentPatient.dob,
                    contact: currentPatient.contact,
                    healthInfo: currentPatient.healthInfo
                });
            }
        }
        setLoading(false);
    }, [currentUser]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!patient) return;

        setSaving(true);
        try {
            const updatedPatient: Patient = {
                ...patient,
                name: formData.name,
                dob: formData.dob,
                contact: formData.contact,
                healthInfo: formData.healthInfo
            };

            updatePatient(updatedPatient);
            setPatient(updatedPatient);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (patient) {
            setFormData({
                name: patient.name,
                dob: patient.dob,
                contact: patient.contact,
                healthInfo: patient.healthInfo
            });
        }
        setIsEditing(false);
    };

    const calculateAge = (dob: string) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Patient not found</h3>
                <p className="mt-1 text-sm text-gray-500">Unable to load patient information.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600">Manage your personal information and preferences</p>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                    <div className="flex items-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-blue-600" />
                        </div>
                        <div className="ml-6 text-white">
                            <h2 className="text-2xl font-bold">{patient.name}</h2>
                            <p className="text-blue-100">Patient ID: {patient.id}</p>
                            <p className="text-blue-100">Age: {calculateAge(patient.dob)} years old</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        {isEditing && (
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex items-center"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(value) => handleInputChange('name', value)}
                                    placeholder="Enter your full name"
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
                                    placeholder="Enter your phone number"
                                    required
                                />

                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Health Information & Allergies"
                                        value={formData.healthInfo}
                                        onChange={(value) => handleInputChange('healthInfo', value)}
                                        placeholder="Enter any health conditions, allergies, medications, or other medical information..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <User className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                                        <p className="text-gray-900">{patient.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                                        <p className="text-gray-900">
                                            {new Date(patient.dob).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Contact Number</p>
                                        <p className="text-gray-900">{patient.contact}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Heart className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Health Information & Allergies</p>
                                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                {patient.healthInfo || 'No health information provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Email Address</p>
                                <p className="text-gray-900">{currentUser?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Account Type</p>
                                <p className="text-gray-900">Patient Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Data Privacy</p>
                                <p className="text-sm text-gray-600">Your personal health information is protected and confidential</p>
                            </div>
                            <div className="text-green-600">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Secure Storage</p>
                                <p className="text-sm text-gray-600">All data is stored securely with encryption</p>
                            </div>
                            <div className="text-green-600">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
