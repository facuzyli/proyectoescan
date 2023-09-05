import React, { useState, useEffect } from 'react';
import Scanner from './Scanner';
import emailjs from 'emailjs-com';

function App() {
  const [localNumber, setLocalNumber] = useState('');
  const [scannedCode, setScannedCode] = useState('');

  const sendEmail = (localNum, scannedCod) => {
    const templateParams = {
      localNumber: localNum,
      scannedCode: scannedCod
    };

    emailjs.send('service_159lgyl', 'template_qouw3so', templateParams, 'cataYOEwOQrXCUnMT')
      .then((response) => {
         console.log('Email successfully sent!', response);
      })
      .catch((error) => {
         console.error('Email sending error:', error);
      });
  }

  const handleScan = (code) => {
    console.log("Código escaneado:", code);
    setScannedCode(code);

    const isConnected = window.navigator.onLine;
    if (isConnected) {
      sendEmail(localNumber, code);
    } else {
      const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
      pendingEmails.push({ localNumber, scannedCode: code });
      localStorage.setItem('pendingEmails', JSON.stringify(pendingEmails));
    }
  };

  const sendPendingEmails = () => {
    const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
    
    pendingEmails.forEach(email => {
      const { localNumber, scannedCode } = email;
      sendEmail(localNumber, scannedCode);
    });

    localStorage.removeItem('pendingEmails');
  };

  useEffect(() => {
    window.addEventListener('online', sendPendingEmails);

    return () => {
      window.removeEventListener('online', sendPendingEmails);
    };
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Escáner de código de barras</h1>
      </header>
      <main>
        <div>
          <label>Número de Local: </label>
          <input 
            type="text" 
            value={localNumber} 
            onChange={(e) => setLocalNumber(e.target.value)} 
          />
        </div>
        <Scanner onScan={handleScan} />
        <p>Código escaneado: {scannedCode}</p>
      </main>
      <footer>
        <p>Desarrollado por [Tu Nombre]</p>
      </footer>
    </div>
  );
}

export default App;