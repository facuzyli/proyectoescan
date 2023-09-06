import React, { useRef, useEffect, useState } from 'react';
import Quagga from 'quagga';

function Scanner({ onScan }) {
  const scannerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initializeQuagga = () => {
      if (!scannerRef.current) return;

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
    };

    const timeoutId = setTimeout(initializeQuagga, 500);

    return () => {
      clearTimeout(timeoutId);
      Quagga.stop();
    };
  }, [onScan, isMounted]);

  return <div ref={scannerRef} />;
}

export default Scanner;