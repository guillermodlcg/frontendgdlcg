import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  IoPerson,
  IoLogOutOutline,
  IoChevronDownSharp,
  IoBagOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Tooltip from "@mui/material/Tooltip";
import { useProducts } from "../context/ProductContext";

function NavbarUser() {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getTotalProducts } = useProducts();
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo centrado */}
        <div className="flex justify-center items-center py-4 border-b border-gray-200 dark:border-gray-800">
          <Link to='/getallproducts' className="transition-opacity hover:opacity-70">
            <h1 className="text-3xl tracking-widest text-gray-900 dark:text-white" style={{ fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: '0.2em' }}>
              OLDCHICK
            </h1>
          </Link>
        </div>

        {/* Menú de navegación */}
        <div className="flex justify-between items-center py-3">
          <ul className="flex gap-8 text-sm tracking-wider items-center text-gray-700 dark:text-gray-300">
            <li>
              <Menu>
                <MenuButton className="flex items-center gap-1 hover:opacity-60 transition-opacity">
                  PRODUCTOS
                  <IoChevronDownSharp size={16} />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom start"
                  className="mt-2 w-56 origin-top rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm shadow-lg transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => navigate('/getallproducts')}
                    >
                      <IoBagOutline size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Ver Productos</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => navigate('/orders')}
                    >
                      <IoReceiptOutline size={18} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">Mis Órdenes</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </li>
            <li>
              <Link to="/getallproducts" className="hover:opacity-60 transition-opacity">
                COLECCIÓN
              </Link>
            </li>
          </ul>

          <ul className="flex gap-6 items-center text-sm tracking-wider text-gray-700 dark:text-gray-300">
            <li>
              <Tooltip title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>
                <button 
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  {theme === 'light' ? <IoMoon size={20} /> : <IoSunny size={20} />}
                </button>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Carrito de compras">
                <Link to="/cart" className="relative hover:opacity-60 transition-opacity">
                  <IoCartOutline size={22} />
                  {getTotalProducts() > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-black dark:bg-white dark:text-black rounded-full">
                      {getTotalProducts()}
                    </span>
                  )}
                </Link>
              </Tooltip>
            </li>
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
                  <IoLogOutOutline size={16} />
                  SALIR
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarUser;