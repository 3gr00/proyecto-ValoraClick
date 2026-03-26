// Importaciones necesarias para el hook personalizado
import { useState, useEffect } from 'react'
import type { Survey, SurveyResponse } from '../types/survey'

// ============= DATOS DE DESARROLLO (MOCK) =============
// Datos simulados para desarrollo y pruebas
const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Encuesta de Satisfacción del Cliente',
    description: 'Evalúa tu experiencia con nuestros servicios y ayúdanos a mejorar.',
    questions: [
      {
        id: '1',
        type: 'rating',
        question: '¿Cómo calificarías nuestro servicio general?',
        required: true,
        order: 0
      },
      {
        id: '2',
        type: 'multiple-choice',
        question: '¿Qué aspecto de nuestro servicio te gustó más?',
        options: ['Atención al cliente', 'Calidad del producto', 'Tiempo de entrega', 'Precio'],
        required: true,
        order: 1
      },
      {
        id: '3',
        type: 'text',
        question: '¿Tienes algún comentario adicional?',
        required: false,
        order: 2
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    responses: 42
  },
  {
    id: '2',
    title: 'Feedback del Producto',
    description: 'Cuéntanos tu opinión sobre nuestras últimas características.',
    questions: [
      {
        id: '1',
        type: 'checkbox',
        question: '¿Qué características utilizas regularmente?',
        options: ['Dashboard', 'Reportes', 'Analytics', 'Integraciones', 'API'],
        required: true,
        order: 0
      },
      {
        id: '2',
        type: 'text',
        question: '¿Qué mejoraría en el producto?',
        required: false,
        order: 1
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    isActive: true,
    responses: 28
  },
  {
    id: '3',
    title: 'Encuesta de Cultura Organizacional',
    description: 'Ayúdanos a entender y mejorar nuestro ambiente de trabajo.',
    questions: [
      {
        id: '1',
        type: 'rating',
        question: '¿Cómo te sientes trabajando en el equipo?',
        required: true,
        order: 0
      },
      {
        id: '2',
        type: 'multiple-choice',
        question: '¿Cuál es tu nivel de satisfacción con los beneficios?',
        options: ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Poco satisfecho', 'Nada satisfecho'],
        required: true,
        order: 1
      }
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isActive: false,
    responses: 15
  }
]

// ============= HOOK PERSONALIZADO PARA GESTIÓN DE ENCUESTAS =============
export function useSurveys() {
  // Estados locales para gestión de encuestas
  const [surveys, setSurveys] = useState<Survey[]>([])  // Array de encuestas
  const [loading, setLoading] = useState(true)           // Estado de carga
  const [error, setError] = useState<string | null>(null) // Mensaje de error

  // ============= CARGA INICIAL DE ENCUESTAS =============
  useEffect(() => {
    // Simula la llamada a una API para cargar encuestas
    const loadSurveys = async () => {
      try {
        setLoading(true)
        // Simula el retraso de red (1 segundo)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSurveys(mockSurveys)
      } catch (err) {
        setError('Error al cargar las encuestas')
      } finally {
        setLoading(false)
      }
    }

    loadSurveys()
  }, []) // Se ejecuta solo al montar el componente

  // ============= FUNCIONES CRUD =============
  
  // Crea una nueva encuesta
  const createSurvey = async (surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => {
    try {
      const newSurvey: Survey = {
        ...surveyData,
        id: Date.now().toString(),  // ID único basado en timestamp
        createdAt: new Date(),
        updatedAt: new Date(),
        responses: 0  // Inicia con 0 respuestas
      }
      
      // Añade la nueva encuesta al principio del array
      setSurveys(prev => [newSurvey, ...prev])
      return newSurvey
    } catch (err) {
      throw new Error('Error al crear la encuesta')
    }
  }

  // Actualiza una encuesta existente
  const updateSurvey = async (id: string, surveyData: Partial<Survey>) => {
    try {
      setSurveys(prev => prev.map(survey => 
        survey.id === id 
          ? { ...survey, ...surveyData, updatedAt: new Date() }  // Actualiza y marca como modificada
          : survey
      ))
    } catch (err) {
      throw new Error('Error al actualizar la encuesta')
    }
  }

  // Elimina una encuesta
  const deleteSurvey = async (id: string) => {
    try {
      // Filtra la encuesta a eliminar
      setSurveys(prev => prev.filter(survey => survey.id !== id))
    } catch (err) {
      throw new Error('Error al eliminar la encuesta')
    }
  }

  // Activa/desactiva una encuesta
  const toggleSurveyActive = async (id: string) => {
    try {
      setSurveys(prev => prev.map(survey => 
        survey.id === id 
          ? { ...survey, isActive: !survey.isActive, updatedAt: new Date() }  // Invierte el estado
          : survey
      ))
    } catch (err) {
      throw new Error('Error al cambiar el estado de la encuesta')
    }
  }

  // Envía una respuesta a una encuesta
  const submitResponse = async (responseData: Omit<SurveyResponse, 'id' | 'submittedAt'>) => {
    try {
      // Incrementa el contador de respuestas de la encuesta
      setSurveys(prev => prev.map(survey => 
        survey.id === responseData.surveyId 
          ? { ...survey, responses: survey.responses + 1 }
          : survey
      ))
      
      // En una app real, guardarías la respuesta en una base de datos
      const newResponse: SurveyResponse = {
        ...responseData,
        id: Date.now().toString(),
        submittedAt: new Date()
      }
      
      return newResponse
    } catch (err) {
      throw new Error('Error al enviar la respuesta')
    }
  }

  // ============= RETORNO DEL HOOK =============
  // Devuelve el estado y todas las funciones CRUD para que los componentes puedan usarlas
  return {
    surveys,           // Array de encuestas
    loading,           // Estado de carga
    error,             // Mensaje de error
    createSurvey,      // Función para crear encuesta
    updateSurvey,      // Función para actualizar encuesta
    deleteSurvey,      // Función para eliminar encuesta
    toggleSurveyActive, // Función para activar/desactivar
    submitResponse     // Función para enviar respuesta
  }
}
