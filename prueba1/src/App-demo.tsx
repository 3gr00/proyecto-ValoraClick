import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            React + Vite + Tailwind CSS
          </h1>
          <p className="text-lg text-gray-600">
            Proyecto configurado exitosamente con Tailwind CSS
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {/* Counter Card */}
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Contador Interactivo
              </h2>
              <div className="flex justify-center items-center gap-4 mb-6">
                <button
                  onClick={() => setCount(count - 1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  -
                </button>
                <div className="text-3xl font-bold text-indigo-600 min-w-[100px]">
                  {count}
                </div>
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Resetear
              </button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-500 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Vite Rápido
              </h3>
              <p className="text-gray-600">
                Desarrollo ultrarrápido con Hot Module Replacement
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-cyan-500 text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                React 19
              </h3>
              <p className="text-gray-600">
                La última versión de React con todas sus características
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-teal-500 text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tailwind CSS
              </h3>
              <p className="text-gray-600">
                Utility-first CSS framework para diseño rápido
              </p>
            </div>
          </section>

          {/* Interactive Elements */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Elementos Interactivos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Campo de texto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Opción 1</option>
                  <option>Opción 2</option>
                  <option>Opción 3</option>
                </select>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Botón Primario
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-indigo-500 border-2 border-indigo-500 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Botón Secundario
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <p>
            Proyecto creado con ❤️ usando React, Vite y Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
