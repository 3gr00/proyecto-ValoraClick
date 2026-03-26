// Importaciones necesarias para el componente de respuesta
import { useState } from 'react'
import type { Survey, SurveyResponse } from '../types/survey'

// Interfaz que define las props que recibe el componente SurveyResponse
interface SurveyResponseProps {
  survey: Survey  // Encuesta a responder
  onSubmit: (response: Omit<SurveyResponse, 'id' | 'submittedAt'>) => void // Función para enviar respuestas
  onCancel: () => void // Función para cancelar la operación
}

// Componente principal para responder encuestas
export default function SurveyResponseComponent({ survey, onSubmit, onCancel }: SurveyResponseProps) {
  // Estados locales para gestionar las respuestas y el estado de envío
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({}) // Almacena las respuestas del usuario
  const [isSubmitting, setIsSubmitting] = useState(false) // Estado de envío para mostrar loading

  // Maneja el cambio en la respuesta de una pregunta
  const handleAnswerChange = (questionId: string, value: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // ============= MANEJADOR DE ENVÍO DE RESPUESTAS =============
  
  // Maneja el envío del formulario con validaciones
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validación de preguntas obligatorias
    const missingRequired = survey.questions.filter(q => 
      q.required && !answers[q.id]
    )

    if (missingRequired.length > 0) {
      alert(`Por favor responde las preguntas obligatorias: ${missingRequired.map(q => q.question).join(', ')}`)
      setIsSubmitting(false)
      return
    }

    // Transforma las respuestas al formato esperado por la API
    const formattedAnswers = survey.questions.map(question => ({
      questionId: question.id,
      value: answers[question.id] || ''
    }))

    // Llama a la función onSubmit con las respuestas formateadas
    onSubmit({
      surveyId: survey.id,
      answers: formattedAnswers
    })

    setIsSubmitting(false)
  }

  // ============= RENDERIZADO DE PREGUNTAS =============
  
  // Función que renderiza cada tipo de pregunta según su configuración
  const renderQuestion = (question: any) => {
    const answer = answers[question.id]

    switch (question.type) {
      // ============= PREGUNTA DE RESPUESTA CORTA =============
      case 'text':
        return (
          <input
            type="text"
            value={answer as string || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tu respuesta..."
            required={question.required}
          />
        )

      // ============= PREGUNTA DE OPCIÓN MÚLTIPLE =============
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  required={question.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      // ============= PREGUNTA DE CASILLAS DE VERIFICACIÓN =============
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : []
                    if (e.target.checked) {
                      // Añade la opción si está marcada
                      handleAnswerChange(question.id, [...currentAnswers, option])
                    } else {
                      // Elimina la opción si está desmarcada
                      handleAnswerChange(question.id, currentAnswers.filter(a => a !== option))
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      // ============= PREGUNTA DE VALORACIÓN (1-5) =============
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => handleAnswerChange(question.id, rating)}
                className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                  answer === rating
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 font-bold'  // Estilo seleccionado
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'     // Estilo no seleccionado
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        )

      // Tipo de pregunta no soportado
      default:
        return null
    }
  }

  // ============= RENDERIZADO PRINCIPAL =============
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header con información de la encuesta */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{survey.title}</h1>
          <p className="text-gray-600 text-lg">{survey.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            {survey.questions.length} pregunta{survey.questions.length !== 1 ? 's' : ''} • 
            {survey.questions.filter(q => q.required).length} obligatoria{survey.questions.filter(q => q.required).length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ============= FORMULARIO DE PREGUNTAS ============= */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Renderiza cada pregunta individualmente */}
          {survey.questions.map((question, index) => (
            <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0">
              {/* Header de cada pregunta con número y texto */}
              <div className="flex items-start gap-2 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {question.question}
                    {/* Indicador de pregunta obligatoria */}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>
              </div>
              
              {/* Renderizado del input según tipo de pregunta */}
              <div className="ml-10">
                {renderQuestion(question)}
              </div>
            </div>
          ))}

          {/* ============= BOTONES DE ACCIÓN ============= */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                // Estado de carga con spinner
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar Respuestas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
