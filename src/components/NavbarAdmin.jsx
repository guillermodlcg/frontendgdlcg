import React from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { IoPerson, IoLogOut, IoChevronDownSharp, IoBagAdd, IoBagSharp, IoReceiptOutline } from "react-icons/io5";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function NavbarAdmin() {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Logo centrado */}
                <div className="flex justify-center items-center py-4 border-b border-gray-200">
                    <Link to='/products' className="transition-opacity hover:opacity-70">
                        <h1 className="text-3xl tracking-widest" style={{fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: '0.2em'}}>
                            OLDCHICK
                        </h1>
                    </Link>
                </div>
                
                {/* Menú de navegación */}
                <div className="flex justify-between items-center py-3">
                    <ul className="flex gap-8 text-sm tracking-wider items-center">
                        <li>
                            <Menu>
                                <MenuButton className="flex items-center gap-1 hover:opacity-60 transition-opacity">
                                    PRODUCTOS
                                    <IoChevronDownSharp size={16} />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    anchor="bottom start"
                                    className="mt-2 w-56 origin-top rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-lg transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                >
                                    <MenuItem>
                                        <button 
                                            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => navigate('/products')}
                                        >
                                            <IoBagSharp size={18} className="text-gray-600" />
                                            <span className="text-gray-700">Listar Productos</span>
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button 
                                            className="group flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => navigate('/add-product')}
                                        >
                                            <IoBagAdd size={18} className="text-gray-600" />
                                            <span className="text-gray-700">Agregar Producto</span>
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </li>
                        <li>
                            <Link to="/orders" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                                <IoReceiptOutline size={18} />
                                ÓRDENES
                            </Link>
                        </li>
                    </ul>
                    
                    <ul className="flex gap-6 items-center text-sm tracking-wider">
                        <li>
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 hover:opacity-60 transition-opacity"
                            >
                                <IoPerson size={18} />
                                <span className="uppercase">{user.username}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/' onClick={() => logOut()}>
                                <button className="btn-primary px-6 py-2 text-xs flex items-center gap-2">
                                    <IoLogOut size={16} />
                                    SALIR
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavbarAdmin