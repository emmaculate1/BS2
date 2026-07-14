import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Calendar, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: <HomeIcon size={18} /> },
        { name: 'Venues', path: '/#venues', icon: <Calendar size={18} /> },
    ];

    const isActive = (path) => {
        if (path.startsWith('/#')) {
            return location.pathname === '/' && location.hash === path.substring(1);
        }
        return location.pathname === path;
    };

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' 
                : 'bg-transparent py-5'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-primary rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white font-serif font-bold text-xl transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            S
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-serif font-bold text-xl leading-none transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900 md:text-white'}`}>Swahili Pot</span>
                            <span className={`text-[10px] uppercase tracking-[0.2em] mt-1 transition-colors ${isScrolled ? 'text-gray-500' : 'text-gray-500 md:text-gray-300'}`}>Event Booking</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`text-sm font-bold transition-all hover:text-primary relative group ${
                                    isActive(link.path) 
                                    ? 'text-primary' 
                                    : (isScrolled ? 'text-gray-600' : 'text-white')
                                }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
                            </Link>
                        ))}

                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center space-x-2 p-1 rounded-full transition-all ${
                                        isScrolled ? 'bg-gray-100' : 'bg-white/10'
                                    } hover:ring-2 hover:ring-primary/30`}
                                >
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                                        <User size={18} />
                                    </div>
                                    <span className={`text-sm font-bold pr-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                                        {user.full_name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className={isScrolled ? 'text-gray-400' : 'text-gray-300'} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                                        </div>
                                        <Link 
                                            to="/dashboard" 
                                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className={`text-sm font-bold hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${
                                isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-900 hover:bg-black/5'
                            }`}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                    isActive(link.path) 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        
                        <div className="pt-4 border-t border-gray-50">
                            {user ? (
                                <>
                                    <Link 
                                        to="/dashboard" 
                                        className="flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-4 w-full px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 px-2">
                                    <Link 
                                        to="/login" 
                                        className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-gray-600 border border-gray-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-white bg-primary shadow-lg shadow-primary/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;