import type { User, Patient, Incident } from '../types';

export const mockUsers: User[] = [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
    { id: "3", role: "Patient", email: "sarah@entnt.in", password: "patient123", patientId: "p2" },
    { id: "4", role: "Patient", email: "mike@entnt.in", password: "patient123", patientId: "p3" }
];

export const mockPatients: Patient[] = [
    {
        id: "p1",
        name: "John Doe",
        dob: "1990-05-10",
        contact: "1234567890",
        healthInfo: "No allergies"
    },
    {
        id: "p2",
        name: "Sarah Johnson",
        dob: "1985-08-15",
        contact: "9876543210",
        healthInfo: "Allergic to penicillin"
    },
    {
        id: "p3",
        name: "Mike Wilson",
        dob: "1995-03-22",
        contact: "5551234567",
        healthInfo: "Diabetes type 2"
    },
    {
        id: "p4",
        name: "Emily Davis",
        dob: "1988-12-05",
        contact: "4449876543",
        healthInfo: "No known allergies"
    },
    {
        id: "p5",
        name: "David Brown",
        dob: "1975-07-18",
        contact: "3334567890",
        healthInfo: "Hypertension"
    }
];

export const mockIncidents: Incident[] = [
    {
        id: "i1",
        patientId: "p1",
        title: "Toothache",
        description: "Upper molar pain",
        comments: "Sensitive to cold",
        appointmentDate: "2025-01-15T10:00:00",
        cost: 80,
        status: "Completed",
        treatment: "Root canal treatment",
        nextDate: "2025-02-15T10:00:00",
        files: [
            { name: "invoice.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 },
            { name: "xray.png", url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", type: "image/png", size: 2048 }
        ]
    },
    {
        id: "i2",
        patientId: "p2",
        title: "Regular Checkup",
        description: "Annual dental examination",
        comments: "Good oral hygiene",
        appointmentDate: "2025-01-20T14:00:00",
        cost: 50,
        status: "Completed",
        treatment: "Cleaning and examination",
        nextDate: "2025-07-20T14:00:00",
        files: [
            { name: "checkup_report.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 512 }
        ]
    },
    {
        id: "i3",
        patientId: "p3",
        title: "Cavity Filling",
        description: "Lower right molar cavity",
        comments: "Patient reported sensitivity",
        appointmentDate: "2025-01-25T09:00:00",
        cost: 120,
        status: "Completed",
        treatment: "Composite filling",
        nextDate: "2025-04-25T09:00:00",
        files: [
            { name: "treatment_plan.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1536 }
        ]
    },
    {
        id: "i4",
        patientId: "p1",
        title: "Follow-up Appointment",
        description: "Post-treatment checkup",
        comments: "Healing well",
        appointmentDate: "2025-02-15T10:00:00",
        status: "Pending",
        files: []
    },
    {
        id: "i5",
        patientId: "p4",
        title: "Emergency Visit",
        description: "Broken tooth",
        comments: "Accident while eating",
        appointmentDate: "2025-01-30T16:00:00",
        cost: 200,
        status: "Completed",
        treatment: "Crown placement",
        nextDate: "2025-03-30T16:00:00",
        files: [
            { name: "emergency_report.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 768 }
        ]
    },
    {
        id: "i6",
        patientId: "p5",
        title: "Wisdom Tooth Extraction",
        description: "Impacted wisdom tooth",
        comments: "Severe pain and swelling",
        appointmentDate: "2025-02-05T11:00:00",
        cost: 350,
        status: "Completed",
        treatment: "Surgical extraction",
        nextDate: "2025-03-05T11:00:00",
        files: [
            { name: "surgery_consent.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 },
            { name: "post_op_instructions.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 512 }
        ]
    }
]; 