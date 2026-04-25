import React, { useEffect, useRef, useState } from "react";
import fotoPerfil from "../assets/fotoperfil.jpeg";
import logoItz from "../assets/Itz.png";
import { Layers, Server, Zap, Database, ShieldCheck, Cloud, Paintbrush, CheckSquare, Lightbulb, Cpu, TrendingUp } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function useInView() {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

function Fade({ children, delay = 0, direction = "up" }) {
    const [ref, inView] = useInView();
    const transforms = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)" };
    return (
        <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translate(0)" : transforms[direction], transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
            {children}
        </div>
    );
}

const STYLES = `
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes pulse-ring { 0%,100% { box-shadow:0 0 0 0 rgba(29,75,138,0.3); } 50% { box-shadow:0 0 0 12px rgba(29,75,138,0); } }
    .about-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .about-card:hover { box-shadow: 0 8px 24px rgba(15,31,53,0.12); transform: translateY(-4px); }
`;

const TECH_STACK = [
    { name: "React",        desc: "UI declarativa con hooks y contexto",                icon: <Layers      size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "Node.js",      desc: "Runtime JavaScript del lado del servidor",           icon: <Server      size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "Express",      desc: "Framework minimalista para APIs REST",               icon: <Zap         size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "MongoDB",      desc: "Base de datos NoSQL orientada a documentos",         icon: <Database    size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "JWT",          desc: "Autenticación segura con tokens firmados",           icon: <ShieldCheck size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "Cloudinary",   desc: "Gestión y optimización de imágenes en la nube",     icon: <Cloud       size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "Tailwind CSS", desc: "Utilidades CSS para diseño rápido y responsivo",    icon: <Paintbrush  size={28} strokeWidth={1.5} color="#0f1f35" /> },
    { name: "Zod",          desc: "Validación de esquemas con TypeScript-first",       icon: <CheckSquare size={28} strokeWidth={1.5} color="#0f1f35" /> },
];

function AboutPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const h = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    const sectionPad = isMobile ? "48px 24px" : isTablet ? "64px 40px" : "80px 64px";
    const techCols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
    const whyCols = isMobile ? "1fr" : "repeat(3, 1fr)";
    const relCols = isMobile ? "1fr" : "repeat(2, 1fr)";

    return (
        <div style={{ background: "#fafaf8", width: "100%" }}>
            <style>{STYLES}</style>

            {/* HERO */}
            <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? "auto" : "88vh", overflow: "hidden" }}>
                {/* Izquierda */}
                <div style={{ background: "#fafaf8", display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "48px 24px" : isTablet ? "48px 40px" : "64px" }}>
                    <Fade>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                            <img
                                src={logoItz}
                                alt="ITZ"
                                style={{
                                    width: 56,
                                    height: 56,
                                    objectFit: "contain",
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    display: "block",
                                    background: "transparent",
                                }}
                            />
                            <div>
                                <p style={DM("10px", 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "2px", margin: 0 })}>Instituto Tecnológico de Zacatecas</p>
                                <p style={DM("10px", 400, { color: "#8a9bb0", margin: 0 })}>TecNM — Ingeniería en Sistemas Computacionales</p>
                            </div>
                        </div>

                        {/* Foto de perfil — solo visible en móvil, centrada */}
                        {isMobile && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, gap: 12 }}>
                                <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: "3px solid #1d4b8a", flexShrink: 0, boxShadow: "0 0 20px rgba(29,75,138,0.25)" }}>
                                    <img src={fotoPerfil} alt="Guillermo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                </div>
                                <p style={BC("18px", { color: "#0f1f35", margin: 0, textAlign: "center" })}>GUILLERMO DE LA CRUZ</p>
                                <p style={DM("12px", 400, { color: "#8a9bb0", margin: 0, textAlign: "center" })}>Ing. en Sistemas Computacionales</p>
                                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                    <a href="https://www.instagram.com/guillermodlcg/" target="_blank" rel="noopener noreferrer"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f5fb", border: "1px solid #e5e0d8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4b8a" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                    </a>
                                    <a href="https://www.facebook.com/guillermo.delacruzgallegos1/" target="_blank" rel="noopener noreferrer"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f5fb", border: "1px solid #e5e0d8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4b8a" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                    </a>
                                    <a href="mailto:001memito@gmail.com"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f5fb", border: "1px solid #e5e0d8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4b8a" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </a>
                                </div>
                            </div>
                        )}
                        <p style={DM("11px", 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 12 })}>PROYECTO FINAL</p>
                        <h1 style={{ margin: "0 0 4px", lineHeight: 1 }}>
                            <span style={BC(isMobile ? "clamp(48px, 12vw, 72px)" : "clamp(56px, 6vw, 96px)", { color: "#0f1f35", display: "block" })}>GDLCG</span>
                        </h1>
                        <p style={BC("clamp(16px, 2vw, 28px)", { color: "#1d4b8a", margin: "0 0 20px", letterSpacing: "2px" })}>TIENDA DE ROPA DEPORTIVA</p>
                        <p style={DM("14px", 400, { color: "#4a5568", lineHeight: 1.8, maxWidth: 440, margin: "0 0 32px" })}>
                            Aplicación web full-stack desarrollada como proyecto final para la materia <strong style={{ color: "#0f1f35" }}>Temas Selectos de Programación Web</strong>. Integra autenticación, gestión de productos, carrito de compras y panel administrativo.
                        </p>
                        <div style={{ display: "flex", gap: isMobile ? 16 : 12, paddingTop: 24, borderTop: "1px solid #e5e0d8", flexWrap: "wrap" }}>
                            {[["Full-Stack", "React + Node.js"], ["Base de Datos", "MongoDB"], ["Despliegue", "Nube"]].map(([label, val]) => (
                                <div key={label}>
                                    <p style={BC("22px", { color: "#0f1f35", margin: 0 })}>{val}</p>
                                    <p style={DM("11px", 400, { color: "#8a9bb0", margin: 0 })}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </Fade>
                </div>

                {/* Derecha — solo desktop/tablet */}
                {!isMobile && (
                    <div style={{ background: "#0f1f35", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "64px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(29,75,138,0.3)" }} />
                        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(29,75,138,0.2)" }} />
                        <Fade direction="right">
                            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                                <div style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", border: "3px solid #1d4b8a", margin: "0 auto 24px", animation: "float 4s ease-in-out infinite, pulse-ring 3s ease-in-out infinite", boxShadow: "0 0 32px rgba(29,75,138,0.4)" }}>
                                    <img src={fotoPerfil} alt="Guillermo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <p style={BC("24px", { color: "#fff", margin: "0 0 4px" })}>GUILLERMO DE LA CRUZ</p>
                                <p style={DM("13px", 400, { color: "#7eb3e8", margin: "0 0 20px" })}>Ing. en Sistemas Computacionales</p>
                                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                    <a href="https://www.instagram.com/guillermodlcg/" target="_blank" rel="noopener noreferrer"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7eb3e8" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                    </a>
                                    <a href="https://www.facebook.com/guillermo.delacruzgallegos1/" target="_blank" rel="noopener noreferrer"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7eb3e8" strokeWidth="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                    </a>
                                    <a href="mailto:001memito@gmail.com"
                                        style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7eb3e8" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </a>
                                </div>
                            </div>
                        </Fade>
                    </div>
                )}
            </section>

            {/* TECH STACK */}
            <section style={{ background: "#fff", padding: sectionPad }}>
                <Fade>
                    <div style={{ marginBottom: 48 }}>
                        <p style={DM("11px", 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 })}>TECNOLOGÍAS</p>
                        <h2 style={BC("40px", { color: "#0f1f35", margin: 0 })}>STACK TECNOLÓGICO</h2>
                    </div>
                </Fade>
                <div style={{ display: "grid", gridTemplateColumns: techCols, gap: 20 }}>
                    {TECH_STACK.map((tech, i) => (
                        <Fade key={tech.name} delay={i * 0.06}>
                            <div className="about-card" style={{ background: "#fafaf8", border: "1px solid #e5e0d8", borderRadius: 12, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {tech.icon}
                                    <span style={BC("20px", { color: "#0f1f35" })}>{tech.name}</span>
                                </div>
                                <p style={DM("13px", 400, { color: "#4a5568", lineHeight: 1.6, margin: 0 })}>{tech.desc}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            {/* POR QUÉ */}
            <section style={{ background: "#fafaf8", padding: sectionPad }}>
                <Fade>
                    <div style={{ marginBottom: 48 }}>
                        <p style={DM("11px", 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 })}>EL PROYECTO</p>
                        <h2 style={BC("40px", { color: "#0f1f35", margin: 0 })}>¿POR QUÉ GDLCG?</h2>
                    </div>
                </Fade>
                <div style={{ display: "grid", gridTemplateColumns: whyCols, gap: 24 }}>
                    {[
                        { icon: <Lightbulb  size={32} strokeWidth={1.5} color="#0f1f35" />, title: "LA IDEA",        text: "Nació de la necesidad de aplicar tecnologías web modernas en un contexto real. El e-commerce de ropa deportiva es un mercado en crecimiento ideal para demostrar competencias full-stack." },
                        { icon: <Cpu        size={32} strokeWidth={1.5} color="#0f1f35" />, title: "LA TECNOLOGÍA",  text: "React, Node.js, Express y MongoDB. Integra JWT, Cloudinary, Zod y Tailwind CSS en una arquitectura MVC robusta y escalable." },
                        { icon: <TrendingUp size={32} strokeWidth={1.5} color="#0f1f35" />, title: "EL IMPACTO",     text: "Demuestra que un estudiante puede diseñar, desarrollar y desplegar una app web completa de nivel profesional, desde la BD hasta la UI." },
                    ].map((item, i) => (
                        <Fade key={item.title} delay={i * 0.12}>
                            <div className="about-card" style={{ background: "#fff", border: "1px solid #e5e0d8", borderLeft: "3px solid #1d4b8a", borderRadius: 12, padding: "28px 24px" }}>
                                <div style={{ marginBottom: 16 }}>{item.icon}</div>
                                <h3 style={BC("18px", { color: "#0f1f35", margin: "0 0 10px" })}>{item.title}</h3>
                                <p style={DM("13px", 400, { color: "#4a5568", lineHeight: 1.7, margin: 0 })}>{item.text}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            {/* RELEVANCIA */}
            <section style={{ background: "#fff", padding: sectionPad }}>
                <Fade>
                    <div style={{ marginBottom: 48 }}>
                        <p style={DM("11px", 600, { color: "#1d4b8a", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 8 })}>RELEVANCIA</p>
                        <h2 style={BC("40px", { color: "#0f1f35", margin: 0 })}>POR QUÉ ES IMPORTANTE</h2>
                    </div>
                </Fade>
                <div style={{ display: "grid", gridTemplateColumns: relCols, gap: 20 }}>
                    {[
                        { title: "Formación Integral",    text: "Integra BD, POO, seguridad web, UI/UX y despliegue en la nube en un solo proyecto cohesivo." },
                        { title: "Estándar Profesional",  text: "Arquitectura MVC, autenticación segura, manejo de errores robusto y buenas prácticas de la industria." },
                        { title: "Escalabilidad",         text: "Diseñado para crecer: pasarelas de pago, notificaciones en tiempo real, análisis de datos y más." },
                        { title: "Innovación Local",      text: "Desde Zacatecas se puede desarrollar tecnología competitiva a nivel nacional e internacional." },
                    ].map((item, i) => (
                        <Fade key={item.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                            <div className="about-card" style={{ background: "#fafaf8", border: "1px solid #e5e0d8", borderRadius: 10, padding: "20px 24px" }}>
                                <h3 style={BC("17px", { color: "#0f1f35", margin: "0 0 8px" })}>{item.title}</h3>
                                <p style={DM("13px", 400, { color: "#4a5568", lineHeight: 1.7, margin: 0 })}>{item.text}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            {/* VISIÓN */}
            <section style={{ background: "#0f1f35", padding: sectionPad, textAlign: "center" }}>
                <Fade>
                    <p style={DM("11px", 600, { color: "#7eb3e8", textTransform: "uppercase", letterSpacing: "3px", marginBottom: 16 })}>VISIÓN</p>
                    <h2 style={BC("clamp(28px, 4vw, 48px)", { color: "#fff", margin: "0 0 20px", fontStyle: "italic" })}>
                        "Si puedes imaginarlo, puedes programarlo"
                    </h2>
                    <p style={DM("14px", 400, { color: "#7eb3e8", lineHeight: 1.8, maxWidth: 680, margin: "0 auto" })}>
                        GDLCG nació como proyecto académico pero fue construido con estándares de producción. Cada línea de código refleja dedicación y la convicción de que desde Zacatecas se puede crear tecnología de clase mundial.
                    </p>
                </Fade>
            </section>
        </div>
    );
}

export default AboutPage;
