import React from 'react';
import './App.css';
import ScannerComponent from './Scanner';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Escáner de Código de Barras</h1>
          <ScannerComponent />
          {/* Aquí puedes agregar cualquier otro componente o funcionalidad que desees */}
        </header>
      </div>
    </ErrorBoundary>
  );
}

export default App;






