import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, MapPin, Users, Star, ChevronRight, Loader2, Shield } from 'lucide-react';
import api from '../api';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/api/rooms');
                setRooms(res.data.data || []);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="bg-[#FCF9F6] min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000"
                        alt="Event Venue"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl text-white">
                        <span className="text-sm font-bold uppercase tracking-widest mb-4 block">Karibu Swahili Pot</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                            Book the Perfect Venue for Your Event
                        </h1>
                        <p className="text-xl mb-8 text-gray-200 leading-relaxed max-w-2xl">
                            Reserve elegant event spaces for weddings, corporate functions, parties, and community gatherings across Mombasa. Simple, reliable, and memorable.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#venues"
                                className="bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded font-bold text-lg flex items-center space-x-2 transition-all shadow-lg"
                            >
                                <Calendar size={20} />
                                <span>Book a Venue</span>
                            </a>
                            <Link to="/my-bookings" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded font-bold text-lg flex items-center space-x-2 transition-all">
                                <MessageSquare size={20} />
                                <span>Check My Booking</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Venues Section */}
            <section id="venues" className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center mb-16">
                    <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Our Spaces</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">Available Venues</h2>
                </div>

                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-primary mb-4" size={48} />
                            <p className="text-gray-500 font-serif italic">Curating beautiful spaces for you...</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No venues available at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {rooms.map(room => (
                                <div key={room.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={room.image_url || "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800">{room.space}</div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">{room.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pb-6 border-b border-gray-50">
                                            <div className="flex items-center space-x-1">
                                                <Users size={14} className="text-primary" />
                                                <span>{room.capacity} guests</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span>4.9</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">Starting from</span>
                                                {/* ✅ Fixed: KSh instead of $ */}
                                                <span className="text-lg font-bold text-primary">KSh {Number(room.price).toLocaleString()}</span>
                                            </div>
                                            <Link to={`/book/${room.id}`} className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded text-sm font-bold transition-all shadow-sm">Book Now</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-16 text-center">
                        <Link to="/venues" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline group">
                            <span>View all venues</span>
                            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-24 bg-[#FCF9F6]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Why Choose Swahili Pot</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">Venue Booking Made Simple</h2>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">From intimate corporate meetings to grand wedding celebrations, we have the perfect space and service for you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-red-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Easy Booking</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Reserve your ideal venue in minutes. Choose the space, date, and event type with our simple process.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-red-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Prime Locations</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">All venues are located in prime areas across Mombasa with easy access and ample parking.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-12 h-12 bg-red-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Quality Guaranteed</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Every venue is professionally maintained and set up before your event. Hakuna wasiwasi.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

