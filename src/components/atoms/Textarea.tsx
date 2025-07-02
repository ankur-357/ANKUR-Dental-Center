import React from 'react';

interface TextareaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
    rows?: number;
    className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    disabled = false,
    rows = 3,
    className = ''
}) => {
    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`
          w-full px-3 py-2 border rounded-lg shadow-sm resize-vertical
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Textarea; 