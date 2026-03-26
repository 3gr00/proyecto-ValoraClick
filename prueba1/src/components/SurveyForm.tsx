// Importaciones necesarias para el componente de formulario
import { useState } from 'react'
import type { Survey, Question } from '../types/survey'

// Interfaz que define las props que recibe el componente SurveyForm
interface SurveyFormProps {
  survey?: Survey  // Encuesta opcional (si se proporciona, es modo edición)
  onSave: (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => void // Función para guardar la encuesta
  onCancel: () => void // Función para cancelar la operación
}

// Componente principal para crear/editar encuestas
export default function SurveyForm({ survey, onSave, onCancel }: SurveyFormProps) {
  // Estados locales para los datos del formulario
  const [title, setTitle] = useState(survey?.title || '')  // Título de la encuesta
  const [description, setDescription] = useState(survey?.description || '')  // Descripción de la encuesta
  const [questions, setQuestions] = useState<Question[]>(
    // Array de preguntas: si hay encuesta existente, usa sus preguntas, si no, crea una por defecto
    survey?.questions || [{
      id: '1',
      type: 'text',
      question: '',
      required: false,
      order: 0
    }]
  )
  const [isActive, setIsActive] = useState(survey?.isActive ?? true)  // Estado de activación de la encuesta

  // ============= MANEJADORES DE PREGUNTAS =============
  
  // Añade una nueva pregunta al final de la lista
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),  // ID único basado en timestamp
      type: 'text',               // Tipo por defecto
      question: '',               // Texto vacío inicial
      required: false,            // No obligatoria por defecto
      order: questions.length     // Orden al final de la lista
    }
    setQuestions([...questions, newQuestion])
  }

  // Actualiza un campo específico de una pregunta
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  // Elimina una pregunta (si hay más de una)
  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index)
      // Reordena las preguntas restantes
      setQuestions(updatedQuestions.map((q, i) => ({ ...q, order: i })))
    }
  }

  // ============= MANEJADOR DE ENVÍO =============
  
  // Maneja el envío del formulario con validaciones
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación de campos obligatorios
    if (!title.trim() || !description.trim()) {
      alert('Por favor completa el título y la descripción')
      return
    }

    // Filtra preguntas válidas (con texto no vacío)
    const validQuestions = questions.filter(q => q.question.trim())
    if (validQuestions.length === 0) {
      alert('Por favor añade al menos una pregunta válida')
      return
    }

    // Llama a la función onSave con los datos validados
    onSave({
      title: title.trim(),
      description: description.trim(),
      questions: validQuestions,
      isActive
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Título dinámico según modo (crear/editar) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {survey ? 'Editar Encuesta' : 'Crear Nueva Encuesta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ============= INFORMACIÓN BÁSICA DE LA ENCUESTA ============= */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Encuesta *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Satisfacción del Cliente"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Describe el propósito de tu encuesta..."
                required
              />
            </div>

            {/* Checkbox para activar/desactivar encuesta */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Encuesta activa (disponible para responder)
              </label>
            </div>
          </div>

          {/* ============= SECCIÓN DE PREGUNTAS ============= */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preguntas</h3>
              {/* Botón para añadir nueva pregunta */}
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Añadir Pregunta
              </button>
            </div>

            {/* Lista de preguntas existentes */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  {/* Header de cada pregunta */}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">Pregunta {index + 1}</h4>
                    {/* Botón para eliminar pregunta (solo si hay más de una) */}
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Configuración de la pregunta */}
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Pregunta
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="text">Respuesta Corta</option>
                        <option value="multiple-choice">Opción Múltiple</option>
                        <option value="checkbox">Casillas de Verificación</option>
                        <option value="rating">Valoración (1-5)</option>
                      </select>
                    </div>

                    {/* Checkbox para hacer la pregunta obligatoria */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${question.id}`}
                        checked={question.required}
                        onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
                        Obligatoria
                      </label>
                    </div>
                  </div>

                  {/* Campo para el texto de la pregunta */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto de la Pregunta
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: ¿Qué te pareció nuestro servicio?"
                    />
                  </div>

                  {/* ============= SECCIÓN DE OPCIONES (para preguntas de opción múltiple) ============= */}
                  {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opciones
                      </label>
                      <div className="space-y-2">
                        {/* Mapeo de opciones existentes */}
                        {(question.options || ['']).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [''])]
                                newOptions[optionIndex] = e.target.value
                                updateQuestion(index, 'options', newOptions)
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Opción ${optionIndex + 1}`}
                            />
                            {/* Botón para eliminar opción (solo si hay más de una) */}
                            {(question.options || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = (question.options || []).filter((_, i) => i !== optionIndex)
                                  updateQuestion(index, 'options', newOptions.length > 0 ? newOptions : [''])
                                }}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        {/* Botón para añadir nueva opción */}
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = [...(question.options || ['']), '']
                            updateQuestion(index, 'options', newOptions)
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                        >
                          + Añadir Opción
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ============= BOTONES DE ACCIÓN ============= */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              {survey ? 'Actualizar Encuesta' : 'Crear Encuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
