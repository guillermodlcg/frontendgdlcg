import React, { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import { Link, useNavigate } from "react-router-dom";
import { X, Home, ShoppingBag, LogIn, ArrowRight, ChevronDown, Menu } from "lucide-react";

const iconButtonStyle = {
  background: "transparent", border: "1px solid #e5e0d8",
  width: "38px", height: "38px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", transition: "all 0.15s", borderRadius: "0",
};
const textButtonStyle = {
  background: "transparent", padding: "8px 16px",
  fontSize: "12px", letterSpacing: "1px",
  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
  textTransform: "uppercase", transition: "all 0.15s", border: "none",
};
const primaryButtonStyle = {
  background: "#0f1f35", color: "#fff",
  border: "none", padding: "8px 20px",
  fontSize: "12px", letterSpacing: "1.5px",
  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
  textTransform: "uppercase", transition: "all 0.15s",
};

const DRAWER_LINK_STYLE = (hovered) => ({
  display: "flex", alignItems: "center", gap: "12px",
  padding: "14px 24px",
  borderLeft: hovered ? "3px solid #1d4b8a" : "3px solid transparent",
  background: hovered ? "#f5f7fa" : "transparent",
  color: hovered ? "#1d4b8a" : "#0f1f35",
  textDecoration: "none",
  fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px",
  transition: "all 0.15s", cursor: "pointer",
});

function DrawerLink({ to, icon, children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={DRAWER_LINK_STYLE(hovered)}>
      {React.cloneElement(icon, { color: hovered ? "#1d4b8a" : "#8a9bb0" })}
      {children}
    </Link>
  );
}

function DropdownItem({ icon, children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "11px 20px", width: "100%",
        background: hovered ? "#f5f7fa" : "transparent",
        borderLeft: hovered ? "3px solid #1d4b8a" : "3px solid transparent",
        color: hovered ? "#1d4b8a" : "#0f1f35",
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px",
        borderTop: "none", borderRight: "none", borderBottom: "none",
        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
      }}>
      {React.cloneElement(icon, { color: hovered ? "#1d4b8a" : "#8a9bb0" })}
      {children}
    </button>
  );
}

function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [regHovered, setRegHovered] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isAuthenticated && isAdmin) return <NavbarAdmin />;
  if (isAuthenticated) return <NavbarUser />;

  const openDropdown = () => { clearTimeout(closeTimer.current); setDropdownOpen(true); };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setDropdownOpen(false), 150); };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #e5e0d8" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 48px", height: "64px", maxWidth: "100%", boxSizing: "border-box" }}>

        {/* Zona izquierda */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src={logo} alt="GDLCG" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "20px", color: "#0f1f35", letterSpacing: "-0.5px" }}>GDLCG</span>
          </Link>
          {!isMobile && (
            <>
              <div style={{ width: "1px", height: "20px", background: "#e5e0d8", margin: "0 24px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {/* Dropdown Productos */}
                <div style={{ position: "relative" }} onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                  <button style={{ ...textButtonStyle, color: "#4a5568", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f7fa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    PRODUCTOS <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 1px)", left: 0, background: "#fff", border: "1px solid #e5e0d8", borderTop: "2px solid #1d4b8a", minWidth: "200px", boxShadow: "0 8px 24px rgba(15,31,53,0.10)", zIndex: 100, padding: "8px 0" }}>
                      <DropdownItem icon={<ShoppingBag size={15} />} onClick={() => { navigate("/getallproducts"); setDropdownOpen(false); }}>Ver Colección</DropdownItem>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Zona central */}
        {!isMobile && (
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", color: "#8a9bb0" }}>
            COLECCIÓN DEPORTIVA
          </span>
        )}

        {/* Zona derecha */}
        {isMobile ? (
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Menu size={22} color="#0f1f35" />
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => navigate("/getallproducts")} style={iconButtonStyle} title="Ver productos"
              onMouseEnter={e => e.currentTarget.style.background = "#f5f7fa"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <ShoppingBag size={20} color="#4a5568" />
            </button>
            <button onClick={() => navigate("/login")} style={{ ...textButtonStyle, color: "#0f1f35", border: "1px solid #e5e0d8" }}>
              <LogIn size={15} /> INICIAR SESIÓN
            </button>
            <button onClick={() => navigate("/register")} style={primaryButtonStyle}
              onMouseEnter={e => e.currentTarget.style.background = "#1d4b8a"}
              onMouseLeave={e => e.currentTarget.style.background = "#0f1f35"}>
              REGISTRARSE <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,31,53,0.45)", zIndex: 199 }} />
      )}

      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, left: menuOpen ? 0 : "-280px", width: "280px", height: "100vh", background: "#fff", zIndex: 200, display: "flex", flexDirection: "column", boxShadow: "4px 0 32px rgba(15,31,53,0.18)", transition: "left 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e5e0d8" }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0f1f35" }}>GDLCG</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={20} color="#4a5568" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          <DrawerLink to="/" icon={<Home size={18} />} onClick={() => setMenuOpen(false)}>Inicio</DrawerLink>
          <DrawerLink to="/getallproducts" icon={<ShoppingBag size={18} />} onClick={() => setMenuOpen(false)}>Colección Deportiva</DrawerLink>
          <DrawerLink to="/login" icon={<LogIn size={18} />} onClick={() => setMenuOpen(false)}>Iniciar Sesión</DrawerLink>
        </div>
        <div style={{ borderTop: "1px solid #e5e0d8", margin: "8px 0" }} />
        <div style={{ padding: "16px 24px" }}>
          <button
            onClick={() => { setMenuOpen(false); navigate("/register"); }}
            onMouseEnter={() => setRegHovered(true)}
            onMouseLeave={() => setRegHovered(false)}
            style={{ width: "100%", background: regHovered ? "#1d4b8a" : "#0f1f35", color: "#fff", padding: "14px", border: "none", borderRadius: 4, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", transition: "background 0.15s" }}>
            REGISTRARSE <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
