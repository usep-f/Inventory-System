import { useEffect, useRef, useCallback, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      readerRef.current?.reset();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      interface AdvancedConstraint extends MediaTrackConstraintSet {
        focusMode?: 'none' | 'manual' | 'single-shot' | 'continuous';
        zoom?: number;
      }

      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          advanced: [
            { focusMode: 'continuous' }
          ] as AdvancedConstraint[]
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      videoElement.srcObject = stream;
      videoElement.setAttribute('autoplay', 'true');
      videoElement.setAttribute('muted', 'true');
      videoElement.setAttribute('playsinline', 'true');
      await videoElement.play();

      setHasPermission(true);
      setError(null);
      setIsScanning(true);
    } catch (err: unknown) {
      console.error('Camera initialization error:', err);
      setHasPermission(false);
      setIsScanning(false);
      setError('Camera access denied or no camera found.');
    }
  }, []);

  const scan = useCallback((videoElement: HTMLVideoElement): string | null => {
    if (!readerRef.current) return null;
    try {
      const result = readerRef.current.decode(videoElement);
      return result.getText();
    } catch {
      return null;
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
  }, []);

  return {
    startScanning,
    stopScanning,
    scan,
    isScanning,
    error,
    hasPermission
  };
}
