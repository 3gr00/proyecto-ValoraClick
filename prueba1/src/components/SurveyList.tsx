// Importaciones necesarias para el componente
import { useState } from 'react'
import type { Survey } from '../types/survey'

// Interfaz que define las props que recibe el componente SurveyList
interface SurveyListProps {
  surveys: Survey[]                    // Array de encuestas a mostrar
  onSelectSurvey: (survey: Survey) => void  // Función para seleccionar una encuesta (para responder)
  onCreateNew: () => void               // Función para crear una nueva encuesta
  onEditSurvey: (survey: Survey) => void   // Función para editar una encuesta existente
  onDeleteSurvey: (surveyId: string) => void // Función para eliminar una encuesta
  onToggleActive: (surveyId: string) => void // Función para activar/desactivar una encuesta
}

// Componente principal que muestra la lista de encuestas
export default function SurveyList({ 
  surveys, 
  onSelectSurvey, 
  onCreateNew, 
  onEditSurvey,
  onDeleteSurvey, 
  onToggleActive 
}: SurveyListProps) {
  // Estado local para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('')

  // Filtra las encuestas según el término de búsqueda
  // Busca en título y descripción (case insensitive)
  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header con título y botón de crear nueva encuesta */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ValoraClick</h1>
          <p className="text-gray-600 mt-2">Gestiona tus encuestas fácilmente</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {/* Icono de más para crear nueva encuesta */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Encuesta
        </button>
      </div>

      {/* Barra de búsqueda con icono */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar encuestas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Icono de búsqueda */}
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid de encuestas - muestra mensaje si no hay resultados */}
      {filteredSurveys.length === 0 ? (
        <div className="text-center py-12">
          {/* Icono de lista vacía */}
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No se encontraron encuestas' : 'No hay encuestas aún'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Crea tu primera encuesta para comenzar'
            }
          </p>
          {/* Botón para crear primera encuesta (solo si no hay búsqueda activa) */}
          {!searchTerm && (
            <button
              onClick={onCreateNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Crear Primera Encuesta
            </button>
          )}
        </div>
      ) : (
        {/* Grid de tarjetas de encuestas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Barra de estado (verde si está activa, gris si está inactiva) */}
              <div className={`h-2 ${survey.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              
              <div className="p-6">
                {/* Título y badge de estado */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {survey.title}
                  </h3>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    survey.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.isActive ? 'Activa' : 'Inactiva'}
                  </div>
                </div>

                {/* Descripción de la encuesta */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {survey.description}
                </p>

                {/* Metadatos: número de preguntas y respuestas */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      {/* Icono de documento para preguntas */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {survey.questions.length} preguntas
                    </span>
                    <span className="flex items-center gap-1">
                      {/* Icono de ojo para respuestas */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {survey.responses} respuestas
                    </span>
                  </div>
                </div>

                {/* Fecha de creación */}
                <div className="text-xs text-gray-400 mb-4">
                  Creada: {new Date(survey.createdAt).toLocaleDateString()}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  {/* Botón para responder encuesta */}
                  <button
                    onClick={() => onSelectSurvey(survey)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Responder
                  </button>
                  {/* Botón para editar encuesta */}
                  <button
                    onClick={() => onEditSurvey(survey)}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Editar
                  </button>
                  {/* Botón para activar/desactivar encuesta */}
                  <button
                    onClick={() => onToggleActive(survey.id)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      survey.isActive
                        ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'  // Amarillo si está activa (pausar)
                        : 'bg-green-50 hover:bg-green-100 text-green-600'      // Verde si está inactiva (activar)
                    }`}
                  >
                    {survey.isActive ? 'Pausar' : 'Activar'}
                  </button>
                  {/* Botón para eliminar encuesta */}
                  <button
                    onClick={() => onDeleteSurvey(survey.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200"
                  >
                    {/* Icono de papelera */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
