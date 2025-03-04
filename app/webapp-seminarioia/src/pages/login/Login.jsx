import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    return (
        <div className="flex w-full flex-col lg:flex-row min-h-screen bg-gray-900" style={{ width: "100vw" }}>
            {/* Columna de Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <div className="relative w-full max-w-md p-6 lg:p-8 overflow-hidden rounded-lg shadow-2xl bg-gray-800 border border-cyan-500/30">
                    {/* Efectos de fondo cyberpunk */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-1">
                                Seminario en Inteligencia Artificial
                            </h2>
                            <p className="text-cyan-300/70 text-xs lg:text-sm tracking-widest uppercase">
                                Creación de sistema de recomendación de películas con base al perfil del usuario
                            </p>
                        </div>

                        <div className="mb-8">
                            <p className="text-cyan-300/80 text-center">
                                Estudiantes.
                            </p>
                        </div>

                        <div>
                            <button
                                type="button"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                onClick={() => loginWithRedirect()}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : (
                                    'INICIAR SESIÓN'
                                )}
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-700/50">
                            <p className="text-xs text-center text-cyan-300/50">
                                © 2025 UNIR IA LAB. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna de Imagen/Diseño - Solo visible en pantallas grandes */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
                {/* Fondo con efecto de cuadrícula cyberpunk */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXY0aC0xdi00em0yIDBIMzZ2NGgtMXYtNHptLTQgMGgxdjFoLTF2LTF6bTAgMmgxdjJoLTF2LTJ6bS0yLTJoM3Y0aC0zdi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

                {/* Elementos decorativos cyberpunk */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-4/5 h-4/5">
                        {/* Círculos de neón */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-4 border-cyan-500/30 animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border-2 border-purple-500/40 animate-pulse" style={{ animationDelay: '1s' }}></div>

                        {/* Líneas de neón */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0"></div>

                        {/* Logo central */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 mb-8 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 animate-pulse"></div>
                                <div className="absolute inset-2 rounded-full border border-cyan-400/50"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">IA</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                                INTELIGENCIA ARTIFICIAL
                            </h2>
                            <h2 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                                EQUIPO D1
                            </h2>

                            <p className="text-cyan-300/70 max-w-md">
                                Desarrollamos un sistema de recomendación de películas con IA, que personaliza sugerencias según el perfil del usuario mediante filtrado colaborativo, basado en contenido.
                            </p>

                            {/* Elementos decorativos adicionales */}
                            <div className="mt-8 grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-16 h-16 border border-cyan-500/30 rounded-md flex items-center justify-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Efectos de luz */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-400/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
}