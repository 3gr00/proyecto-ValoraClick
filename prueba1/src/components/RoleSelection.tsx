// Interfaz que define las props del componente RoleSelection
interface RoleSelectionProps {
  onRoleSelect: (role: 'profesor' | 'alumno') => void // Función para manejar la selección de rol
}

// Componente principal para la selección de rol (profesor/alumno)
export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    // Contenedor principal con gradiente de fondo
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* ============= HEADER DE LA APLICACIÓN ============= */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            ValoraClick
          </h1>
          <p className="text-xl text-gray-600">
            Plataforma de encuestas educativas
          </p>
        </div>

        {/* ============= TARJETAS DE SELECCIÓN DE ROL ============= */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ============= TARJETA DE PROFESOR ============= */}
          <div 
            onClick={() => onRoleSelect('profesor')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-indigo-200"
          >
            <div className="text-center">
              {/* Icono representativo del profesor */}
              <div className="text-6xl mb-6">👨‍🏫</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profesor</h2>
              <p className="text-gray-600 mb-6">
                Crea y gestiona encuestas para tus alumnos. 
                Analiza resultados y mejora la experiencia educativa.
              </p>
              {/* Lista de características para profesores */}
              <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {/* Icono de check verde */}
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Crear encuestas personalizadas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ver estadísticas y resultados
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gestionar múltiples cursos
                </div>
              </div>
              {/* Botón de acción para profesores */}
              <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Entrar como Profesor
              </button>
            </div>
          </div>

          {/* ============= TARJETA DE ALUMNO ============= */}
          <div 
            onClick={() => onRoleSelect('alumno')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              {/* Icono representativo del alumno */}
              <div className="text-6xl mb-6">👨‍🎓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Alumno</h2>
              <p className="text-gray-600 mb-6">
                Responde encuestas de tus profesores y 
                comparte tu opinión para mejorar la educación.
              </p>
              {/* Lista de características para alumnos */}
              <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {/* Icono de check azul */}
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Responder encuestas asignadas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ver historial de respuestas
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Participar activamente
                </div>
              </div>
              {/* Botón de acción para alumnos */}
              <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Entrar como Alumno
              </button>
            </div>
          </div>
        </div>

        {/* ============= FOOTER INFORMATIVO ============= */}
        <div className="text-center mt-12 text-gray-500">
          <p>Selecciona tu rol para continuar</p>
        </div>
      </div>
    </div>
  )
}
