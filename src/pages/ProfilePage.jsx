import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { IoPerson, IoMail, IoCalendar, IoSave, IoLockClosed, IoTrash, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import { updateProfileRequest, getUserStatsRequest, changePasswordRequest, deleteAccountRequest, getFavoritesRequest, removeFavoriteRequest } from "../api/auth";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const TAB_STYLE = (active) => ({
    ...DM(11, 500), letterSpacing: 1,
    textTransform: 'uppercase', padding: '12px 20px', cursor: 'pointer',
    background: 'none', border: 'none', borderBottom: active ? '2px solid #185FA5' : '2px solid transparent',
    color: active ? '#042C53' : '#888', transition: 'all 0.2s ease'
});

const INPUT_STYLE = { width: '100%', ...DM(13, 400), color: '#111', background: '#f5f7fb', border: '0.5px solid #B5D4F4', borderRadius: 6, padding: '10px 14px', outline: 'none' };
const LABEL_STYLE = { ...DM(10, 600), letterSpacing: 2, color: '#185FA5', textTransform: 'uppercase', display: 'block', marginBottom: 6 };
const CARD_STYLE = { background: '#fff', border: '0.5px solid #B5D4F4', borderRadius: 12, padding: 20 };

function ProfilePage() {
    const { user, isAdmin, logOut, setUser } = useAuth();
    const { addToCart, incProduct, cart } = useProducts();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('perfil');
    const [favorites, setFavorites] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showConfirmPasswordChange, setShowConfirmPasswordChange] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [deletePassword, setDeletePassword] = useState("");
    const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, favoriteProducts: 0 });
    const [formData, setFormData] = useState({ username: user?.username || "", email: user?.email || "" });

    useEffect(() => { loadStats(); }, []);

    useEffect(() => {
        if (activeTab === 'favoritos') loadFavorites();
    }, [activeTab]);

    const loadStats = async () => {
        try { const r = await getUserStatsRequest(); setStats(r.data); } catch (e) { console.error(e); }
    };

    const loadFavorites = async () => {
        setLoadingFavs(true);
        try { const r = await getFavoritesRequest(); setFavorites(r.data); } catch (e) { console.error(e); }
        finally { setLoadingFavs(false); }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await removeFavoriteRequest(productId);
            setFavorites(prev => prev.filter(p => p._id !== productId));
            toast.success("Quitado de favoritos");
        } catch (e) { toast.error("Error al quitar favorito"); }
    };

    const handleAddToCart = (product) => {
        const existing = cart.find(i => i._id === product._id);
        if (!existing) { addToCart(product); toast.success("Agregado al carrito"); }
        else if (existing.toSell < existing.quantity) { incProduct(product._id); toast.success("Agregado al carrito"); }
        else toast.warn("Stock máximo: " + existing.quantity);
    };

    const handleSave = async () => {
        try { const r = await updateProfileRequest(formData); setUser(r.data); setIsEditing(false); toast.success("Perfil actualizado"); }
        catch (e) { toast.error(e.response?.data?.message?.[0] || "Error al actualizar"); }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Las contraseñas no coinciden"); return; }
        if (passwordData.newPassword.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
        setShowConfirmPasswordChange(true);
    };

    const confirmPasswordChange = async () => {
        try {
            await changePasswordRequest({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
            toast.success("Contraseña actualizada");
            setShowPasswordModal(false); setShowConfirmPasswordChange(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (e) { toast.error(e.response?.data?.message?.[0] || "Error"); setShowConfirmPasswordChange(false); }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) { toast.error("Ingresa tu contraseña"); return; }
        try { await deleteAccountRequest(deletePassword); toast.success("Cuenta eliminada"); logOut(); navigate("/login"); }
        catch (e) { toast.error(e.response?.data?.message?.[0] || "Error"); }
    };

    const formatDate = (d) => {
        if (!d) return "No disponible";
        return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="w-full min-h-screen" style={{background: '#f5f7fb'}}>
            <div className="w-full px-4 md:px-8 py-8" style={{maxWidth: 960, margin: '0 auto'}}>

                {/* Header */}
                <div style={{...CARD_STYLE, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap'}}>
                    <div style={{width: 56, height: 56, borderRadius: '50%', background: '#E6F1FB', border: '0.5px solid #B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div style={{flex: 1}}>
                        <p style={{...BC('16px'), color: '#042C53'}}>{user?.username || "Usuario"}</p>
                        <p style={{...DM(12, 400), color: '#888'}}>{user?.email}</p>
                        {isAdmin && <span style={{...DM(10, 600), letterSpacing: 1, color: '#185FA5', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 4, padding: '3px 8px', marginTop: 4, display: 'inline-block'}}>ADMINISTRADOR</span>}
                    </div>
                    <button onClick={() => { logOut(); navigate('/login'); }} style={{...DM(10, 600), letterSpacing: 1, background: '#042C53', color: '#85B7EB', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#85B7EB" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        SALIR
                    </button>
                </div>

                {/* Pestañas */}
                <div style={{background: '#fff', border: '0.5px solid #B5D4F4', borderRadius: '8px 8px 0 0', display: 'flex', borderBottom: '0.5px solid #B5D4F4'}}>
                    <button style={TAB_STYLE(activeTab === 'perfil')} onClick={() => setActiveTab('perfil')}>MI PERFIL</button>
                    <button style={TAB_STYLE(activeTab === 'favoritos')} onClick={() => setActiveTab('favoritos')}>
                        FAVORITOS
                        {favorites.length > 0 && (
                            <span style={{marginLeft: 6, background: '#042C53', color: '#85B7EB', fontSize: 9, borderRadius: 10, padding: '2px 6px', fontFamily: "'DM Sans', sans-serif"}}>
                                {favorites.length}
                            </span>
                        )}
                    </button>
                    <button style={TAB_STYLE(activeTab === 'pedidos')} onClick={() => navigate('/orders')}>MIS PEDIDOS</button>
                </div>

                {/* Contenido pestañas */}
                <div style={{background: '#fff', border: '0.5px solid #B5D4F4', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 24}}>

                    {/* PESTAÑA MI PERFIL */}
                    {activeTab === 'perfil' && (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Info personal */}
                                <div style={CARD_STYLE}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                                        <span style={{...DM(12, 500), color: '#042C53'}}>Información Personal</span>
                                        {!isEditing
                                            ? <button onClick={() => setIsEditing(true)} style={{...DM(11, 500), color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer'}}>Editar</button>
                                            : <button onClick={handleSave} style={{...DM(11, 500), color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4}}>
                                                <IoSave size={14} /> Guardar
                                              </button>
                                        }
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                                        <div>
                                            <span style={LABEL_STYLE}>Nombre de usuario</span>
                                            {isEditing
                                                ? <input style={INPUT_STYLE} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                                                : <p style={{...DM(13, 400), color: '#111', background: '#f5f7fb', borderRadius: 6, padding: '10px 14px'}}>{user?.username}</p>
                                            }
                                        </div>
                                        <div>
                                            <span style={LABEL_STYLE}>Correo electrónico</span>
                                            {isEditing
                                                ? <input style={INPUT_STYLE} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                                : <p style={{...DM(13, 400), color: '#111', background: '#f5f7fb', borderRadius: 6, padding: '10px 14px'}}>{user?.email}</p>
                                            }
                                        </div>
                                        <div>
                                            <span style={LABEL_STYLE}>Fecha de registro</span>
                                            <p style={{...DM(13, 400), color: '#111', background: '#f5f7fb', borderRadius: 6, padding: '10px 14px'}}>{formatDate(user?.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Estadísticas */}
                                <div style={CARD_STYLE}>
                                    <span style={{...DM(12, 500), color: '#042C53', display: 'block', marginBottom: 16}}>Estadísticas</span>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                        {[
                                            {label: 'Total de Pedidos', value: stats.totalOrders},
                                            {label: 'Productos Favoritos', value: stats.favoriteProducts},
                                            {label: 'Compras Completadas', value: stats.completedOrders},
                                        ].map((s, i) => (
                                            <div key={i} style={{background: '#f5f7fb', border: '0.5px solid #B5D4F4', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <span style={{...DM(12, 400), color: '#555'}}>{s.label}</span>
                                                <span style={{...BC('18px'), color: '#042C53'}}>{s.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Configuración */}
                            <div style={CARD_STYLE}>
                                <span style={{...DM(12, 500), color: '#042C53', display: 'block', marginBottom: 14}}>Configuración de Cuenta</span>
                                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                    <button onClick={() => setShowPasswordModal(true)} style={{...DM(12, 400), color: '#555', background: '#f5f7fb', border: '0.5px solid #B5D4F4', borderRadius: 6, padding: '10px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8}}>
                                        <IoLockClosed size={14} color="#185FA5" /> Cambiar Contraseña
                                    </button>
                                    <button onClick={() => setShowDeleteModal(true)} style={{...DM(12, 400), color: '#A32D2D', background: 'rgba(163,45,45,0.05)', border: '0.5px solid #F7C1C1', borderRadius: 6, padding: '10px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8}}>
                                        <IoTrash size={14} color="#A32D2D" /> Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PESTAÑA FAVORITOS */}
                    {activeTab === 'favoritos' && (
                        <div>
                            {loadingFavs ? (
                                <div style={{textAlign: 'center', padding: 40}}>
                                    <p style={{...DM(12, 400), color: '#888'}}>Cargando favoritos...</p>
                                </div>
                            ) : favorites.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
                                    <div style={{width: 64, height: 64, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                    </div>
                                    <p style={{...DM(11, 400), color: '#888'}}>Explora productos y guárdalos aquí</p>
                                    <Link to="/getallproducts" style={{...DM(10, 600), letterSpacing: 1, background: '#042C53', color: '#85B7EB', borderRadius: 4, padding: '9px 18px', textDecoration: 'none', textTransform: 'uppercase'}}>
                                        VER TIENDA
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {favorites.map(product => (
                                        <div key={product._id} style={{background: '#fff', border: '0.5px solid #B5D4F4', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                                            <div style={{height: 180, overflow: 'hidden'}}>
                                                <img src={product.image} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            </div>
                                            <div style={{padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                                                <p style={{...DM(10, 600), letterSpacing: 3, color: '#185FA5', textTransform: 'uppercase'}}>{product.categoria}</p>
                                                <p style={{...DM(13, 500), color: '#111', lineHeight: 1.4}}>{product.name}</p>
                                                <p style={{...BC('14px'), color: '#042C53'}}>${product.price?.toLocaleString('es-MX')}</p>
                                            </div>
                                            <button onClick={() => handleAddToCart(product)} style={{background: '#042C53', color: '#fff', ...DM(11, 600), letterSpacing: 2, textTransform: 'uppercase', border: 'none', padding: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.2s'}}
                                                onMouseEnter={e => e.currentTarget.style.background='#185FA5'}
                                                onMouseLeave={e => e.currentTarget.style.background='#042C53'}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                                AGREGAR AL CARRITO
                                            </button>
                                            <button onClick={() => handleRemoveFavorite(product._id)} style={{background: 'transparent', color: '#A32D2D', ...DM(10, 600), letterSpacing: 1, textTransform: 'uppercase', border: 'none', borderTop: '0.5px solid #F7C1C1', padding: '9px', cursor: 'pointer'}}>
                                                QUITAR DE FAVORITOS
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal cambiar contraseña */}
            {showPasswordModal && (
                <div style={{position: 'fixed', inset: 0, background: 'rgba(4,44,83,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16}}>
                    <div style={{background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 420, border: '0.5px solid #B5D4F4'}}>
                        <p style={{...BC('16px'), color: '#042C53', marginBottom: 20}}>Cambiar Contraseña</p>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                            {[
                                {label: 'Contraseña Actual', key: 'currentPassword', show: showCurrentPassword, toggle: () => setShowCurrentPassword(!showCurrentPassword)},
                                {label: 'Nueva Contraseña', key: 'newPassword', show: showNewPassword, toggle: () => setShowNewPassword(!showNewPassword)},
                                {label: 'Confirmar Nueva Contraseña', key: 'confirmPassword', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword)},
                            ].map(f => (
                                <div key={f.key}>
                                    <span style={LABEL_STYLE}>{f.label}</span>
                                    <div style={{position: 'relative'}}>
                                        <input type={f.show ? 'text' : 'password'} value={passwordData[f.key]} onChange={e => setPasswordData({...passwordData, [f.key]: e.target.value})} style={{...INPUT_STYLE, paddingRight: 40}} />
                                        <button type="button" onClick={f.toggle} style={{position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888'}}>
                                            {f.show ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                            <button onClick={() => { setShowPasswordModal(false); setPasswordData({currentPassword:'',newPassword:'',confirmPassword:''}); }} style={{flex: 1, ...DM(11, 400), color: '#555', background: '#f5f7fb', border: '0.5px solid #B5D4F4', borderRadius: 6, padding: '10px', cursor: 'pointer'}}>Cancelar</button>
                            <button onClick={handleChangePassword} style={{flex: 1, ...DM(11, 600), color: '#fff', background: '#185FA5', border: 'none', borderRadius: 6, padding: '10px', cursor: 'pointer'}}>Actualizar</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={showConfirmPasswordChange} onClose={() => setShowConfirmPasswordChange(false)} onConfirm={confirmPasswordChange} title="Confirmar Cambio de Contraseña" text="¿Estás seguro que deseas cambiar tu contraseña?" btnAccept="Sí, cambiar" btnCancel="Cancelar" />

            {/* Modal eliminar cuenta */}
            {showDeleteModal && (
                <div style={{position: 'fixed', inset: 0, background: 'rgba(4,44,83,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16}}>
                    <div style={{background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 420, border: '0.5px solid #F7C1C1'}}>
                        <p style={{...BC('16px'), color: '#A32D2D', marginBottom: 12}}>Eliminar Cuenta</p>
                        <p style={{...DM(12, 400), color: '#555', marginBottom: 16}}>Esta acción es <strong style={{color: '#A32D2D'}}>irreversible</strong>. Se eliminarán todos tus datos, pedidos y favoritos.</p>
                        <span style={LABEL_STYLE}>Confirma tu contraseña</span>
                        <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} style={{...INPUT_STYLE, borderColor: '#F7C1C1', marginBottom: 16}} placeholder="Ingresa tu contraseña" />
                        <div style={{display: 'flex', gap: 10}}>
                            <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }} style={{flex: 1, ...DM(11, 400), color: '#555', background: '#f5f7fb', border: '0.5px solid #B5D4F4', borderRadius: 6, padding: '10px', cursor: 'pointer'}}>Cancelar</button>
                            <button onClick={handleDeleteAccount} style={{flex: 1, ...DM(11, 600), color: '#fff', background: '#A32D2D', border: 'none', borderRadius: 6, padding: '10px', cursor: 'pointer'}}>Eliminar Cuenta</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
