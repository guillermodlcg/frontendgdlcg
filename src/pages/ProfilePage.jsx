import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IoPersonCircle, IoMail, IoPerson, IoShield, IoCalendar, IoSave, IoLogOut, IoLockClosed, IoTrash, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { updateProfileRequest, getUserStatsRequest, changePasswordRequest, deleteAccountRequest } from "../api/auth";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

function ProfilePage() {
  const { user, isAdmin, logOut, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmPasswordChange, setShowConfirmPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    favoriteProducts: 0
  });
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getUserStatsRequest();
      setStats(response.data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const handleSave = async () => {
    try {
      const response = await updateProfileRequest(formData);
      setUser(response.data);
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error(error.response?.data?.message?.[0] || "Error al actualizar el perfil");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Mostrar modal de confirmación
    setShowConfirmPasswordChange(true);
  };

  const confirmPasswordChange = async () => {
    try {
      await changePasswordRequest({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setShowConfirmPasswordChange(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(error.response?.data?.message?.[0] || "Error al cambiar la contraseña");
      setShowConfirmPasswordChange(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Debes ingresar tu contraseña");
      return;
    }

    try {
      await deleteAccountRequest(deletePassword);
      toast.success("Cuenta eliminada correctamente");
      logOut();
      navigate("/login");
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      toast.error(error.response?.data?.message?.[0] || "Error al eliminar la cuenta");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header del perfil */}
        <div className="card-gradient rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <IoPersonCircle className="text-9xl text-blue-500" />
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-slate-800 ${
                isAdmin ? 'bg-purple-500' : 'bg-green-500'
              }`}></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {user?.username || "Usuario"}
              </h1>
              <p className="text-gray-400 mb-4">{user?.email || "email@example.com"}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {isAdmin && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    <IoShield />
                    Administrador
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                  <IoPersonCircle />
                  Usuario Activo
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 font-semibold text-white"
            >
              <IoLogOut />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Información del perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información personal */}
          <div className="glass-effect rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Información Personal</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <IoSave />
                  Guardar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <IoPerson />
                  Nombre de Usuario
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-white font-medium bg-slate-800/30 rounded-lg px-4 py-3">
                    {user?.username || "No disponible"}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <IoMail />
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-white font-medium bg-slate-800/30 rounded-lg px-4 py-3">
                    {user?.email || "No disponible"}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <IoCalendar />
                  Fecha de Registro
                </label>
                <p className="text-white font-medium bg-slate-800/30 rounded-lg px-4 py-3">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="glass-effect rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Estadísticas</h2>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total de Pedidos</p>
                <p className="text-3xl font-bold gradient-text">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Productos Favoritos</p>
                <p className="text-3xl font-bold gradient-text">{stats.favoriteProducts}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Compras Completadas</p>
                <p className="text-3xl font-bold gradient-text">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="glass-effect rounded-xl p-6 mt-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Configuración de Cuenta</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-gray-300 hover:text-white flex items-center gap-3"
            >
              <IoLockClosed size={20} />
              Cambiar Contraseña
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 flex items-center gap-3"
            >
              <IoTrash size={20} />
              Eliminar Cuenta
            </button>
          </div>
        </div>

        {/* Modal para cambiar contraseña */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Cambiar Contraseña</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Contraseña Actual</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showCurrentPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para cambiar contraseña */}
        <ConfirmModal
          isOpen={showConfirmPasswordChange}
          onClose={() => setShowConfirmPasswordChange(false)}
          onConfirm={confirmPasswordChange}
          title="Confirmar Cambio de Contraseña"
          text="¿Estás seguro que deseas cambiar tu contraseña? Deberás usar la nueva contraseña en tu próximo inicio de sesión."
          btnAccept="Sí, cambiar"
          btnCancel="Cancelar"
        />

        {/* Modal para eliminar cuenta */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Eliminar Cuenta</h3>
              <p className="text-gray-300 mb-4">
                Esta acción es <span className="text-red-400 font-bold">irreversible</span>. 
                Se eliminarán todos tus datos, pedidos y favoritos.
              </p>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Confirma tu contraseña</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
