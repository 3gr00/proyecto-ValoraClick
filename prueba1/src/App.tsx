// Importaciones de componentes de la aplicación
import { useState } from 'react'
import RoleSelection from './components/RoleSelection'          // Componente para seleccionar rol (profesor/alumno)
import Login from './components/Login'                        // Componente de login para profesores
import RegisterProfessor from './components/RegisterProfessor' // Componente de registro para profesores
import LoginStudent from './components/LoginStudent'           // Componente de login para alumnos
import SignIn from './components/SignIn'                       // Componente de registro para alumnos (con código de verificación)
import SurveyList from './components/SurveyList'               // Componente que lista todas las encuestas
import SurveyForm from './components/SurveyForm'               // Componente para crear/editar encuestas
import SurveyResponse from './components/SurveyResponse'       // Componente para responder encuestas
import { useSurveys } from './hooks/useSurveys'               // Hook personalizado para gestionar encuestas
import type { Survey, SurveyResponse as SurveyResponseType } from './types/survey' // Tipos TypeScript para encuestas

// Definición de todas las vistas posibles en la aplicación
type View = 'role-selection' | 'login' | 'register-professor' | 'login-student' | 'signin' | 'surveys' | 'create' | 'edit' | 'respond'

// Interfaz para el usuario autenticado
interface User {
  email: string        // Email del usuario
  role: 'profesor' | 'alumno'  // Rol del usuario
  nia?: string         // NIA solo para alumnos (opcional)
}

