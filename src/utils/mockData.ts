import type { User, Patient, Incident } from '../types';

export const mockUsers: User[] = [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
    { id: "3", role: "Patient", email: "priya.patel@entnt.in", password: "patient123", patientId: "p2" },
    { id: "4", role: "Patient", email: "rahul.verma@entnt.in", password: "patient123", patientId: "p3" },
    { id: "5", role: "Patient", email: "sneha.nair@entnt.in", password: "patient123", patientId: "p4" },
    { id: "6", role: "Patient", email: "amit.singh@entnt.in", password: "patient123", patientId: "p5" }
];

export const mockPatients: Patient[] = [
    {
        id: "p1",
        name: "Arjun Sharma",
        dob: "1992-04-15",
        contact: "+91-9876543210",
        healthInfo: "Allergic to sulfa drugs"
    },
    {
        id: "p2",
        name: "Priya Patel",
        dob: "1988-11-23",
        contact: "+91-9812345678",
        healthInfo: "Asthma, vegetarian"
    },
    {
        id: "p3",
        name: "Rahul Verma",
        dob: "1995-07-09",
        contact: "+91-9001234567",
        healthInfo: "Diabetes type 2, no known allergies"
    },
    {
        id: "p4",
        name: "Sneha Nair",
        dob: "1990-02-28",
        contact: "+91-9123456780",
        healthInfo: "No known allergies, mild hypertension"
    },
    {
        id: "p5",
        name: "Amit Singh",
        dob: "1985-12-12",
        contact: "+91-9988776655",
        healthInfo: "Thyroid disorder, lactose intolerant"
    }
];

