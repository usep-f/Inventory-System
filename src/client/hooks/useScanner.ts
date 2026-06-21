import { useEffect, useRef, useCallback, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface AdvancedConstraint extends MediaTrackConstraintSet {
  focusMode?: 'none' | 'manual' | 'single-shot' | 'continuous';
  zoom?: number;
}

interface ZoomTrackCapabilities extends MediaTrackCapabilities {
  zoom?: {
    min: number;
    max: number;
    step: number;
  };
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: { 
    facingMode: 'environment',
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    advanced: [
      { focusMode: 'continuous' }
    ] as AdvancedConstraint[]
  }
};

export interface ZoomCapabilities {
  min: number;
  max: number;
  step: number;
}

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState<ZoomCapabilities | null>(null);
  
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  
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
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      streamRef.current = stream;
      
      const track = stream.getVideoTracks()[0];
      if (track) {
        trackRef.current = track;
        if (typeof track.getCapabilities === 'function') {
          const caps = track.getCapabilities() as ZoomTrackCapabilities;
          if (caps.zoom) {
            setZoomCapabilities({
              min: caps.zoom.min || 1,
              max: caps.zoom.max || 1,
              step: caps.zoom.step || 0.1
            });
            setZoom(caps.zoom.min || 1);
          }
        }
      }

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

  const changeZoom = useCallback(async (zoomValue: number) => {
    if (!trackRef.current) {
      setZoom(zoomValue);
      return;
    }
    try {
      if (typeof trackRef.current.getCapabilities === 'function') {
        const caps = trackRef.current.getCapabilities() as ZoomTrackCapabilities;
        if (caps.zoom) {
          const min = caps.zoom.min || 1;
          const max = caps.zoom.max || 1;
          const clamped = Math.max(min, Math.min(max, zoomValue));
          await trackRef.current.applyConstraints({
            advanced: [{ zoom: clamped } as AdvancedConstraint]
          });
          setZoom(clamped);
          return;
        }
      }
      setZoom(zoomValue);
    } catch (err) {
      console.error('Failed to apply zoom constraint:', err);
      setZoom(zoomValue);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    trackRef.current = null;
    setZoomCapabilities(null);
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
    hasPermission,
    zoom,
    zoomCapabilities,
    changeZoom
  };
}

