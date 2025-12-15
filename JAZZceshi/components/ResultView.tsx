import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { analyzeSecretImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface ResultViewProps {
  image: string;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ image, onBack }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      try {
        const result = await analyzeSecretImage(image);
        if (isMounted) {
          setAnalysis(result);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
           // Fallback if API fails
           setAnalysis({ title: "魔法揭示", description: "图片已成功替换。" });
           setLoading(false);
        }
      }
    };
    fetchAnalysis();

    return () => { isMounted = false; };
  }, [image]);

  const handleShare = async () => {
    if (!analysis) return;
    
    const shareData = {
      title: analysis.title,
      text: `魔法相机捕捉到了：${analysis.title}\n"${analysis.description}"\n\n试试这个：${window.location.href}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        // Try to share just text first as it is most reliable on web
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share error or cancelled');
      }
    } else {
      alert('截图分享给你的朋友吧！');
    }
  };

  return (
    <div className="relative h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold text-white/90 tracking-wide text-sm uppercase">魔法画廊</span>
        <button 
          onClick={handleShare}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-purple-600/50 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 overflow-hidden relative">
        <img 
          src={image} 
          alt="Captured" 
          className="w-full h-full object-contain"
        />
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-md rounded-full flex items-center gap-3 border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
            <span className="text-white text-sm font-medium animate-pulse">正在分析灵气...</span>
          </div>
        )}
      </div>

      {/* Analysis Card */}
      {!loading && analysis && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-5 shadow-2xl transform transition-all duration-500 translate-y-0 opacity-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-900/50 rounded-xl border border-purple-500/30">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{analysis.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};