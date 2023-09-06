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
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 4,
      decoder: {
        readers: ["code_39_reader", "code_39_extended_reader"]
      },
      locate: true,
      drawScanline: true,
      drawBoundingBox: true,
      showPattern: true,
      drawLocator: true,
      multiple: false
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
      sendEmail(code, localNumber);
      Quagga.stop();
      setIsScanning(false);
    });

    Quagga.onProcessed(function(result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: "red", lineWidth: 3});
        }
      }
    });
  };

  const sendEmail = (code, localNumber) => {
    const templateParams = {
      code: code,
      localNumber: localNumber,
    };

    emailjs.send('service_159lgyl', 'template_qouw3so', templateParams, 'cataYOEwOQrXCUnMT')
      .then((response) => {
        alert(`La entrega fue notificada. Código de barras: ${code}`);
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
      <div id="scanner-container">
        {isScanning && (
          <div className="scanning-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerComponent;