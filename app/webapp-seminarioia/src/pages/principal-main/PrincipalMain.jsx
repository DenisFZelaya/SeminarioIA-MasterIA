import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UserProfileDropdown from "../../components/UserProfileDropdown";
import Recomendations from "../recomendations/recomendations";
import MyFavorites from "../my-favorites/MyFavorites";
import Team from "../team/Team";
import Implementations from "../Implementations/Implementations";
import DesktopNav from "../../components/DesktopNav";
import MovileNav from "../../components/MovileNav";

export default function PrincipalMain() {
  const { user, logout } = useAuth0();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-300" style={{ width: "100vw", overflowX: "hidden" }}>
      {/* Header con perfil de usuario */}
      <header className="relative bg-gray-800 border-b border-cyan-500/30">
        {/* Efectos de fondo cyberpunk */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                UNIR IA LABS
              </h1>
            </div>

            {/* Navegación de escritorio */}
            <DesktopNav setActiveSection={setActiveSection} activeSection={activeSection} />

            {/* Botón de menú móvil */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-cyan-300 hover:text-cyan-100 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Abrir menú principal</span>
                {mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            <UserProfileDropdown />
          </div>
        </div>

        {/* Menú móvil */}
        <MovileNav mobileMenuOpen={mobileMenuOpen} setActiveSection={setActiveSection} user={user} />
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de bienvenida */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-cyan-500/30">
            <div className="relative px-6 py-8 md:p-10">
              {/* Efectos de fondo */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                  Bienvenido, {user.given_name}
                </h2>
                <p className="text-cyan-300/80 max-w-3xl">
                  Recomendaciones. {activeSection}
                </p>

              </div>
            </div>


          </div>
        </section>

        {activeSection === 0 && <Recomendations />}
        {activeSection === 1 && <MyFavorites />}
        {activeSection === 2 && <Team />}
        {activeSection === 3 && <Implementations />}

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-cyan-500/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-cyan-300/50">
            © 2025 UNIR IA LAB. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}