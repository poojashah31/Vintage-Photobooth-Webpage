import { useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw, ArrowLeft, Upload } from 'lucide-react';
import { LayoutType, CapturedImage } from '../App';

interface CameraPageProps {
  layout: LayoutType;
  onComplete: (images: CapturedImage[]) => void;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  onBack: () => void;
}

const filters = [
  { name: 'none', label: 'Original', css: 'none' },
  { name: 'sepia', label: 'Sepia', css: 'sepia(80%)' },
  { name: 'grayscale', label: 'B&W', css: 'grayscale(100%)' },
  { name: 'vintage', label: 'Vintage', css: 'sepia(50%) contrast(1.2) brightness(0.9)' },
  { name: 'warm', label: 'Warm', css: 'sepia(30%) saturate(1.4) hue-rotate(-10deg)' },
  { name: 'faded', label: 'Faded', css: 'contrast(0.85) brightness(1.1) saturate(0.7)' },
];

export function CameraPage({ layout, onComplete, currentFilter, setCurrentFilter, onBack }: CameraPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [permissionState, setPermissionState] = useState<string>('prompt');

  // Phase 5: validate captured array length matches layout (A=3, B=4, C=2)
  const requiredPhotos = layout === 'A' ? 3 : layout === 'B' ? 4 : 2;

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Check if Permissions API is available (Chrome, Edge; not Safari iOS)
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionState(permissionStatus.state);

        // Listen for permission changes (e.g. user enables in settings)
        permissionStatus.onchange = () => {
          setPermissionState(permissionStatus.state);
          if (permissionStatus.state === 'granted') {
            startCamera();
          }
        };

        if (permissionStatus.state === 'granted') {
          startCamera();
        } else if (permissionStatus.state === 'prompt') {
          startCamera(); // Will trigger browser prompt
        } else {
          // Permission denied — show fallback immediately
          setCameraError(
            'Camera access was previously blocked. Please update your browser permissions.|||' +
            '⚠️ You need to manually enable camera access in your browser settings',
          );
        }
      } else {
        // Permissions API not available (Safari iOS) — try directly
        startCamera();
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      startCamera(); // Fallback to direct camera access
    }
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      // Front-facing camera auto-selected on mobile via facingMode: 'user'
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 960 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: unknown) {
      console.error('Error accessing camera:', err);

      let errorMessage = '';
      let errorTip = '';

      const error = err as { name?: string };

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission was denied. Allow access or upload photos instead.';
        errorTip =
          window.location.protocol !== 'https:' && window.location.hostname !== 'localhost'
            ? '⚠️ Camera access requires HTTPS. This site must use a secure connection.'
            : '💡 Look for the camera icon in your browser\'s address bar and click "Allow"';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device. Upload photos instead.';
        errorTip = '💡 Make sure your device has a working camera, or use the upload option below';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
        errorTip = '💡 Close other tabs or video apps, then try again — or upload photos instead';
      } else if (error.name === 'OverconstrainedError') {
        // Try again with basic constraints before showing error
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(basicStream);
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
          return;
        } catch {
          errorMessage = 'Camera does not support the required settings.';
          errorTip = '💡 Your camera may not be compatible — upload photos instead';
        }
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Camera access is blocked for security reasons.';
        errorTip = '⚠️ Please use HTTPS or access from localhost';
      } else {
        errorMessage = 'Unable to access camera. Please check your settings and try again.';
        errorTip = '💡 Make sure camera permissions are enabled, or upload photos instead';
      }

      setCameraError(errorMessage + '|||' + errorTip);
    }
  };

  const capturePhoto = () => {
    if (countdown !== null) return;

    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          takePhoto();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply selected filter to canvas context
    const filterStyle = filters.find(f => f.name === currentFilter)?.css || 'none';
    context.filter = filterStyle;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    const newImages = [...capturedImages, { url: imageUrl, filter: currentFilter }];
    setCapturedImages(newImages);

    // Auto-advance to ResultsPage once the required count is reached
    if (newImages.length === requiredPhotos) {
      setTimeout(() => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        onComplete(newImages);
      }, 500);
    }
  };

  // File upload fallback — accepts JPG/PNG, applies current filter label
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = requiredPhotos - capturedImages.length;
    const toProcess = files.slice(0, remaining);

    const readers = toProcess.map(
      file =>
        new Promise<CapturedImage>(resolve => {
          const reader = new FileReader();
          reader.onload = ev => {
            resolve({ url: ev.target?.result as string, filter: currentFilter });
          };
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then(newUploads => {
      const allImages = [...capturedImages, ...newUploads];
      const trimmed = allImages.slice(0, requiredPhotos);
      setCapturedImages(trimmed);
      if (trimmed.length === requiredPhotos) {
        setTimeout(() => onComplete(trimmed), 300);
      }
    });

    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  const clearPhotos = () => {
    setCapturedImages([]);
  };

  const currentFilterStyle = filters.find(f => f.name === currentFilter)?.css || 'none';

  return (
    <div className="min-h-screen bg-[#f5e6d3] flex relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-4 top-4 md:left-8 md:top-8 w-12 h-12 bg-[#8b4513] text-[#f5e6d3] rounded-full
                   flex items-center justify-center hover:bg-[#654321] transition-all duration-300
                   shadow-lg hover:scale-110 z-20"
        aria-label="Back to layout selection"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Filter sidebar */}
      <div className="w-24 bg-[#d4a574] border-r-4 border-[#8b4513] flex flex-col items-center pt-20 pb-8 gap-4">
        <div
          className="text-[#8b4513] font-serif mb-4 whitespace-nowrap text-sm tracking-wider"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          FILTERS
        </div>

        <div className="flex flex-col gap-3 items-center flex-1">
          {filters.map(filter => (
            <button
              key={filter.name}
              onClick={() => setCurrentFilter(filter.name)}
              className={`w-16 h-16 border-2 rounded-full transition-all duration-300
                         ${currentFilter === filter.name
                  ? 'border-[#8b4513] bg-white scale-110'
                  : 'border-[#a0826d] bg-[#f5e6d3] hover:scale-105'}`}
              title={filter.label}
              aria-label={`Apply ${filter.label} filter`}
              aria-pressed={currentFilter === filter.name}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-xs font-serif text-[#8b4513]"
                style={{ filter: filter.css }}
              >
                {filter.label.substring(0, 3)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-4xl text-[#8b4513] font-serif mb-2">Say Cheese!</h2>
            <p className="text-[#a0826d] font-serif">
              Photo {Math.min(capturedImages.length + 1, requiredPhotos)} of {requiredPhotos}
            </p>
          </div>

          {/* Camera viewfinder */}
          <div className="relative mb-8 mx-auto max-w-2xl">
            <div className="border-8 border-[#8b4513] bg-black shadow-2xl relative overflow-hidden">

              {/* ── Camera error / fallback panel ── */}
              {cameraError && (
                <div className="absolute inset-0 bg-[#8b4513] z-10 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
                  <div className="text-[#f5e6d3] text-6xl mb-4">📷</div>
                  <h3 className="text-2xl text-[#f5e6d3] font-serif mb-3">Camera Access Required</h3>
                  <p className="text-[#f5e6d3] font-serif text-base mb-4 max-w-md leading-relaxed">
                    {cameraError.split('|||')[0]}
                  </p>

                  <div className="bg-white bg-opacity-20 rounded-2xl p-4 mb-5 max-w-md border border-white border-opacity-30 w-full">
                    <p className="text-white font-serif text-sm mb-3">{cameraError.split('|||')[1]}</p>
                    <div className="text-left text-white text-sm font-serif space-y-1 mt-3 border-t border-white border-opacity-40 pt-3">
                      <p className="font-bold">How to allow camera access:</p>
                      <p>• <strong>Chrome/Edge:</strong> Camera icon 🎥 in address bar → Allow</p>
                      <p>• <strong>Firefox:</strong> Lock icon 🔒 → Permissions → Camera → Allow</p>
                      <p>• <strong>Safari:</strong> Safari → Settings for This Website → Camera → Allow</p>
                    </div>
                  </div>

                  {/* Primary: retry camera */}
                  <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-[#f5e6d3] text-[#8b4513] font-serif text-base border-4 border-[#f5e6d3]
                               hover:bg-white hover:scale-105 transition-all duration-300 rounded-2xl shadow-lg mb-3"
                  >
                    ✓ I've Allowed Access — Try Again
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-1 w-full max-w-xs">
                    <div className="flex-1 h-px bg-white bg-opacity-40" />
                    <span className="text-white font-serif text-sm">or</span>
                    <div className="flex-1 h-px bg-white bg-opacity-40" />
                  </div>

                  {/* Fallback: file upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    className="hidden"
                    aria-label="Upload photos from your device"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-white bg-opacity-20 text-white font-serif text-base border-2 border-white border-opacity-60
                               hover:bg-opacity-30 hover:scale-105 transition-all duration-300 rounded-2xl
                               flex items-center gap-2 mb-3"
                    aria-label="Upload photos from device as camera fallback"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Photos Instead
                  </button>

                  <button
                    onClick={onBack}
                    className="mt-1 px-6 py-2 text-[#f5e6d3] font-serif text-sm hover:underline transition-all duration-300"
                  >
                    ← Go Back
                  </button>
                </div>
              )}

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div
                    className="text-white text-9xl font-serif drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                    style={{
                      animation: 'pulse 1s ease-in-out',
                      textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    {countdown}
                  </div>
                </div>
              )}

              {/* Live camera feed — scaleX(-1) mirrors for natural selfie orientation */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover"
                style={{ filter: currentFilterStyle, transform: 'scaleX(-1)' }}
                aria-label="Camera preview"
              />

              {/* Viewfinder crosshair overlay */}
              <div className="absolute inset-0 border-4 border-white opacity-20 pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white opacity-20 pointer-events-none" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-20 pointer-events-none" />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Controls — only shown when camera is active */}
          {!cameraError && (
            <div className="flex items-center justify-center gap-6">
              {capturedImages.length > 0 && (
                <button
                  onClick={clearPhotos}
                  className="px-6 py-3 bg-[#a0826d] text-white font-serif border-2 border-[#8b4513]
                             hover:bg-[#8b6f47] transition-all duration-300 flex items-center gap-2 rounded-2xl"
                  disabled={countdown !== null}
                  aria-label="Reset all captured photos"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              )}

              <button
                onClick={capturePhoto}
                disabled={countdown !== null}
                className="px-12 py-4 bg-[#8b4513] text-[#f5e6d3] text-xl font-serif
                           border-4 border-[#654321] shadow-lg hover:bg-[#a0522d]
                           transition-all duration-300 hover:scale-105 active:scale-95
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-3 rounded-full"
                aria-label={countdown !== null ? 'Taking photo, please wait' : 'Capture photo with countdown'}
              >
                <Camera className="w-6 h-6" />
                {countdown !== null ? 'Taking Photo...' : 'Capture'}
              </button>
            </div>
          )}

          {/* Upload file button — always visible as secondary option (even when camera works) */}
          {!cameraError && (
            <div className="flex justify-center mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                aria-label="Upload photos from your device"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 text-[#a0826d] font-serif text-sm border border-[#a0826d] rounded-xl
                           hover:bg-[#d4a574] hover:text-[#8b4513] transition-all duration-200
                           flex items-center gap-2"
                aria-label="Upload photos from device instead of using camera"
              >
                <Upload className="w-4 h-4" />
                Upload Photos Instead
              </button>
            </div>
          )}

          {/* Thumbnail preview strip */}
          {capturedImages.length > 0 && (
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              {capturedImages.map((img, idx) => (
                <div key={idx} className="border-4 border-[#8b4513] bg-white p-2 shadow-lg">
                  <img
                    src={img.url}
                    alt={`Captured photo ${idx + 1}`}
                    className="w-24 h-18 object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}