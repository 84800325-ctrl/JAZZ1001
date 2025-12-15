import React, { useRef, useEffect, useState } from 'react';
import { Camera, Zap, RefreshCcw, ArrowLeft } from 'lucide-react';

interface CameraViewProps {
  onCapture: () => void;
  onReset: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState(false);
  const [resetClickCount, setResetClickCount] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera by default
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleShutter = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      onCapture();
    }, 150); // Short flash duration
  };

  const handleHiddenReset = () => {
    const newCount = resetClickCount + 1;
    setResetClickCount(newCount);
    if (newCount >= 3) {
      onReset();
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
        <Camera className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">无法访问相机</h2>
        <p className="text-gray-400">请允许相机权限以使用魔法快门。</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-75 ${flash ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Video Feed */}
      <div className="flex-1 relative rounded-b-3xl overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Fake Camera UI Overlays */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent z-10">
            {/* Added Visible Back Button */}
            <button 
              onClick={onReset}
              className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm active:bg-black/40"
            >
               <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-mono text-white backdrop-blur-sm">高清 30帧</div>
              <Zap className="text-white w-6 h-6 opacity-80" />
            </div>
        </div>

        {/* Focus Box Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/30 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400/80"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400/80"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400/80"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400/80"></div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="h-32 bg-black flex items-center justify-between px-8 pb-4 pt-2">
        {/* Gallery Button (Also hidden reset just in case) */}
        <button 
          onClick={handleHiddenReset}
          className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center active:bg-gray-700 transition-colors"
        >
          {/* Looks like a gallery preview */}
           <div className="w-full h-full bg-gradient-to-tr from-gray-700 to-gray-600 rounded-lg opacity-50"></div>
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleShutter}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition-transform"
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </button>

        {/* Flip Camera (Visual Only) */}
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50">
          <RefreshCcw className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
};