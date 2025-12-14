import React from "react";
import { IoLogIn, IoPersonAdd } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import { Link } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

function Navbar() {
    const { isAuthenticated, isAdmin } = useAuth();

    if (isAuthenticated && isAdmin)
        return <NavbarAdmin />
    else if (isAuthenticated)
        return <NavbarUser />

    return (// Barra de navegación pública minimalista
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Logo centrado */}
                <div className="flex justify-center items-center py-4 border-b border-gray-200">
                    <Link to='/' className="transition-opacity hover:opacity-70">
                        <h1 className="text-3xl tracking-widest" style={{fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: '0.2em'}}>
                            OLDCHICK
                        </h1>
                    </Link>
                </div>
                
                {/* Menú de navegación */}
                <div className="flex justify-between items-center py-3">
                    <ul className="flex gap-8 text-sm tracking-wider">
                        <li><Link to='/getallproducts' className="hover:opacity-60 transition-opacity">COLECCIONES</Link></li>
                        <li><Link to='/getallproducts' className="hover:opacity-60 transition-opacity">ROPA</Link></li>
                        <li><Link to='/getallproducts' className="hover:opacity-60 transition-opacity">REBAJAS</Link></li>
                    </ul>
                    
                    <ul className="flex gap-6 items-center text-sm tracking-wider">
                        <li>
                            <Tooltip title='Iniciar sesión'>
                                <Link to='/login' className="flex items-center gap-2 hover:opacity-60 transition-opacity">
                                    <IoLogIn size={18} />
                                    <span className="hidden md:inline">INICIAR SESIÓN</span>
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip title='Registrarse'>
                                <Link to='/register' className="btn-primary px-6 py-2 text-xs">
                                    REGISTRARSE
                                </Link>
                            </Tooltip>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
