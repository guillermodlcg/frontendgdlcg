import React from "react";
import { Link } from "react-router-dom";
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoPinterest, IoMail, IoCall, IoLocation } from "react-icons/io5";

function Footer() {
  return (
    <footer className="glass-effect mt-auto border-t elegant-border bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección de la empresa */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text" style={{fontFamily: "'Playfair Display', serif"}}>OLDCHICK</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Elegancia atemporal y sofisticación en cada prenda. Tu destino para moda exclusiva.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-amber-400 transition-colors" style={{color: 'var(--gold)'}}>
                <IoLogoFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-amber-400 transition-colors" style={{color: 'var(--gold)'}}>
                <IoLogoTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-amber-400 transition-colors" style={{color: 'var(--gold)'}}>
                <IoLogoInstagram size={24} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"
                 className="hover:text-amber-400 transition-colors" style={{color: 'var(--gold)'}}>
                <IoLogoPinterest size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{color: 'var(--gold)', fontFamily: "'Playfair Display', serif"}}>Explora</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/getallproducts" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Colección
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{color: 'var(--gold)', fontFamily: "'Playfair Display', serif"}}>Servicio al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Guía de Tallas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{color: 'var(--gold)', fontFamily: "'Playfair Display', serif"}}>Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <IoLocation size={20} style={{color: 'var(--gold)'}} />
                <span className="text-sm">Av. Elegancia #123, Ciudad</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <IoCall size={20} style={{color: 'var(--gold)'}} />
                <a href="tel:+1234567890" className="text-sm hover:text-amber-400 transition-colors">
                  +123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <IoMail size={20} style={{color: 'var(--gold)'}} />
                <a href="mailto:info@oldchick.com" className="text-sm hover:text-amber-400 transition-colors">
                  info@oldchick.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} OLDCHICK - Elegancia Atemporal. Todos los derechos reservados. | 
            Proyecto de Seguridad en Aplicaciones Web
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;