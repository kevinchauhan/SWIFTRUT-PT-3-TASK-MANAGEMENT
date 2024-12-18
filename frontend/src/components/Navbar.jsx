import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-secondary text-primary px-6 py-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-semibold tracking-wide text-accent">
                    TaskPro
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-8">
                    <Link to="/dashboard" className="hover:text-accent transition-all duration-300">
                        Dashboard
                    </Link>
                    <Link to="/admin" className="hover:text-accent transition-all duration-300">
                        Admin Panel
                    </Link>
                    <Link to="/login" className="hover:text-accent transition-all duration-300">
                        Login
                    </Link>
                    <Link to="/signup" className="hover:text-accent transition-all duration-300">
                        Signup
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="block w-6 h-1 bg-primary mb-1"></span>
                    <span className="block w-6 h-1 bg-primary mb-1"></span>
                    <span className="block w-6 h-1 bg-primary"></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-3 bg-secondary text-primary p-4 rounded-lg shadow-lg">
                    <Link
                        to="/dashboard"
                        className="block px-4 py-2 rounded hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin"
                        className="block px-4 py-2 rounded hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Admin Panel
                    </Link>
                    <Link
                        to="/login"
                        className="block px-4 py-2 rounded hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="block px-4 py-2 rounded hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Signup
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
