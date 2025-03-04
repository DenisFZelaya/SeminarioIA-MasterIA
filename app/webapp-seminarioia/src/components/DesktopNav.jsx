import React from 'react'

export default function DesktopNav({
    setActiveSection,
    activeSection
}) {
    // Función para generar clases de manera consistente
    const getNavItemClasses = (index) => {
        const baseClasses = "px-3 py-2 text-sm font-medium border-b-2";
        
        if (activeSection === index) {
            return `${baseClasses} text-cyan-300 border-cyan-500`;
        }
        
        return `${baseClasses} text-cyan-300/70 hover:text-cyan-100 border-transparent hover:border-cyan-500/50`;
    };
    
    return (
        <nav className="hidden md:flex space-x-8">
            <a 
                href="#recomendations"
                onClick={(e) => {
                    e.preventDefault(); // Prevenir comportamiento por defecto
                    setActiveSection(0);
                }}
                className={getNavItemClasses(0)}
            >
                Recomendaciones
            </a>
            <a 
                href="#my-favorites"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(1);
                }}
                className={getNavItemClasses(1)}
            >
                Mis Favoritas
            </a>
            <a 
                href="#team"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(2);
                }}
                className={getNavItemClasses(2)}
            >
                Equipo
            </a>
            <a 
                href="#developers"
                onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(3);
                }}
                className={getNavItemClasses(3)}
            >
                Implementación
            </a>
        </nav>
    )
}