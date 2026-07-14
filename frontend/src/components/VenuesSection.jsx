import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Monitor,
    Users,
    CheckCircle,
    XCircle,
    Calendar,
    Wifi,
    Projector,
    Coffee,
    Cpu,
    Loader2
} from 'lucide-react';

const equipmentIcons = {
    'Projector': <Projector size={14} />,
    'Wi-Fi': <Wifi size={14} />,
    'Coffee Machine': <Coffee size={14} />,
    '30 Computers': <Cpu size={14} />,
    'High-Speed Internet': <Wifi size={14} />,
    'Smart TV': <Monitor size={14} />,
};

const VenueCard = ({ venue, onBook }) => {
    const isAvailable = venue.status && venue.status.toLowerCase() === 'available';

    // Parse amenities if string (from MySQL JSON column often comes as string in some drivers)
    let amenities = [];
    try {
        amenities = typeof venue.amenities === 'string'
            ? JSON.parse(venue.amenities)
            : (Array.isArray(venue.amenities) ? venue.amenities : []);
    } catch (e) {
        console.error("Error parsing amenities", e);
    }

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Image or fallback */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                {venue.image_url ? (
                    <img
                        src={venue.image_url}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Monitor size={48} />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${isAvailable
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        {isAvailable
                            ? <><CheckCircle size={12} /> Available</>
                            : <><XCircle size={12} /> Booked</>
                        }
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                    <span className="text-blue-600 font-bold">KSh {venue.price}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{venue.description}</p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="mr-2 text-blue-500" />
                        <span>Capacity: <strong>{venue.capacity} people</strong></span>
                    </div>

                    <div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {amenities.slice(0, 3).map((item, index) => (
                                <span key={index} className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-lg border border-gray-100">
                                    {equipmentIcons[item] || <CheckCircle size={12} />}
                                    {item}
                                </span>
                            ))}
                            {amenities.length > 3 && (
                                <span className="text-xs text-gray-400">+{amenities.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>

                {isAvailable ? (
                    <button
                        onClick={() => onBook(venue)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                    >
                        <Calendar size={16} />
                        Book Venue
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed">
                        <XCircle size={16} />
                        Currently Unavailable
                    </div>
                )}
            </div>
        </div>
    );
};

const VenuesSection = () => {
    const [venuesList, setVenuesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/rooms');
            console.log('Fetched venues:', res.data.data);
            setVenuesList(res.data.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching venues:', err);
            setError('Failed to load available venues. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = (venue) => {
        navigate(`/book/${venue.id}`);
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
                <p className="text-lg font-medium">Discovering amazing venues...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button
                    onClick={fetchVenues}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl font-bold text-gray-900 font-serif">Our Venues</h2>
                <p className="text-gray-500 mt-2 text-lg">Browse and book our premium spaces for your next big idea.</p>
            </div>

            {venuesList.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Monitor size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No venues available yet</h3>
                    <p className="text-gray-500">Check back soon or contact support for assistance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {venuesList.map(venue => (
                        <VenueCard key={venue.id} venue={venue} onBook={handleBook} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default VenuesSection;
