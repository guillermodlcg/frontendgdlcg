import React, { useEffect, useState } from "react";
import { getAllUsersRequest, deleteUserRequest } from "../api/auth";
import { toast } from "react-toastify";
import { Users, UserCheck, ShieldCheck, Search, Trash2, ChevronDown, ChevronUp, UserX } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const ROW = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0ede8" };
const LABEL = DM("11px", 600, { color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.5px" });

function UserCard({ user, onDelete, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = user.role === "admin";

  const formatDate = (d) => {
    if (!d) return "No disponible";
    return new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ padding: isMobile ? "14px 16px" : "18px 24px", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          {/* Avatar */}
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: isAdmin ? "#eef2f8" : "#f5f4f1", border: `1px solid ${isAdmin ? "#ccd9ea" : "#e5e0d8"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={BC("18px", { color: isAdmin ? "#1d4b8a" : "#4a5568" })}>
              {user.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={BC("16px", { color: "#0f1f35", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{user.username}</p>
            <p style={DM("12px", 400, { color: "#8a9bb0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ background: isAdmin ? "#eef2f8" : "#f5f4f1", color: isAdmin ? "#1d4b8a" : "#4a5568", border: `1px solid ${isAdmin ? "#ccd9ea" : "#e5e0d8"}`, borderRadius: 20, padding: "3px 10px", ...DM("11px", 600, { textTransform: "uppercase", letterSpacing: "0.5px" }) }}>
            {isAdmin ? "Admin" : "Usuario"}
          </span>
          <button onClick={() => setModalOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: isMobile ? "5px 8px" : "6px 10px", background: "transparent", border: "1px solid #dc2626", color: "#dc2626", cursor: "pointer", borderRadius: 4, flexShrink: 0, ...DM("11px", 600) }}>
            <Trash2 size={13} /> {!isMobile && "Eliminar"}
          </button>
          <button onClick={() => setExpanded(!expanded)}
            style={{ width: 32, height: 32, background: "#f5f4f1", border: "1px solid #e5e0d8", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            {expanded ? <ChevronUp size={14} color="#4a5568" /> : <ChevronDown size={14} color="#4a5568" />}
          </button>
        </div>
      </div>

      {/* Detalle expandible */}
      {expanded && (
        <div style={{ padding: "0 24px 16px", borderTop: "1px solid #f0ede8" }}>
          <div style={{ paddingTop: 12 }}>
            <div style={ROW}>
              <span style={LABEL}>ID de usuario</span>
              <span style={DM("12px", 500, { color: "#0f1f35", fontFamily: "monospace", background: "#f5f4f1", padding: "2px 8px", borderRadius: 4, maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>
                {String(user.id)}
              </span>
            </div>
            <div style={ROW}>
              <span style={LABEL}>Rol</span>
              <span style={{ background: isAdmin ? "#eef2f8" : "#f5f4f1", color: isAdmin ? "#1d4b8a" : "#4a5568", borderRadius: 20, padding: "3px 10px", ...DM("11px", 600, { textTransform: "uppercase" }) }}>
                {isAdmin ? "Admin" : "Usuario"}
              </span>
            </div>
            <div style={{ ...ROW, borderBottom: "none" }}>
              <span style={LABEL}>Fecha de registro</span>
              <span style={DM("12px", 400, { color: "#4a5568" })}>{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => { setModalOpen(false); onDelete(user.id); }}
        title="Eliminar usuario"
        text={`¿Estás seguro que deseas eliminar a "${user.username}"? Esta acción no se puede deshacer.`}
        btnAccept="Eliminar"
        btnCancel="Cancelar"
      />
    </div>
  );
}

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersRequest();
      setUsers(res.data);
    } catch (e) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserRequest(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("Usuario eliminado");
    } catch (e) {
      toast.error(e.response?.data?.message?.[0] || "Error al eliminar");
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "todos" ||
                      (roleFilter === "admin" && u.role === "admin") ||
                      (roleFilter === "usuario" && u.role !== "admin");
    return matchSearch && matchRole;
  });

  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalActivos = users.length;

  const STATS = [
    { icon: <Users size={20} color="#7eb3e8" />, label: "TOTAL DE USUARIOS", value: users.length },
    { icon: <UserCheck size={20} color="#4ade80" />, label: "USUARIOS ACTIVOS", value: totalActivos },
    { icon: <ShieldCheck size={20} color="#c084fc" />, label: "ADMINS", value: totalAdmins },
  ];

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh" }}>

      {/* Header oscuro */}
      <div style={{ background: "#0f1f35", padding: isMobile ? "32px 16px 28px" : "60px 64px 48px" }}>
        <p style={DM(11, 600, { color: "#7eb3e8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 })}>
          ADMINISTRACIÓN
        </p>
        <h1 style={BC("40px", { color: "#fff", margin: "0 0 8px" })}>GESTIÓN DE USUARIOS</h1>
        <p style={DM(14, 400, { color: "rgba(255,255,255,0.5)", margin: "0 0 40px" })}>
          Administra y revisa todos los usuarios del sistema
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: isMobile ? "14px 16px" : "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {s.icon}
                <span style={DM(10, 600, { color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" })}>{s.label}</span>
              </div>
              <p style={BC("32px", { color: "#fff", margin: 0 })}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Búsqueda y filtro */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e0d8", padding: isMobile ? "16px" : "20px 64px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} color="#8a9bb0" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: "#fafaf8", border: "1px solid #e5e0d8", borderRadius: 6, outline: "none", boxSizing: "border-box", ...DM("13px", 400, { color: "#0f1f35" }) }}
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: "10px 14px", background: "#fafaf8", border: "1px solid #e5e0d8", borderRadius: 6, outline: "none", ...DM("13px", 400, { color: "#0f1f35" }), minWidth: isMobile ? "100%" : 160 }}>
            <option value="todos">Todos los roles</option>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div style={{ padding: isMobile ? "24px 16px" : "40px 64px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <p style={DM(14, 400, { color: "#8a9bb0" })}>Cargando usuarios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 20px", gap: 16 }}>
            <UserX size={48} color="#e5e0d8" />
            <p style={BC("24px", { color: "#0f1f35", margin: 0 })}>NO SE ENCONTRARON USUARIOS</p>
            <p style={DM(13, 400, { color: "#8a9bb0" })}>Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))", gap: 20, alignItems: "start" }}>
            {filtered.map(user => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} isMobile={isMobile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
