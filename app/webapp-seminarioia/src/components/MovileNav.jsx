import React from 'react'

export default function MovileNav({
    mobileMenuOpen,
    setActiveSection,
    user
}) {
    return (
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 border-t border-cyan-500/20">
                <a href="#recomendations"
                    onClick={() => setActiveSection(0)}
                    className="text-cyan-100 block px-3 py-2 rounded-md text-base font-medium border-l-2 border-cyan-500">
                    Recomendaciones
                </a>
                <a href="#my-favorites"
                    onClick={() => setActiveSection(1)}
                    className="text-cyan-300/70 hover:text-cyan-100 block px-3 py-2 rounded-md text-base font-medium border-l-2 border-transparent hover:border-cyan-500/50">
                    Mis Favoritas
                </a>
                <a href="#team"
                    onClick={() => setActiveSection(2)}
                    className="text-cyan-300/70 hover:text-cyan-100 block px-3 py-2 rounded-md text-base font-medium border-l-2 border-transparent hover:border-cyan-500/50">
                    Equipo
                </a>
                <a href="#developers"
                    onClick={() => setActiveSection(3)}
                    className="text-cyan-300/70 hover:text-cyan-100 block px-3 py-2 rounded-md text-base font-medium border-l-2 border-transparent hover:border-cyan-500/50">
                    Implementación
                </a>
            </div>

            {/* Perfil móvil */}
            <div className="pt-4 pb-3 border-t border-cyan-500/20">
                <div className="flex items-center px-5">
                    <div className="flex-shrink-0 relative">
                        <img
                            className="h-10 w-10 rounded-full border-2 border-cyan-500/50 p-0.5"
                            src={user.picture}
                            alt={user.name}
                        />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-gray-800"></span>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium text-cyan-100">{user.name}</div>
                        <div className="text-sm text-cyan-300/70">{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
