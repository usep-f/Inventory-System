import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useMemo } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { useScanner } from '../../hooks/useScanner';

interface BarcodeScannerProps {
  isActive: boolean;
}

export interface BarcodeScannerHandle {
  scan: () => string | null;
}

function InitializingOverlay() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.6)' }}>
      <Camera size={32} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
        Initializing camera...
      </span>
    </div>
  );
}

function ErrorOverlay({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--error)', padding: '20px', textAlign: 'center' }}>
      <AlertCircle size={32} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
        {message}
      </span>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
        Please ensure you have granted camera permissions to this site.
      </p>
    </div>
  );
}

interface TargetReticleProps {
  isCodeDetected: boolean;
}

function TargetReticle({ isCodeDetected }: TargetReticleProps) {
  const color = isCodeDetected ? '#10b981' : '#ffffff';
  const borderColor = isCodeDetected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.2)';

  return (
    <div style={{ 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      width: '260px', 
      height: '260px',
      maxWidth: '80%',
      maxHeight: '40vh',
      border: `2px solid ${borderColor}`,
      borderRadius: '16px',
      boxShadow: '0 0 0 4000px rgba(0,0,0,0.5)',
      pointerEvents: 'none',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '24px', height: '24px', borderTop: `4px solid ${color}`, borderLeft: `4px solid ${color}`, borderTopLeftRadius: '16px', transition: 'border-color 0.25s ease' }} />
      <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '24px', height: '24px', borderTop: `4px solid ${color}`, borderRight: `4px solid ${color}`, borderTopRightRadius: '16px', transition: 'border-color 0.25s ease' }} />
      <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '24px', height: '24px', borderBottom: `4px solid ${color}`, borderLeft: `4px solid ${color}`, borderBottomLeftRadius: '16px', transition: 'border-color 0.25s ease' }} />
      <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderBottom: `4px solid ${color}`, borderRight: `4px solid ${color}`, borderBottomRightRadius: '16px', transition: 'border-color 0.25s ease' }} />
    </div>
  );
}

function useZoomPresets(zoomCapabilities: { min: number; max: number; step: number } | null) {
  return useMemo(() => {
    const defaultPresets = [1, 2, 4];
    if (!zoomCapabilities) return defaultPresets;
    
    const clamped = defaultPresets.map(val => {
      const target = zoomCapabilities.min * val;
      return Math.max(zoomCapabilities.min, Math.min(zoomCapabilities.max, target));
    });
    
    return Array.from(new Set(clamped)).sort((a, b) => a - b);
  }, [zoomCapabilities]);
}

function useFrameDetection(
  isScanning: boolean,
  scan: (videoElement: HTMLVideoElement) => string | null,
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [isCodeDetected, setIsCodeDetected] = useState(false);

  useEffect(() => {
    if (!isScanning) {
      setIsCodeDetected(false);
      return;
    }
    let active = true;

    const checkFrame = () => {
      if (!active || !videoRef.current) return;
      try {
        const result = scan(videoRef.current);
        setIsCodeDetected(result !== null);
      } catch {
        setIsCodeDetected(false);
      }
      setTimeout(checkFrame, 250);
    };

    checkFrame();
    return () => {
      active = false;
    };
  }, [isScanning, scan, videoRef]);

  return isCodeDetected;
}

const BarcodeScanner = forwardRef<BarcodeScannerHandle, BarcodeScannerProps>(
  ({ isActive }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { startScanning, stopScanning, isScanning, error, scan, zoom, zoomCapabilities, changeZoom } = useScanner();

    useEffect(() => {
      if (isActive && videoRef.current) {
        startScanning(videoRef.current);
      } else {
        stopScanning();
      }
      return () => stopScanning();
    }, [isActive, startScanning, stopScanning]);

    useImperativeHandle(ref, () => ({
      scan: () => videoRef.current ? scan(videoRef.current) : null
    }));

    const isCodeDetected = useFrameDetection(isScanning, scan, videoRef);
    const presets = useZoomPresets(zoomCapabilities);
    const showVideo = isScanning && !error;
    const cssScale = zoomCapabilities ? 1 : zoom;

    return (
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
        <video 
          ref={videoRef} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: showVideo ? 'block' : 'none', transform: `scale(${cssScale})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }} 
        />
        {!isScanning && !error && <InitializingOverlay />}
        {error && <ErrorOverlay message={error} />}
        {showVideo && <TargetReticle isCodeDetected={isCodeDetected} />}
        {showVideo && presets.length > 1 && (
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10 }}>
            {presets.map((presetVal) => {
              const isActiveBtn = zoom === presetVal;
              return (
                <button
                  key={presetVal}
                  onClick={() => changeZoom(presetVal)}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.2)', background: isActiveBtn ? '#fff' : 'rgba(0, 0, 0, 0.5)', color: isActiveBtn ? '#000' : '#fff', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', transition: 'all 0.2s ease' }}
                >
                  {presetVal.toFixed(1).replace('.0', '')}x
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default BarcodeScanner;
