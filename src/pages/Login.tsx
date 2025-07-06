import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import {
    Shield,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Users,
    Calendar,
    DollarSign
} from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login({ email, password });
            if (success) {
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h1 className="mt-6 text-4xl font-bold text-gray-900">
                            ANKUR Dental
                        </h1>
                        <h2 className="text-xl font-semibold text-gray-700">
                            Management System
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="Enter your email"
                                    required
                                    error={error}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <Lock className="h-4 w-4 mr-2 text-gray-500" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={setPassword}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Shield className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!email || !password || loading}
                                loading={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </div>

                    {/* Demo Credentials */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-blue-600" />
                            Demo Credentials
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center mb-1">
                                    <User className="h-4 w-4 mr-2 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-900">Admin (Dentist)</span>
                                </div>
                                <p className="text-xs text-gray-600 font-mono">dr.ankur@entnt.in / admin123</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                                <div className="flex items-center mb-1">
                                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-900">Patient</span>
                                </div>
                                <p className="text-xs text-gray-600 font-mono">arjun.sharma@entnt.in / patient123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Feature Showcase */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
                    <div className="max-w-lg">
                        <h2 className="text-4xl font-bold mb-6">
                            Professional Dental Management
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Streamline your dental practice with our comprehensive management system designed for modern healthcare professionals.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Patient Management</h3>
                                    <p className="text-blue-100">Comprehensive patient records and history tracking</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Appointment Scheduling</h3>
                                    <p className="text-blue-100">Efficient calendar management and appointment tracking</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Financial Tracking</h3>
                                    <p className="text-blue-100">Revenue analytics and treatment cost management</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-lg"></div>
            </div>
        </div >
    );
};

export default Login; 