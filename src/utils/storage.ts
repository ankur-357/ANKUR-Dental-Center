import type { AppState, User, Patient, Incident } from '../types';
import { mockUsers, mockPatients, mockIncidents } from './mockData';

const STORAGE_KEYS = {
    USERS: 'dental_users',
    PATIENTS: 'dental_patients',
    INCIDENTS: 'dental_incidents',
    CURRENT_USER: 'dental_current_user',
    IS_AUTHENTICATED: 'dental_is_authenticated'
};

// Initialize localStorage with mock data if empty
export const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
        localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(mockIncidents));
    }
};

// Get data from localStorage
export const getUsers = (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
};

export const getPatients = (): Patient[] => {
    const patients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return patients ? JSON.parse(patients) : [];
};

export const getIncidents = (): Incident[] => {
    const incidents = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    return incidents ? JSON.parse(incidents) : [];
};

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
};

// Set data to localStorage
export const setUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const setPatients = (patients: Patient[]) => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const setIncidents = (incidents: Incident[]) => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
};

export const setCurrentUser = (user: User | null) => {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
    }
};

// CRUD operations
export const addPatient = (patient: Patient) => {
    const patients = getPatients();
    patients.push(patient);
    setPatients(patients);
};

export const updatePatient = (updatedPatient: Patient) => {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
        patients[index] = updatedPatient;
        setPatients(patients);
    }
};

export const deletePatient = (patientId: string) => {
    const patients = getPatients();
    const filteredPatients = patients.filter(p => p.id !== patientId);
    setPatients(filteredPatients);

    // Also delete related incidents
    const incidents = getIncidents();
    const filteredIncidents = incidents.filter(i => i.patientId !== patientId);
    setIncidents(filteredIncidents);
};

export const addIncident = (incident: Incident) => {
    const incidents = getIncidents();
    incidents.push(incident);
    setIncidents(incidents);
};

export const updateIncident = (updatedIncident: Incident) => {
    const incidents = getIncidents();
    const index = incidents.findIndex(i => i.id === updatedIncident.id);
    if (index !== -1) {
        incidents[index] = updatedIncident;
        setIncidents(incidents);
    }
};

export const deleteIncident = (incidentId: string) => {
    const incidents = getIncidents();
    const filteredIncidents = incidents.filter(i => i.id !== incidentId);
    setIncidents(filteredIncidents);
};

// Clear all data (for logout)
export const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
};

// Get complete app state
export const getAppState = (): AppState => {
    return {
        users: getUsers(),
        patients: getPatients(),
        incidents: getIncidents(),
        currentUser: getCurrentUser(),
        isAuthenticated: isAuthenticated()
    };
}; 