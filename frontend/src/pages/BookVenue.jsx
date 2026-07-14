import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, MapPin, Clock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

const BookVenue = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, loading: authLoading } = useAuth();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        booking_date: '',
        start_time: '',
        end_time: '',
        type: 'booking'
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        fetchRoom();
    }, [id, user, authLoading]);

    const fetchRoom = async () => {
        try {
            const res = await api.get(`/api/rooms/${id}`);
            setRoom(res.data.data);
        } catch (err) {
            setError('Could not load venue details.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setError('');
        try {
            await api.post('/api/bookings', {
                user_id: user.id,
                room_id: parseInt(id),
                booking_date: formData.booking_date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                type: formData.type
            }, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit booking request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FCF9F6] px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={36} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted!</h2>
                    <p className="text-gray-500 mb-6">Your booking for <strong>{room?.name}</strong> has been submitted. Check your email for confirmation.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                    <ArrowLeft size={18} /> Back to Venues
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Venue Info */}
                    <div className="p-8 bg-primary text-white">
                        <h2 className="text-3xl font-bold mb-4">{room?.name}</h2>
                        <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-white/70" />
                                <span>Up to {room?.capacity} guests</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-white/70" />
                                <span>{room?.space || 'Swahili Pot Hub, Mombasa'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-white/70" />
                                <span>KSh {Number(room?.price).toLocaleString()} / day</span>
                            </div>
                        </div>
                        <div className="mt-10 p-4 bg-white/10 rounded-2xl border border-white/20">
                            <h4 className="font-bold mb-2">Description</h4>
                            <p className="text-white/80 text-sm leading-relaxed">{room?.description || 'Premium space for your events.'}</p>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Reserve Now</h3>

                        {error && <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="booking_date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.booking_date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="time"
                                        name="start_time"
                                        required
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="time"
                                        name="end_time"
                                        required
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                >
                                    <option value="booking">Booking</option>
                                    <option value="reservation">Reservation</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all bg-primary hover:bg-opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Confirm Reservation'}
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Your request will be sent to admin for approval. You will receive an email notification.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookVenue;

