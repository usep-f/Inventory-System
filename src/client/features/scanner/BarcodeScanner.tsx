import React, { useEffect, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { useScanner } from '../../hooks/useScanner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  isActive: boolean;
}

export default function BarcodeScanner({ onScan, isActive }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { startScanning, stopScanning, isScanning, error } = useScanner();

  // Use a ref to store the latest onScan callback so we don't restart the camera stream when it changes
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      startScanning(videoRef.current, (code) => onScanRef.current(code));
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive, startScanning, stopScanning]);

  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
      {/* Video Feed */}
      <video 
        ref={videoRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: isScanning && !error ? 'block' : 'none'
        }} 
      />

      {/* Loading / Error States */}
      {(!isScanning && !error) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.6)' }}>
          <Camera size={32} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
            Initializing camera...
          </span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--error)', padding: '20px', textAlign: 'center' }}>
          <AlertCircle size={32} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
            {error}
          </span>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            Please ensure you have granted camera permissions to this site.
          </p>
        </div>
      )}

      {/* Target Reticle overlay */}
      {isScanning && !error && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '70%', 
          height: '150px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          boxShadow: '0 0 0 4000px rgba(0,0,0,0.5)', // Darken everything outside
          pointerEvents: 'none'
        }}>
          {/* Corner highlights */}
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderTopLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderTopRightRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderBottomLeftRadius: '12px' }} />
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderBottomRightRadius: '12px' }} />
        </div>
      )}
    </div>
  );
}
