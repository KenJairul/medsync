import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className="nav">
            <a href="/" className="nav-logo">MedSync</a>
            <div className="nav-menu">
                <a 
                    href="/register" 
                    className={currentPath === '/register' ? 'active' : ''}
                >
                    Register
                </a>
                <a 
                    href="/search" 
                    className={`nav-records ${currentPath === '/search' ? 'active' : ''}`}
                >
                    Records
                </a>
            </div>
        </nav>
    );
};

export default Navbar;