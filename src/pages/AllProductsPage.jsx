import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addFavoriteRequest, removeFavoriteRequest, getFavoritesRequest } from "../api/auth";
import { ShoppingCart, Heart, X, PanelLeftClose, PanelLeftOpen, ChevronUp, ChevronDown, AlertTriangle, Check, PackageSearch, SlidersHorizontal } from "lucide-react";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const CATEGORIAS = [
  { value: "tops", label: "Tops" }, { value: "leggings", label: "Leggings" },
  { value: "shorts", label: "Shorts" }, { value: "calzado", label: "Calzado" },
  { value: "sudaderas", label: "Sudaderas" }, { value: "pants", label: "Pants" },
  { value: "accesorios", label: "Accesorios" }
];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];
const RANGOS = [
  { value: "0-500", label: "$0 - $500" }, { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" }, { value: "2000-5000", label: "$2,000 - $5,000" },
  { value: "5000+", label: "$5,000+" }
];

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid #e5e0d8", paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px" }}>
        <span style={DM(10, 600, { color: "#0f1f35", textTransform: "uppercase", letterSpacing: "1.5px" })}>{title}</span>
        {open ? <ChevronUp size={14} color="#8a9bb0" /> : <ChevronDown size={14} color="#8a9bb0" />}
      </button>
      {open && children}
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart, incProduct, cart } = useProducts();
  const { isAuthenticated, isAdmin } = useAuth();
  const { deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      getFavoritesRequest().then(r => setIsFav(r.data.some(f => f._id === product._id))).catch(() => {});
    }
  }, [isAuthenticated, isAdmin]);

  const toggleFav = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      if (isFav) { await removeFavoriteRequest(product._id); setIsFav(false); toast.success("Quitado de favoritos"); }
      else { await addFavoriteRequest(product._id); setIsFav(true); toast.success("Agregado a favoritos"); }
    } catch { toast.error("Error al actualizar favoritos"); }
  };

  const handleAdd = () => {
    if (!isAuthenticated) { localStorage.setItem("pendingCartProduct", JSON.stringify(product)); navigate("/login"); return; }
    const existing = cart.find(i => i._id === product._id);
    if (!existing) { addToCart(product); }
    else if (existing.toSell < existing.quantity) { incProduct(product._id); }
    else { toast.warn("Stock máximo: " + existing.quantity); return; }
    toast.success("Agregado al carrito");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.2s ease, box-shadow 0.2s ease", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? "0 8px 24px rgba(15,31,53,0.12)" : "0 1px 4px rgba(15,31,53,0.06)" }}>
      {/* Imagen */}
      <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        {/* Badge categoría */}
        <span style={{ position: "absolute", top: 10, left: 10, background: "#fff", color: "#1d4b8a", padding: "3px 8px", borderRadius: 4, ...DM(9, 600, { textTransform: "uppercase", letterSpacing: "1px" }) }}>{product.categoria}</span>
        {/* Wishlist */}
        {isAuthenticated && !isAdmin && (
          <button onClick={toggleFav} style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "1px solid #e5e0d8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Heart size={14} fill={isFav ? "#1d4b8a" : "none"} color={isFav ? "#1d4b8a" : "#8a9bb0"} />
          </button>
        )}
        {/* Badge últimas unidades */}
        {product.quantity < 10 && (
          <span style={{ position: "absolute", bottom: 10, left: 10, background: "#fef9c3", color: "#854d0e", padding: "3px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 4, ...DM(9, 600, { textTransform: "uppercase", letterSpacing: "1px" }) }}>
            <AlertTriangle size={10} /> ÚLTIMAS UNIDADES
          </span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={BC("15px", { color: "#0f1f35", margin: 0 })}>{product.name}</p>
        <p style={BC("18px", { color: "#0f1f35", margin: 0 })}>${product.price?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
        <p style={DM(11, 400, { color: "#8a9bb0", margin: 0 })}>Stock: {product.quantity}</p>
        {product.tallas?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {product.tallas.slice(0, 4).map(t => (
              <span key={t} style={{ border: "1px solid #e5e0d8", borderRadius: 3, padding: "2px 6px", ...DM(10, 400, { color: "#4a5568" }) }}>{t}</span>
            ))}
          </div>
        )}
      </div>
      {/* Botones admin o usuario */}
      {isAdmin ? (
        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px" }}>
          <button onClick={() => deleteProduct(product._id)} style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.25)", borderRadius: 4, padding: "8px", cursor: "pointer", ...DM(11, 600, { color: "#e53e3e", textTransform: "uppercase", letterSpacing: "1px" }) }}>Eliminar</button>
          <Link to={`/products/${product._id}`} style={{ flex: 2, background: "#f0f5fb", border: "0.5px solid #B5D4F4", borderRadius: 4, padding: "8px", textDecoration: "none", textAlign: "center", ...DM(11, 600, { color: "#0f1f35", textTransform: "uppercase", letterSpacing: "1px" }) }}>Editar</Link>
        </div>
      ) : (
        <button onClick={handleAdd} style={{ margin: "0 16px 14px", background: added ? "#15803d" : "#0f1f35", color: "#fff", border: "none", borderRadius: 4, padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "background 0.2s", ...DM(12, 600, { letterSpacing: "1.5px", textTransform: "uppercase" }) }}
          onMouseEnter={e => { if (!added) e.currentTarget.style.background = "#1d4b8a"; }}
          onMouseLeave={e => { if (!added) e.currentTarget.style.background = "#0f1f35"; }}>
          {added ? <><Check size={14} /> AGREGADO</> : <><ShoppingCart size={14} /> AGREGAR</>}
        </button>
      )}
    </div>
  );
}

function AllProductsPage() {
  const { products, getAllProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTallas, setSelectedTallas] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => { getAllProducts(); }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat && CATEGORIAS.some(c => c.value === cat)) setSelectedCategories([cat]);
  }, [searchParams]);

  useEffect(() => {
    if (products.length > 0) {
      const s = new Set();
      products.forEach(p => p.colores?.forEach(c => { if (c?.trim()) s.add(c.trim().toLowerCase()); }));
      setAvailableColors(Array.from(s).sort());
    }
  }, [products]);

  const filtered = products.filter(p => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoria)) return false;
    if (selectedTallas.length > 0 && !p.tallas?.some(t => selectedTallas.includes(t))) return false;
    if (selectedColors.length > 0 && !p.colores?.some(c => selectedColors.includes(c.trim().toLowerCase()))) return false;
    if (selectedPriceRange) {
      const pr = p.price;
      if (selectedPriceRange === "0-500" && pr > 500) return false;
      if (selectedPriceRange === "500-1000" && (pr < 500 || pr > 1000)) return false;
      if (selectedPriceRange === "1000-2000" && (pr < 1000 || pr > 2000)) return false;
      if (selectedPriceRange === "2000-5000" && (pr < 2000 || pr > 5000)) return false;
      if (selectedPriceRange === "5000+" && pr < 5000) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const toggleCat = c => setSelectedCategories(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleTalla = t => setSelectedTallas(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleColor = c => setSelectedColors(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const clearAll = () => { setSelectedCategories([]); setSelectedTallas([]); setSelectedColors([]); setSelectedPriceRange(""); setSortBy("newest"); setSearchParams({}); };
  const activeCount = selectedCategories.length + selectedTallas.length + selectedColors.length + (selectedPriceRange ? 1 : 0);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e0d8", padding: "32px 64px" }}>
        <p style={DM(11, 400, { color: "#8a9bb0", marginBottom: 8 })}>
          <Link to="/" style={{ color: "#8a9bb0", textDecoration: "none" }}>Inicio</Link> / Productos
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={BC("48px", { color: "#0f1f35", margin: "0 0 4px" })}>GDLCG</h1>
            <p style={DM(13, 400, { color: "#8a9bb0", margin: 0 })}>{filtered.length} productos</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: "1px solid #e5e0d8", borderRadius: 4, padding: "8px 12px", background: "#fff", ...DM(12, 400, { color: "#0f1f35" }), outline: "none" }}>
              <option value="newest">Recomendados</option>
              <option value="price-high">Precio mayor</option>
              <option value="price-low">Precio menor</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </div>
        {/* Chips */}
        {activeCount > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, alignItems: "center" }}>
            {selectedCategories.map(c => (
              <span key={c} style={{ background: "#eef2f8", color: "#0f1f35", border: "1px solid #e5e0d8", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, ...DM(11, 500, { textTransform: "uppercase" }) }}>
                {c} <button onClick={() => toggleCat(c)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}><X size={10} color="#4a5568" /></button>
              </span>
            ))}
            {selectedTallas.map(t => (
              <span key={t} style={{ background: "#eef2f8", color: "#0f1f35", border: "1px solid #e5e0d8", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, ...DM(11, 500) }}>
                TALLA: {t} <button onClick={() => toggleTalla(t)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}><X size={10} color="#4a5568" /></button>
              </span>
            ))}
            {selectedPriceRange && (
              <span style={{ background: "#eef2f8", color: "#0f1f35", border: "1px solid #e5e0d8", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6, ...DM(11, 500) }}>
                {RANGOS.find(r => r.value === selectedPriceRange)?.label}
                <button onClick={() => setSelectedPriceRange("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}><X size={10} color="#4a5568" /></button>
              </span>
            )}
            <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", ...DM(11, 600, { color: "#e53e3e", textDecoration: "underline" }) }}>Limpiar todo</button>
          </div>
        )}
      </div>

      {/* Overlay móvil */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,31,53,0.4)", zIndex: 99 }} />
      )}

      <div style={{ display: "flex", gap: isMobile ? 0 : "32px", maxWidth: "1400px", margin: "0 auto", padding: isMobile ? "0 16px" : "0 64px" }}>

        {/* Aside */}
        <aside style={
          isMobile
            ? sidebarOpen
              ? { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, width: "280px", background: "#fff", borderRight: "1px solid #e5e0d8", overflowY: "auto", padding: "80px 24px 24px", boxShadow: "4px 0 24px rgba(15,31,53,0.15)" }
              : { display: "none" }
            : { position: "relative", width: sidebarOpen ? "220px" : "0", minWidth: sidebarOpen ? "220px" : "0", overflow: "visible", transition: "all 0.3s", paddingTop: "40px" }
        }>
          {/* Botón toggle — solo desktop, pegado al borde derecho del aside */}
          {!isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ position: "absolute", right: "-16px", top: "48px", zIndex: 10, background: "#fff", border: "1px solid #e5e0d8", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
          )}

          {/* Contenido sidebar */}
          <div style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? "auto" : "none", transition: "opacity 0.2s", paddingRight: isMobile ? 0 : "32px" }}>
            <FilterSection title="Categoría">
              {CATEGORIAS.map(cat => (
                <label key={cat.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={selectedCategories.includes(cat.value)} onChange={() => toggleCat(cat.value)} style={{ accentColor: "#0f1f35", width: 14, height: 14 }} />
                  <span style={DM(12, 400, { color: "#4a5568", textTransform: "capitalize" })}>{cat.label}</span>
                </label>
              ))}
            </FilterSection>
            <FilterSection title="Precio">
              {RANGOS.map(r => (
                <label key={r.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                  <input type="radio" name="precio" checked={selectedPriceRange === r.value} onChange={() => setSelectedPriceRange(r.value)} style={{ accentColor: "#0f1f35", width: 14, height: 14 }} />
                  <span style={DM(12, 400, { color: "#4a5568" })}>{r.label}</span>
                </label>
              ))}
            </FilterSection>
            <FilterSection title="Talla">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TALLAS.map(t => (
                  <button key={t} onClick={() => toggleTalla(t)} style={{ width: 36, height: 36, border: "1px solid #e5e0d8", borderRadius: 4, background: selectedTallas.includes(t) ? "#0f1f35" : "#fff", color: selectedTallas.includes(t) ? "#fff" : "#4a5568", cursor: "pointer", ...DM(11, 600) }}>{t}</button>
                ))}
              </div>
            </FilterSection>
            {availableColors.length > 0 && (
              <FilterSection title="Color">
                {availableColors.map(c => (
                  <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={selectedColors.includes(c)} onChange={() => toggleColor(c)} style={{ accentColor: "#0f1f35", width: 14, height: 14 }} />
                    <span style={DM(12, 400, { color: "#4a5568", textTransform: "capitalize" })}>{c}</span>
                  </label>
                ))}
              </FilterSection>
            )}
            {activeCount > 0 && (
              <button onClick={clearAll} style={{ width: "100%", background: "none", border: "1px solid #e5e0d8", borderRadius: 4, padding: "8px", cursor: "pointer", ...DM(11, 600, { color: "#0f1f35", textTransform: "uppercase", letterSpacing: "1px" }) }}>
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <main style={{ flex: 1, minWidth: 0, paddingTop: "40px", paddingBottom: "80px" }}>
          {/* Botón filtros móvil */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0f1f35", color: "#fff", border: "none", padding: "8px 16px", cursor: "pointer", marginBottom: 20, borderRadius: 4, ...DM(12, 600, { letterSpacing: "1px", textTransform: "uppercase" }) }}>
              <SlidersHorizontal size={14} /> FILTROS {activeCount > 0 && `(${activeCount})`}
            </button>
          )}
          {sorted.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16 }}>
              <PackageSearch size={48} color="#e5e0d8" />
              <p style={BC("24px", { color: "#0f1f35", margin: 0 })}>NO SE ENCONTRARON PRODUCTOS</p>
              <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", ...DM(13, 600, { color: "#1d4b8a", textDecoration: "underline" }) }}>Limpiar filtros</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(240px, 1fr))", gap: isMobile ? 12 : 20 }}>
              {sorted.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllProductsPage;
