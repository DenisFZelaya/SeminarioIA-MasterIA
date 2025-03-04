// UserProfileDropdown.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth0();
  
  // Función para alternar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };
  
  return (
    <div className="profile-dropdown-container relative">
      <div className="flex items-center space-x-4 cursor-pointer" onClick={toggleDropdown}>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-cyan-100">{user.name}</span>
          <span className="text-xs text-cyan-300/70">{user.email}</span>
        </div>
        <div className="relative">
          <img 
            className="h-10 w-10 rounded-full border-2 border-cyan-500/50 p-0.5 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20" 
            src={user.picture} 
            alt={user.name} 
          />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-gray-800"></span>
        </div>
      </div>
      
      {/* Dropdown modal */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 animate-fadeIn">
          <div className="relative rounded-md bg-gray-800 border border-cyan-500/30 overflow-hidden">
            {/* Efectos de fondo cyberpunk */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
            <div className="absolute -top-24 -right-24 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 py-1">
              <div className="px-4 py-3 border-b border-gray-700/50">
                <p className="text-sm text-cyan-100 font-medium truncate">{user.name}</p>
                <p className="text-xs text-cyan-300/70 truncate">{user.email}</p>
              </div>
              
              <div className="py-1">
                <a 
                  href="#profile" 
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-gray-700/50 hover:text-cyan-100 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <i className="fas fa-user-circle mr-2"></i>
                    <span>Mi Perfil</span>
                  </div>
                </a>
                <a 
                  href="#settings" 
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-gray-700/50 hover:text-cyan-100 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <i className="fas fa-cog mr-2"></i>
                    <span>Configuración</span>
                  </div>
                </a>
              </div>
              
              <div className="py-1 border-t border-gray-700/50">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 hover:text-red-300 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    <span>Cerrar Sesión</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;