import React, { useState } from 'react';
import Quagga from '@ericblade/quagga2';

function ScannerComponent() {
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    // Configuración de Quagga
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: {
          width: 780,
          height: 480,
          facingMode: "environment" // Usa la cámara trasera si está disponible
        },
        target: document.querySelector('#scanner-container') // Pasando el elemento directamente
      },
      decoder: {
        readers: ["code_128_reader"] // Aquí puedes agregar otros formatos si es necesario
      }
    }, (err) => {
      if (err) {
        console.error("Error al inicializar Quagga:", err);
        setIsScanning(false);
        return;
      }
      Quagga.start();
    });
  };

  return (
    <div>
      {!isScanning && <button onClick={startScanning}>Iniciar escaneo</button>}
      <div id="scanner-container"></div>
    </div>
  );
}

export default ScannerComponent;