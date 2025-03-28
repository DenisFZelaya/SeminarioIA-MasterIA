import React from "react";
import { students } from "../../config/Constants";

export default function Team() {
  return (
    <div className="flex w-full items-center justify-center p-4 lg:p-8">
      <div className="relative w-full max-w-md p-6 lg:p-8 overflow-hidden rounded-lg shadow-2xl bg-gray-800 border border-cyan-500/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-1">
              Equipo del Seminario
            </h2>
            <p className="text-cyan-300/70 text-xs lg:text-sm tracking-widest uppercase">
              Inteligencia Artificial - Sistema de Recomendación
            </p>
          </div>
          <div className="mb-8">
            <p className="text-cyan-300/80 text-center">Estudiantes:</p>
            <ul className="mt-4 text-center text-cyan-200">
              {students.map((student, index) => (
                <li key={index} className="py-1">
                  {student}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
