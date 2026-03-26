import { useState } from 'react'
import SurveyList from './components/SurveyList'
import SurveyForm from './components/SurveyForm'
import SurveyResponseComponent from './components/SurveyResponse'
import { useSurveys } from './hooks/useSurveys'
import type { Survey, SurveyResponse } from './types/survey'

type View = 'list' | 'create' | 'edit' | 'respond'

function App() {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  
  const {
    surveys,
    loading,
    error,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    toggleSurveyActive,
    submitResponse
  } = useSurveys()

  const handleSelectSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setCurrentView('respond')
  }

  const handleCreateNew = () => {
    setSelectedSurvey(null)
    setCurrentView('create')
  }

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setCurrentView('edit')
  }

  const handleSaveSurvey = async (surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => {
    try {
      if (selectedSurvey) {
        await updateSurvey(selectedSurvey.id, surveyData)
        alert('Encuesta actualizada exitosamente')
      } else {
        await createSurvey(surveyData)
        alert('Encuesta creada exitosamente')
      }
      setCurrentView('list')
      setSelectedSurvey(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la encuesta')
    }
  }

  const handleDeleteSurvey = async (surveyId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta encuesta? Esta acción no se puede deshacer.')) {
      try {
        await deleteSurvey(surveyId)
        alert('Encuesta eliminada exitosamente')
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al eliminar la encuesta')
      }
    }
  }

  const handleToggleActive = async (surveyId: string) => {
    try {
      await toggleSurveyActive(surveyId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cambiar el estado de la encuesta')
    }
  }

  const handleSubmitResponse = async (responseData: Omit<SurveyResponse, 'id' | 'submittedAt'>) => {
    try {
      await submitResponse(responseData)
      alert('¡Gracias por tu respuesta! Tus respuestas han sido guardadas.')
      setCurrentView('list')
      setSelectedSurvey(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al enviar la respuesta')
    }
  }

  const handleCancel = () => {
    setCurrentView('list')
    setSelectedSurvey(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuestas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  switch (currentView) {
    case 'create':
    case 'edit':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <SurveyForm
            survey={selectedSurvey || undefined}
            onSave={handleSaveSurvey}
            onCancel={handleCancel}
          />
        </div>
      )

    case 'respond':
      return selectedSurvey ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <SurveyResponseComponent
            survey={selectedSurvey}
            onSubmit={handleSubmitResponse}
            onCancel={handleCancel}
          />
        </div>
      ) : null

    case 'list':
    default:
      return (
        <SurveyList
          surveys={surveys}
          onSelectSurvey={handleSelectSurvey}
          onCreateNew={handleCreateNew}
          onEditSurvey={handleEditSurvey}
          onDeleteSurvey={handleDeleteSurvey}
          onToggleActive={handleToggleActive}
        />
      )
  }
}

export default App
