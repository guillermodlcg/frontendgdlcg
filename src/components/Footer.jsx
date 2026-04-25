import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const SECTION_TITLE = (text) => (
  <p style={{ ...BC("13px", { color: "#7eb3e8", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 20px", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" })}}>{text}</p>
);

function NavLink({ to, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "block", padding: "8px 0", paddingLeft: hovered ? 8 : 0, textDecoration: "none", borderLeft: hovered ? "2px solid #1d4b8a" : "2px solid transparent", color: hovered ? "#ffffff" : "rgba(255,255,255,0.6)", transition: "all 0.2s", ...DM("14px", 400) }}>
      {children}
    </Link>
  );
}

function SocialBtn({ href, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", border: hovered ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.15)", background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)", transition: "all 0.2s", cursor: "pointer", textDecoration: "none" }}>
      {children}
    </a>
  );
}

function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer style={{ background: "#0a1628" }}>
      {/* Grid principal */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1.5fr",
        gap: isMobile ? "40px" : "64px",
        padding: isMobile ? "40px 24px 0" : "64px 64px 0",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>

        {/* Columna 1 — Marca */}
        <div style={{ textAlign: isMobile ? "center" : "left" }}>
          <p style={BC("32px", { color: "#ffffff", letterSpacing: "-1px", margin: "0 0 12px", fontWeight: 800 })}>GDLCG</p>
          <p style={DM("14px", 400, { color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 260, margin: isMobile ? "0 auto 0" : "0 0 0" })}>
            Ropa deportiva de alto rendimiento. Tu destino para moda activa y estilo platinado.
          </p>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "24px 0" }} />
          <div style={{ display: "flex", gap: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
            <SocialBtn href="https://www.facebook.com/guillermo.delacruzgallegos1/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </SocialBtn>
            <SocialBtn href="https://www.instagram.com/guillermodlcg/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </SocialBtn>
          </div>
        </div>

        {/* Columna 2 — Explora */}
        <div>
          {SECTION_TITLE("Explora")}
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/getallproducts">Colección Deportiva</NavLink>
          <NavLink to="/profile">Mi Perfil</NavLink>
          <NavLink to="/orders">Mis Pedidos</NavLink>
        </div>

        {/* Columna 3 — Información */}
        <div>
          {SECTION_TITLE("Información")}
          <NavLink to="/about">Sobre Nosotros</NavLink>
        </div>

        {/* Columna 4 — Contacto */}
        <div>
          {SECTION_TITLE("Contacto")}
          {[
            { icon: <MapPin size={16} color="#7eb3e8" style={{ marginTop: 2, flexShrink: 0 }} />, text: "Carretera Panamericana entronque Guadalajara S/N, La Escondida. C.P. 98000, Zacatecas, Zac." },
            { icon: <Phone size={16} color="#7eb3e8" style={{ marginTop: 2, flexShrink: 0 }} />, text: "+52 442 508 2560" },
            { icon: <Mail size={16} color="#7eb3e8" style={{ marginTop: 2, flexShrink: 0 }} />, text: "001memito@gmail.com" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              {item.icon}
              <span style={DM("13px", 400, { color: "rgba(255,255,255,0.6)", lineHeight: 1.6 })}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 48, background: "#07101f" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "20px 24px" : "20px 64px",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 8 : 0,
          textAlign: isMobile ? "center" : "left"
        }}>
          <span style={DM("12px", 400, { color: "rgba(255,255,255,0.35)" })}>
            © 2026 GDLCG — Ropa Deportiva. Todos los derechos reservados.
          </span>
          <span style={DM("12px", 400, { color: "rgba(255,255,255,0.35)" })}>
            Proyecto académico — ITZ
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
