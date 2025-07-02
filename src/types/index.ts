export interface User {
    id: string;
    role: 'Admin' | 'Patient';
    email: string;
    password: string;
    patientId?: string;
}

export interface Patient {
    id: string;
    name: string;
    dob: string;
    contact: string;
    healthInfo: string;
}

export interface Incident {
    id: string;
    patientId: string;
    title: string;
    description: string;
    comments: string;
    appointmentDate: string;
    cost?: number;
    status: 'Pending' | 'Completed' | 'Cancelled';
    treatment?: string;
    nextDate?: string;
    files: FileUpload[];
}

export interface FileUpload {
    name: string;
    url: string;
    type: string;
    size: number;
}

export interface AppState {
    users: User[];
    patients: Patient[];
    incidents: Incident[];
    currentUser: User | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
} 