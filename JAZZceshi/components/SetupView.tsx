import React, { useState } from 'react';
import { Camera, Upload, ArrowRight, Lock, Share2 } from 'lucide-react';

interface SetupViewProps {
  onConfirm: (image: string) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onConfirm }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '魔法恶作剧相机',
          text: '快来试试这个能拍出“灵魂”的魔法相机！🤫',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制，快去发给朋友吧！');
      } catch (err) {
        alert('请复制浏览器地址栏链接分享给朋友');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white relative">
      <button 
        onClick={handleShareApp}
        className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"
        aria-label="分享应用"
      >
        <Share2 className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">秘密设置</h1>
          <p className="text-gray-400">
            上传一张照片，拍照时它会“神奇”地出现。
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-gray-700/50 transition-all group">
            {preview ? (
              <img 
                src={preview} 
                alt="Secret" 
                className="w-full h-full object-cover rounded-xl" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">点击上传</span> 目标照片
                </p>
                <p className="text-xs text-gray-500">JPG, PNG (相册照片)</p>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <button
          onClick={() => preview && onConfirm(preview)}
          disabled={!preview}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            preview 
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/50' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          启动魔法相机
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-600">
            提示：启动后，点击界面左上角的返回键即可回到此处。
          </p>
          <div className="flex justify-center">
             <button onClick={handleShareApp} className="text-xs text-purple-400 underline">
               分享给朋友
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};