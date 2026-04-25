import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, Zap, Leaf, Award, Truck } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const CATEGORIAS = [
  { name: "TOPS", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800", category: "tops", desc: "Tops técnicos de alto rendimiento" },
  { name: "LEGGINGS", img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800", category: "leggings", desc: "Compresión y comodidad en cada movimiento" },
  { name: "SHORTS", img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800", category: "shorts", desc: "Libertad de movimiento total" },
  { name: "CALZADO", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", category: "calzado", desc: "Rendimiento desde el suelo" },
  { name: "SUDADERAS", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800", category: "sudaderas", desc: "Estilo y abrigo para cada sesión" },
  { name: "PANTS", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", category: "pants", desc: "Comodidad premium para entrenar" },
  { name: "ACCESORIOS", img: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800", category: "accesorios", desc: "Complementa tu outfit deportivo" },
];

const FEATURES = [
  { icon: <Zap size={28} color="#7eb3e8" />, title: "ALTO RENDIMIENTO", desc: "Materiales técnicos diseñados para el movimiento extremo" },
  { icon: <Leaf size={28} color="#7eb3e8" />, title: "SOSTENIBLE", desc: "Producción responsable con materiales eco-friendly" },
  { icon: <Award size={28} color="#7eb3e8" />, title: "DISEÑO PREMIUM", desc: "Estética deportiva para gym y vida cotidiana" },
  { icon: <Truck size={28} color="#7eb3e8" />, title: "ENVÍO EXPRESS", desc: "Entrega en 24-48 horas en todo el país" },
];

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startInterval = () => {
    intervalRef.current = setInterval(() => setCurrentSlide(p => (p + 1) % CATEGORIAS.length), 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(intervalRef.current);
    setCurrentSlide(i);
    setActiveTab(i);
    startInterval();
  };

  const prev = () => goTo((currentSlide - 1 + CATEGORIAS.length) % CATEGORIAS.length);
  const next = () => goTo((currentSlide + 1) % CATEGORIAS.length);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? "auto" : "88vh", overflow: "hidden", borderBottom: "1px solid #e5e0d8" }}>
        {/* Columna izquierda */}
        <div style={{ background: "#fafaf8", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "48px 24px" : isTablet ? "60px 40px" : "60px 64px" }}>
          <p style={DM(12, 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 16 })}>
            COLECCIÓN DEPORTIVA 2026
          </p>
          <h1 style={{ margin: "0 0 4px", lineHeight: 1 }}>
            <span style={BC(isMobile ? "clamp(40px, 10vw, 64px)" : isTablet ? "clamp(40px, 4vw, 64px)" : "clamp(48px, 5vw, 80px)", { color: "#0f1f35", display: "block", letterSpacing: isMobile ? "-1px" : "-2px" })}>RENDIMIENTO</span>
            <span style={BC(isMobile ? "clamp(40px, 10vw, 64px)" : isTablet ? "clamp(40px, 4vw, 64px)" : "clamp(48px, 5vw, 80px)", { color: "#1d4b8a", display: "block", letterSpacing: isMobile ? "-1px" : "-2px" })}>SIN LÍMITES</span>
          </h1>
          <p style={DM(15, 400, { color: "#4a5568", lineHeight: 1.7, maxWidth: isMobile ? "100%" : 420, margin: "20px 0 32px" })}>
            Ropa deportiva de alto rendimiento diseñada para superar tus límites. Calidad premium, estilo inigualable.
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
            <Link to="/getallproducts" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#0f1f35", color: "#fff", padding: "14px 28px", borderRadius: 6, textDecoration: "none", width: isMobile ? "100%" : "auto", ...DM(13, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
              <ShoppingBag size={16} /> Ver Colección
            </Link>
            {!isAuthenticated && (
              <Link to="/register" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", color: "#0f1f35", padding: "14px 28px", borderRadius: 6, border: "1.5px solid #0f1f35", textDecoration: "none", width: isMobile ? "100%" : "auto", ...DM(13, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
                Registrarse <ArrowRight size={16} />
              </Link>
            )}
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: isMobile ? 24 : 32, marginTop: isMobile ? 32 : 40, paddingTop: isMobile ? 32 : 32, borderTop: "1px solid #e5e0d8" }}>
            {[["20+", "Productos"], ["7", "Categorías"], ["100%", "Calidad"]].map(([n, l]) => (
              <div key={l}>
                <p style={BC("28px", { color: "#0f1f35", margin: 0 })}>{n}</p>
                <p style={DM(12, 400, { color: "#8a9bb0", margin: 0 })}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Columna derecha — imagen (solo desktop/tablet) */}
        {!isMobile && (
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80" alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            <div style={{ position: "absolute", bottom: 24, right: 24, background: "rgba(255,255,255,0.95)", borderLeft: "3px solid #1d4b8a", padding: "12px 18px", borderRadius: "0 6px 6px 0" }}>
              <p style={DM(11, 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px" })}>Nueva temporada</p>
              <p style={BC("18px", { color: "#0f1f35", margin: 0 })}>2026</p>
            </div>
          </div>
        )}
      </section>

      {/* CATEGORÍAS */}
      <section style={{ background: "#fff", padding: isMobile ? "48px 0 0" : "64px 0 0" }}>
        <div style={{ padding: isMobile ? "0 16px 24px" : "0 64px 40px" }}>
          <p style={DM(11, 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 6 })}>Explorar</p>
          <h2 style={BC("40px", { color: "#0f1f35", margin: "0 0 28px" })}>CATEGORÍAS</h2>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e5e0d8", marginBottom: 24, overflowX: "auto" }}>
            {CATEGORIAS.map((cat, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                background: "none", border: "none", cursor: "pointer", padding: isMobile ? "12px 14px" : "10px 20px",
                borderBottom: activeTab === i ? "2px solid #0f1f35" : "2px solid transparent",
                ...DM(isMobile ? "11px" : "12px", activeTab === i ? 600 : 400, { color: activeTab === i ? "#0f1f35" : "#8a9bb0", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" })
              }}>{cat.name}</button>
            ))}
          </div>
        </div>

        {/* Carrusel */}
        <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
          {CATEGORIAS.map((cat, i) => (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: i === currentSlide ? 1 : 0, transition: "opacity 0.7s ease", zIndex: i === currentSlide ? 1 : 0 }}>
              <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,31,53,0.85) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: isMobile ? 40 : 48, left: isMobile ? 20 : 48 }}>
                <h3 style={BC(isMobile ? "36px" : "56px", { color: "#fff", margin: "0 0 8px" })}>{cat.name}</h3>
                <p style={DM(14, 400, { color: "rgba(255,255,255,0.8)", margin: "0 0 20px" })}>{cat.desc}</p>
                <Link to={`/getallproducts?categoria=${cat.category}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#0f1f35", padding: "12px 24px", borderRadius: 4, textDecoration: "none", ...DM(12, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
                  VER COLECCIÓN <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
          {/* Flechas */}
          {isMobile ? (
            <>
              <button onClick={prev} style={{ position: "absolute", right: 64, bottom: 20, zIndex: 10, width: 40, height: 40, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronLeft size={20} color="#0f1f35" />
              </button>
              <button onClick={next} style={{ position: "absolute", right: 16, bottom: 20, zIndex: 10, width: 40, height: 40, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronRight size={20} color="#0f1f35" />
              </button>
            </>
          ) : (
            <>
              <button onClick={prev} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 40, height: 40, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronLeft size={20} color="#0f1f35" />
              </button>
              <button onClick={next} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 40, height: 40, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ChevronRight size={20} color="#0f1f35" />
              </button>
            </>
          )}
          {/* Dots */}
          <div style={{ position: "absolute", bottom: isMobile ? 16 : 16, left: isMobile ? 20 : "50%", transform: isMobile ? "none" : "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
            {CATEGORIAS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ height: 4, width: i === currentSlide ? 24 : 8, background: i === currentSlide ? "#fff" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 2, cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#0f1f35", padding: isMobile ? "48px 24px" : isTablet ? "64px 40px" : "64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 32 : 32 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {f.icon}
              <p style={DM(12, 600, { color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px", margin: 0 })}>{f.title}</p>
              <p style={DM(13, 400, { color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 })}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER CTA */}
      <section style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80" alt="CTA" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,31,53,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: isMobile ? "0 24px" : "0 64px" }}>
          <h2 style={BC(isMobile ? "clamp(28px, 8vw, 48px)" : "56px", { color: "#fff", margin: 0, textAlign: "center" })}>ENTRENA CON ESTILO</h2>
          <Link to="/getallproducts" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#0f1f35", padding: "14px 32px", borderRadius: 4, textDecoration: "none", ...DM(13, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}>
            EXPLORAR TODO <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
