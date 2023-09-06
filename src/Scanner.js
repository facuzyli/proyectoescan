import React, { useState } from 'react';
import Quagga from '@ericblade/quagga2';
import emailjs from 'emailjs-com';

function ScannerComponent() {
  const [isScanning, setIsScanning] = useState(false);
  const [localNumber, setLocalNumber] = useState("");

  const startScanning = () => {
    setIsScanning(true);
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          width: 780,
          height: 480,
          facingMode: "environment"
        },
        target: document.querySelector('#scanner-container')
      },
      decoder: {
        readers: ["code_128_reader"]
      }
    }, (err) => {
      if (err) {
        console.error("Error al inicializar Quagga:", err);
        setIsScanning(false);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      alert("Entrega confirmada para el código: " + code);
      sendEmail(code, localNumber);
      Quagga.stop();
      setIsScanning(false);
    });
  };

  const sendEmail = (code, localNumber) => {
    const templateParams = {
      code: code,
      localNumber: localNumber,
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
      .then((response) => {
        alert('Correo enviado con éxito!');
      }, (error) => {
        alert('Error al enviar el correo:', error);
      });
  };

  return (
    <div>
      <label>Número de local:</label>
      <input 
        type="text" 
        value={localNumber} 
        onChange={(e) => setLocalNumber(e.target.value)} 
        placeholder="Ingrese el número de local" 
      />
      <br />
      {!isScanning && <button onClick={startScanning}>Escanear</button>}
      <div id="scanner-container"></div>
    </div>
  );
}

export default ScannerComponent;