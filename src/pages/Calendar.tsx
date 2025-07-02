import React, { useState, useEffect } from 'react';
import { getIncidents, getPatients } from '../utils/storage';
import type { Incident, Patient } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Modal from '../components/atoms/Modal';

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const allIncidents = getIncidents();
        const allPatients = getPatients();
        setIncidents(allIncidents);
        setPatients(allPatients);
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getIncidentsForDate = (date: Date) => {
        return incidents.filter(incident =>
            isSameDay(new Date(incident.appointmentDate), date)
        );
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500';
            case 'Pending': return 'bg-yellow-500';
            case 'Cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const previousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-600">View appointments and schedule</p>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                    </div>

                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}

                    {/* Calendar Days */}
                    {daysInMonth.map((day, index) => {
                        const dayIncidents = getIncidentsForDate(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={index}
                                onClick={() => handleDateClick(day)}
                                className={`
                  min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                            >
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                    {format(day, 'd')}
                                </div>

                                <div className="space-y-1">
                                    {dayIncidents.slice(0, 3).map((incident, incidentIndex) => {
                                        const patient = patients.find(p => p.id === incident.patientId);
                                        return (
                                            <div
                                                key={incidentIndex}
                                                className={`
                          text-xs p-1 rounded truncate text-white
                          ${getStatusColor(incident.status)}
                        `}
                                                title={`${patient?.name || 'Unknown'} - ${incident.title}`}
                                            >
                                                {patient?.name || 'Unknown'}
                                            </div>
                                        );
                                    })}

                                    {dayIncidents.length > 3 && (
                                        <div className="text-xs text-gray-500">
                                            +{dayIncidents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Cancelled</span>
                    </div>
                </div>
            </div>

            {/* Date Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedDate ? `Appointments for ${format(selectedDate, 'MMMM dd, yyyy')}` : ''}
                size="lg"
            >
                {selectedDate && (
                    <div className="space-y-4">
                        {getIncidentsForDate(selectedDate).length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No appointments scheduled for this date</p>
                        ) : (
                            getIncidentsForDate(selectedDate).map((incident) => {
                                const patient = patients.find(p => p.id === incident.patientId);
                                return (
                                    <div key={incident.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)} text-white`}>
                                                {incident.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-600">Patient:</span>
                                                <span className="ml-2 text-gray-900">{patient?.name || 'Unknown'}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Time:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {format(new Date(incident.appointmentDate), 'h:mm a')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Description:</span>
                                                <p className="mt-1 text-gray-900">{incident.description}</p>
                                            </div>
                                            {incident.comments && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Comments:</span>
                                                    <p className="mt-1 text-gray-900">{incident.comments}</p>
                                                </div>
                                            )}
                                            {incident.cost && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Cost:</span>
                                                    <span className="ml-2 text-gray-900">${incident.cost}</span>
                                                </div>
                                            )}
                                            {incident.treatment && (
                                                <div>
                                                    <span className="font-medium text-gray-600">Treatment:</span>
                                                    <p className="mt-1 text-gray-900">{incident.treatment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Calendar; 