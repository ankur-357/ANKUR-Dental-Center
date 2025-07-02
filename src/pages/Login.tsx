import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { BicepsFlexed } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                navigate('/dashboard');
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">

                        <BicepsFlexed className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        ANKUR Dental Center
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter your email"
                            required
                            error={error}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        disabled={!email || !password}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Admin:</strong> admin@entnt.in / admin123</p>
                        <p><strong>Patient:</strong> john@entnt.in / patient123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 