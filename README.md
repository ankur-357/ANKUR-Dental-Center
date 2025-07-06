# ANKUR Dental Center Management Dashboard

A comprehensive, frontend-only dental dashboard application for ANKUR that
simulates all data using localStorage. Built with React, TypeScript, and
TailwindCSS.

## 🎯 Project Overview

This dental dashboard app provides a complete management system for dental
practices with two user roles: Admin (Dentist) and Patient. All data is
simulated using localStorage with no backend dependencies.

## 🔐 Authentication

### Hardcoded Users

**Admin (Dentist):**

- Email: `admin@entnt.in`
- Password: `admin123`

**Patient:**

- Email: `john@entnt.in`
- Password: `patient123`

## 🧑‍⚕️ Admin (Dentist) Features

### Patient Management

- **View/Add/Edit/Delete** patients
- Patient fields: Full name, DOB, contact, health info
- Search and filter functionality

### Incident/Appointment Management

- **CRUD operations** for incidents per patient
- Fields: title, description, comments, appointment datetime
- Post-appointment: cost, treatment, status, next date
- File uploads (base64/blob URL)

### Calendar View

- Monthly calendar view of appointments
- Click dates to view scheduled appointments
- Color-coded status indicators

### Dashboard KPIs

- Next 10 appointments
- Top patients by appointment count
- Revenue totals
- Completed/pending treatments

## 👤 Patient Features

- View only own data (appointments, treatments, uploaded files, costs)
- View upcoming appointments and treatment history
- Access to personal health records and files

## 🧩 Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **React Router** - Client-side routing
- **Context API** - Global state management
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Date-fns** - Date manipulation utilities
- **Vite** - Fast build tool and dev server

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ankur-357/ANKUR-Dental-Center.git
cd ANKUR-Dental-Center
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
|   ├──atoms/         
│   ├── ui/           
│   └── layout/       
├── context/          
├── pages/           
├── types/          
├── utils/          
└── App.tsx       
```

## 💾 Data & Storage

### localStorage Structure

The application uses localStorage with the following keys:

- `dental_users` - User accounts
- `dental_patients` - Patient records
- `dental_incidents` - Appointments and incidents
- `dental_current_user` - Current authenticated user
- `dental_is_authenticated` - Authentication status

### Sample Data

The application comes pre-loaded with sample data including:

- 5 patients with various health conditions
- 6 incidents/appointments with different statuses
- File attachments (simulated as base64)

## 🎨 UI Components

### Reusable Components

- **Modal** - Flexible modal dialog
- **Button** - Styled button with variants
- **Input** - Form input with validation
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection

### Features

- Fully responsive design
- Form validation for all inputs
- Loading states and error handling
- File upload/download functionality
- Role-based access control

## 🔒 Security & Constraints

### Important Constraints

- No external APIs or backend services
- No Firebase or authentication libraries
- No external database connections
- All authentication and data management simulated locally

### Security Features

- Role-based routing and access control
- Session persistence via localStorage
- Protected routes for different user types

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent component structure

## 📝 Features Implemented

### ✅ Completed Features

- [x] User authentication with role-based access
- [x] Patient management (CRUD operations)
- [x] Incident/appointment management
- [x] Calendar view with appointment details
- [x] Dashboard with KPIs and statistics
- [x] File upload/download functionality
- [x] Responsive design
- [x] Search and filtering
- [x] Form validation
- [x] Session management

### 🎯 Key Features

- **Real-time data persistence** using localStorage
- **Role-based UI** - Different interfaces for Admin and Patient
- **Interactive calendar** with appointment visualization
- **File management** with base64 storage
- **Comprehensive dashboard** with analytics
- **Modern UI/UX** with TailwindCSS

## 🧠 Bonus Features that can be added:

### 🤖 Chatbot for Patient Queries

An interactive chatbot on the patient dashboard helps answer common queries such as:

* "When is my next appointment?"
* "How much have I paid so far?"
* "What does my treatment history look like?"

### 🦷 Image-Based Tooth Condition Prediction

Patients or dentists can upload images of dental conditions (e.g., a tooth scan or photo). The app simulates AI-based diagnosis by predicting:

* Possible early-stage cavity
* Gum inflammation
* Recommendation for further examination


### 💬 Patient Sentiment Tracker

After completing a treatment, patients can leave feedback. The system performs basic sentiment analysis to classify feedback as:

* Positive 😊
* Neutral 😐
* Negative 😟

This helps dentists gauge patient satisfaction and improve service quality.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Note:** This is a frontend-only application designed for assignment purposes.
