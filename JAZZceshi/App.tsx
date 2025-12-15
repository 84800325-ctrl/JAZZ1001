import React, { useState } from 'react';
import { SetupView } from './components/SetupView';
import { CameraView } from './components/CameraView';
import { ResultView } from './components/ResultView';
import { AppView } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SETUP);
  const [secretImage, setSecretImage] = useState<string | null>(null);

  // Helper to transition views
  const setView = (view: AppView) => setCurrentView(view);

  // 1. Setup Phase
  if (currentView === AppView.SETUP) {
    return (
      <SetupView 
        onConfirm={(image) => {
          setSecretImage(image);
          setView(AppView.CAMERA);
        }} 
      />
    );
  }

  // 2. Camera Phase
  if (currentView === AppView.CAMERA) {
    return (
      <CameraView 
        onCapture={() => setView(AppView.PROCESSING)} 
        onReset={() => {
            setSecretImage(null);
            setView(AppView.SETUP);
        }}
      />
    );
  }

  // 3. Fake Processing Phase (Transition)
  if (currentView === AppView.PROCESSING) {
    // Simulate a brief processing delay to sell the effect
    setTimeout(() => {
        setView(AppView.RESULT);
    }, 1500);

    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
             {/* Abstract magical background effect */}
            <div className="absolute inset-0 bg-purple-900/20 blur-3xl animate-pulse"></div>
            
            <div className="z-10 flex flex-col items-center">
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">处理中</h2>
                <p className="text-purple-300/70 text-sm mt-2">正在显影...</p>
            </div>
        </div>
    );
  }

  // 4. Result Phase (The Swap)
  if (currentView === AppView.RESULT && secretImage) {
    return (
      <ResultView 
        image={secretImage} 
        onBack={() => setView(AppView.CAMERA)}
      />
    );
  }

  // Fallback
  return <div className="text-white">错误: 未知状态</div>;
};

export default App;