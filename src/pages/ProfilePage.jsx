import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoPersonCircle, IoMail, IoPerson, IoShield, IoCalendar, IoSave, IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, isAdmin, logOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  const handleSave = () => {
    // Aquí irá la lógica para guardar cambios
    setIsEditing(false);
    // TODO: Implementar API para actualizar perfil
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
                <p className="text-3xl font-bold gradient-text">0</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Productos Favoritos</p>
                <p className="text-3xl font-bold gradient-text">0</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Compras Completadas</p>
                <p className="text-3xl font-bold gradient-text">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones adicionales */}
        <div className="glass-effect rounded-xl p-6 mt-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Configuración de Cuenta</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-gray-300 hover:text-white">
              Cambiar Contraseña
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-gray-300 hover:text-white">
              Notificaciones
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors text-gray-300 hover:text-white">
              Privacidad y Seguridad
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300">
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
