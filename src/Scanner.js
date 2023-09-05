import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga';

function Scanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment'
        },
        target: scannerRef.current
      },
      decoder: {
        readers: ['code_39_extended_reader']
      }
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      onScan(data.codeResult.code);
    });

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return <div ref={scannerRef} />;
}

export default Scanner;