function App() {
  // Estados principales de la aplicación
  const [currentView, setCurrentView] = useState<View>('role-selection') // Vista actual que se muestra
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null) // Encuesta seleccionada para editar/responder
  const [user, setUser] = useState<User | null>(null) // Usuario autenticado actual
  
  // Hook personalizado para gestionar todas las operaciones de encuestas
  // Proporciona funciones CRUD y estado de encuestas
  const {
    surveys,           // Array de todas las encuestas
    loading,           // Estado de carga al obtener encuestas
    error,             // Mensaje de error si falla la carga
    createSurvey,      // Función para crear nueva encuesta
    updateSurvey,      // Función para actualizar encuesta existente
    deleteSurvey,      // Función para eliminar encuesta
    toggleSurveyActive, // Función para activar/desactivar encuesta
    submitResponse     // Función para enviar respuesta a encuesta
  } = useSurveys()

  // ============= MANEJADORES DE AUTENTICACIÓN =============
  
  // Maneja la selección inicial de rol (profesor o alumno)
  const handleRoleSelect = (role: 'profesor' | 'alumno') => {
    if (role === 'profesor') {
      setCurrentView('login') // Redirige al login de profesores
    } else {
      setCurrentView('login-student') // Redirige al login de alumnos
    }
  }

  // Maneja el login de profesores
  const handleLogin = (email: string, _password: string) => {
    setUser({ email, role: 'profesor' })
    setCurrentView('surveys') // Redirige a la lista de encuestas
  }

  // Maneja el registro de nuevos profesores
  const handleRegisterProfessor = (email: string, _password: string, _name: string) => {
    setUser({ email, role: 'profesor' })
    setCurrentView('surveys') // Redirige a la lista de encuestas
  }

  // Maneja el login de alumnos
  const handleLoginStudent = (nia: string, email: string) => {
    setUser({ email, role: 'alumno', nia })
    setCurrentView('surveys') // Redirige a la lista de encuestas
  }

  // Maneja el registro de nuevos alumnos
  const handleSignIn = (nia: string, email: string) => {
    setUser({ email, role: 'alumno', nia })
    setCurrentView('surveys') // Redirige a la lista de encuestas
  }

  // ============= MANEJADORES DE NAVEGACIÓN =============
  
  // Navega al formulario de registro de profesores
  const handleGoToRegisterProfessor = () => {
    setCurrentView('register-professor')
  }

  // Navega al login de profesores
  const handleGoToLoginProfessor = () => {
    setCurrentView('login')
  }

  // Navega al login de alumnos
  const handleGoToLoginStudent = () => {
    setCurrentView('login-student')
  }

  // Navega al registro de alumnos
  const handleGoToRegisterStudent = () => {
    setCurrentView('signin')
  }

  // Cierra sesión y vuelve a la selección de rol
  const handleLogout = () => {
    setUser(null)
    setCurrentView('role-selection')
    setSelectedSurvey(null)
  }

  // ============= MANEJADORES DE ENCUESTAS =============
  
  // Selecciona una encuesta para responder (solo alumnos)
  const handleSelectSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setCurrentView('respond') // Abre la vista de respuesta
  }

  // Inicia la creación de una nueva encuesta (solo profesores)
  const handleCreateNew = () => {
    setSelectedSurvey(null)
    setCurrentView('create') // Abre el formulario de creación
  }

  // Inicia la edición de una encuesta existente (solo profesores)
  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setCurrentView('edit') // Abre el formulario de edición
  }

  // Guarda una encuesta (creación o edición)
  const handleSaveSurvey = async (surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'responses'>) => {
    try {
      if (selectedSurvey) {
        await updateSurvey(selectedSurvey.id, surveyData) // Actualiza existente
        alert('Encuesta actualizada exitosamente')
      } else {
        await createSurvey(surveyData) // Crea nueva
        alert('Encuesta creada exitosamente')
      }
      setCurrentView('surveys') // Vuelve a la lista
      setSelectedSurvey(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la encuesta')
    }
  }

  // Elimina una encuesta (solo profesores)
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

  // Activa o desactiva una encuesta (solo profesores)
  const handleToggleActive = async (surveyId: string) => {
    try {
      await toggleSurveyActive(surveyId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cambiar el estado de la encuesta')
    }
  }

  // Envía las respuestas de una encuesta (solo alumnos)
  const handleSubmitResponse = async (responseData: Omit<SurveyResponseType, 'id' | 'submittedAt'>) => {
    try {
      await submitResponse(responseData)
      alert('¡Gracias por tu respuesta! Tus respuestas han sido guardadas.')
      setCurrentView('surveys') // Vuelve a la lista
      setSelectedSurvey(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al enviar la respuesta')
    }
  }

  // Maneja la cancelación de operaciones (volver atrás)
  const handleCancel = () => {
    if (currentView === 'create' || currentView === 'edit' || currentView === 'respond') {
      setCurrentView('surveys') // Vuelve a la lista de encuestas
      setSelectedSurvey(null)
    } else {
      setCurrentView('role-selection') // Vuelve a selección de rol
    }
  }

  // Vuelve a la selección de rol desde cualquier vista de auth
  const handleBackToRoleSelection = () => {
    setCurrentView('role-selection')
  }

  // ============= ESTADOS DE CARGA Y ERROR =============
  
  // Muestra pantalla de carga mientras se obtienen las encuestas
  if (loading && currentView === 'surveys') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando encuestas...</p>
        </div>
      </div>
    )
  }

  // Muestra pantalla de error si falla la carga de encuestas
  if (error && currentView === 'surveys') {
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

  // ============= RENDERIZADO PRINCIPAL =============
  
  // Renderiza diferentes componentes según la vista actual
  switch (currentView) {
    case 'role-selection':
      return <RoleSelection onRoleSelect={handleRoleSelect} /> // Vista inicial de selección de rol

    case 'login':
      return (
        <Login 
          onLogin={handleLogin} 
          onBack={handleBackToRoleSelection}
          onRegisterInstead={handleGoToRegisterProfessor} // Permite ir al registro
        />
      )

    case 'register-professor':
      return (
        <RegisterProfessor 
          onRegister={handleRegisterProfessor}
          onBack={handleBackToRoleSelection}
          onLoginInstead={handleGoToLoginProfessor} // Permite volver al login
        />
      )

    case 'login-student':
      return (
        <LoginStudent 
          onLogin={handleLoginStudent}
          onBack={handleBackToRoleSelection}
          onRegisterInstead={handleGoToRegisterStudent} // Permite ir al registro
        />
      )

    case 'signin':
      return (
        <SignIn 
          onSignIn={handleSignIn} 
          onBack={handleBackToRoleSelection}
          onLoginInstead={handleGoToLoginStudent} // Permite ir al login
        />
      )

    case 'surveys':
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header con información del usuario y logout */}
          {user && (
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800">ValoraClick</h1>
                    <span className="text-sm text-gray-600">
                      {user.role === 'profesor' ? '👨‍🏫 Profesor' : '👨‍🎓 Alumno'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Lista de encuestas con funciones según el rol */}
          <SurveyList
            surveys={surveys}
            onSelectSurvey={user?.role === 'alumno' ? handleSelectSurvey : () => {}} // Solo alumnos pueden responder
            onCreateNew={user?.role === 'profesor' ? handleCreateNew : () => {}}      // Solo profesores pueden crear
            onEditSurvey={user?.role === 'profesor' ? handleEditSurvey : () => {}}      // Solo profesores pueden editar
            onDeleteSurvey={user?.role === 'profesor' ? handleDeleteSurvey : () => {}}  // Solo profesores pueden eliminar
            onToggleActive={user?.role === 'profesor' ? handleToggleActive : () => {}}  // Solo profesores pueden activar
          />
        </div>
      )

    // Vistas de creación y edición de encuestas (solo profesores)
    case 'create':
    case 'edit':
      return user?.role === 'profesor' ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <SurveyForm
            survey={selectedSurvey || undefined} // undefined para crear, survey para editar
            onSave={handleSaveSurvey}
            onCancel={handleCancel}
          />
        </div>
      ) : null

    // Vista de respuesta a encuestas (solo alumnos)
    case 'respond':
      return selectedSurvey && user?.role === 'alumno' ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <SurveyResponse
            survey={selectedSurvey}
            onSubmit={handleSubmitResponse}
            onCancel={handleCancel}
          />
        </div>
      ) : null

    // Vista por defecto (fallback)
    default:
      return <RoleSelection onRoleSelect={handleRoleSelect} />
  }
}

export default App
