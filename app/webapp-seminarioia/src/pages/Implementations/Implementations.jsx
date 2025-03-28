import React from "react";

export default function Implementations() {
  return (
    <div className="flex w-full flex-col items-center bg-gray-900 p-6">
      <div className="w-full max-w-lg p-6 lg:p-8 rounded-lg shadow-2xl bg-gray-800 border border-cyan-500/30 text-center">
        {/* Título */}
        <h2 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
          Implementación del Proyecto
        </h2>

        {/* Descripción */}
        <p className="text-cyan-300/80 mb-6">
          Aquí puedes acceder al repositorio de GitHub con la implementación del
          sistema de recomendación basado en IA.
        </p>

        {/* Botón para GitHub */}
        <a
          href="https://github.com/DenisFZelaya/SeminarioIA-MasterIA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 text-lg font-medium text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400 rounded-md shadow-md transition-all duration-300"
        >
          Ver en GitHub
        </a>
      </div>
    </div>
  );
}
