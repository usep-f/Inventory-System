import { useEffect, useRef, useCallback, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  
  // To prevent rapid successive scans of the same code
  const lastScannedCode = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      readerRef.current?.reset();
    };
  }, []);

  const startScanning = useCallback(async (
    videoElement: HTMLVideoElement,
    onScanSuccess: (barcode: string) => void
  ) => {
    if (!readerRef.current) return;

    try {
      // Extended interface to support mobile-specific focus modes not yet in TS DOM lib
      interface AdvancedConstraint extends MediaTrackConstraintSet {
        focusMode?: 'none' | 'manual' | 'single-shot' | 'continuous';
        zoom?: number;
      }

      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment',
          // Requesting high ideal resolution forces the browser to pick the main high-quality camera
          // rather than an ultrawide/macro lens, without enforcing strict 'min' bounds that can fail on portrait mode.
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          advanced: [
            { focusMode: 'continuous' }
          ] as AdvancedConstraint[]
        }
      };

      // Request permission explicitly to handle errors cleanly
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setHasPermission(true);
      setError(null);
      setIsScanning(true);
      
      // Stop the test stream tracks as ZXing will request its own
      stream.getTracks().forEach(track => track.stop());

      readerRef.current.decodeFromConstraints(
        constraints,
        videoElement,
        (result: Result | null) => {
          if (result) {
            const code = result.getText();
            const now = Date.now();
            
            // Throttle duplicate scans to 1 every 2 seconds
            if (code !== lastScannedCode.current || (now - lastScannedTime.current > 2000)) {
              lastScannedCode.current = code;
              lastScannedTime.current = now;
              onScanSuccess(code);
            }
          }
        }
      );
    } catch (err: unknown) {
      console.error('Camera initialization error:', err);
      setHasPermission(false);
      setIsScanning(false);
      setError('Camera access denied or no camera found.');
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
      setIsScanning(false);
    }
  }, []);

  return {
    startScanning,
    stopScanning,
    isScanning,
    error,
    hasPermission
  };
}
