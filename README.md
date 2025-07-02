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
git clone <repository-url>
cd dental-center-management
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
│   ├── ui/           # Reusable UI components
│   └── layout/       # Layout components
├── context/          # React Context for state management
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx          # Main application component
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

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

### Netlify Deployment

1. Build the project:

```bash
npm run build
```

2. Upload the `dist` folder to Netlify

### GitHub Pages

1. Add to package.json:

```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Deploy:

```bash
npm run deploy
```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Note:** This is a frontend-only application designed for assignment purposes.