export const mockIncidents: Incident[] = [
    {
        id: "i1",
        patientId: "p1",
        title: "Toothache (दांत में दर्द)",
        description: "Severe pain in lower right molar, started after eating sweets.",
        comments: "Patient prefers ayurvedic pain relief. Suggested clove oil as temporary relief.",
        appointmentDate: "2025-01-15T10:00:00",
        cost: 1200,
        status: "Completed",
        treatment: "Root canal treatment (RCT) performed. Prescribed antibiotics.",
        nextDate: "2025-02-15T10:00:00",
        files: [
            { name: "invoice.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 },
            { name: "xray.png", url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", type: "image/png", size: 2048 }
        ]
    },
    {
        id: "i2",
        patientId: "p2",
        title: "Routine Dental Checkup",
        description: "Annual checkup and cleaning. No major issues found.",
        comments: "Patient follows good oral hygiene. Suggested regular flossing.",
        appointmentDate: "2025-01-20T14:00:00",
        cost: 500,
        status: "Completed",
        treatment: "Scaling and polishing done.",
        nextDate: "2025-07-20T14:00:00",
        files: [
            { name: "checkup_report.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 512 }
        ]
    },
    {
        id: "i3",
        patientId: "p3",
        title: "Cavity Filling",
        description: "Cavity in upper left premolar. Patient reported sensitivity to cold water.",
        comments: "Used composite filling. Advised to avoid sweets.",
        appointmentDate: "2025-01-25T09:00:00",
        cost: 1500,
        status: "Completed",
        treatment: "Composite filling done. No complications.",
        nextDate: "2025-04-25T09:00:00",
        files: [
            { name: "treatment_plan.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1536 }
        ]
    },
    {
        id: "i4",
        patientId: "p1",
        title: "Follow-up Appointment",
        description: "Post-RCT checkup. Healing well, no pain reported.",
        comments: "Patient asked about dietary restrictions. Suggested soft food for 3 days.",
        appointmentDate: "2025-02-15T10:00:00",
        status: "Pending",
        files: []
    },
    {
        id: "i5",
        patientId: "p4",
        title: "Emergency Visit (Tooth Broken)",
        description: "Accidental fall at home. Upper incisor chipped.",
        comments: "Patient was anxious. Provided reassurance and pain relief.",
        appointmentDate: "2025-01-30T16:00:00",
        cost: 2500,
        status: "Completed",
        treatment: "Temporary crown placed. Advised permanent crown in 2 weeks.",
        nextDate: "2025-03-30T16:00:00",
        files: [
            { name: "emergency_report.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 768 }
        ]
    },
    {
        id: "i6",
        patientId: "p5",
        title: "Wisdom Tooth Extraction",
        description: "Impacted lower wisdom tooth. Swelling and pain for 3 days.",
        comments: "Patient from rural area, requested minimal medication.",
        appointmentDate: "2025-02-05T11:00:00",
        cost: 3500,
        status: "Completed",
        treatment: "Surgical extraction done. Prescribed painkillers and antibiotics.",
        nextDate: "2025-03-05T11:00:00",
        files: [
            { name: "surgery_consent.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 },
            { name: "post_op_instructions.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 512 }
        ]
    },
    // Additional appointments to create more diverse top patients
    {
        id: "i7",
        patientId: "p2",
        title: "Teeth Whitening",
        description: "Patient requested whitening for wedding. Used safe bleaching agents.",
        comments: "Explained post-whitening sensitivity. Advised Sensodyne toothpaste.",
        appointmentDate: "2025-02-10T13:00:00",
        cost: 2000,
        status: "Completed",
        treatment: "Professional whitening completed in one sitting.",
        nextDate: "2025-05-10T13:00:00",
        files: [
            { name: "whitening_consent.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 768 }
        ]
    },
    {
        id: "i8",
        patientId: "p2",
        title: "Dental Cleaning",
        description: "Routine cleaning and scaling. Mild tartar observed.",
        comments: "Advised regular cleaning every 6 months.",
        appointmentDate: "2025-03-15T10:00:00",
        cost: 800,
        status: "Completed",
        treatment: "Deep cleaning and scaling done.",
        nextDate: "2025-06-15T10:00:00",
        files: [
            { name: "cleaning_report.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 512 }
        ]
    },
    {
        id: "i9",
        patientId: "p3",
        title: "Orthodontic Consultation",
        description: "Patient interested in braces for teeth alignment.",
        comments: "Explained duration and cost. Patient to decide.",
        appointmentDate: "2025-02-20T15:00:00",
        cost: 500,
        status: "Completed",
        treatment: "Consultation and treatment plan provided.",
        nextDate: "2025-03-20T15:00:00",
        files: [
            { name: "ortho_consultation.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 }
        ]
    },
    {
        id: "i10",
        patientId: "p3",
        title: "Braces Installation",
        description: "Metal braces installed. Patient from Delhi, student.",
        comments: "Explained oral hygiene with braces. Next visit in 1 month.",
        appointmentDate: "2025-03-20T14:00:00",
        cost: 25000,
        status: "Completed",
        treatment: "Metal braces installation completed.",
        nextDate: "2025-04-20T14:00:00",
        files: [
            { name: "braces_consent.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1536 }
        ]
    },
    {
        id: "i11",
        patientId: "p4",
        title: "Dental Implant Consultation",
        description: "Consultation for missing lower molar. Patient wants fixed teeth.",
        comments: "Explained implant vs bridge. Patient to discuss with family.",
        appointmentDate: "2025-02-25T11:00:00",
        cost: 700,
        status: "Completed",
        treatment: "Implant consultation and planning done.",
        nextDate: "2025-04-25T11:00:00",
        files: [
            { name: "implant_consultation.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 }
        ]
    },
    {
        id: "i12",
        patientId: "p5",
        title: "Gum Disease Treatment",
        description: "Early stage gum disease. Bleeding gums while brushing.",
        comments: "Advised use of soft brush and mouthwash.",
        appointmentDate: "2025-03-10T09:00:00",
        cost: 1200,
        status: "Completed",
        treatment: "Deep cleaning and antibiotics prescribed.",
        nextDate: "2025-04-10T09:00:00",
        files: [
            { name: "gum_treatment_plan.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 768 }
        ]
    },
    {
        id: "i13",
        patientId: "p1",
        title: "Dental Crown",
        description: "Crown placement for weakened molar after RCT.",
        comments: "Patient chose zirconia crown. Advised care for 1 week.",
        appointmentDate: "2025-03-05T16:00:00",
        cost: 8000,
        status: "Completed",
        treatment: "Zirconia crown placed successfully.",
        nextDate: "2025-04-05T16:00:00",
        files: [
            { name: "crown_consent.pdf", url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO", type: "application/pdf", size: 1024 }
        ]
    },
    {
        id: "i14",
        patientId: "p1",
        title: "Regular Checkup",
        description: "Six-month checkup. No new complaints.",
        comments: "Routine examination. Advised to continue regular brushing.",
        appointmentDate: "2025-04-15T10:00:00",
        cost: 600,
        status: "Pending",
        files: []
    }
]; 