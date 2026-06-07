import React, { useState, useEffect } from 'react';

export default function InterruptionOverlay({ isOpen, onClose }) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setTimeLeft(5);
      setCanClose(false);
      
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1a3b2b]/95 backdrop-blur-xl flex flex-col items-center justify-center text-white px-6">
      <style>{`
        @keyframes overlay-breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        .animate-overlay-breathe {
          animation: overlay-breathe 4s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-surface-mint/20 rounded-full blur-3xl w-48 h-48 mx-auto -z-10 animate-overlay-breathe"></div>
        <h2 className="text-4xl font-headline-md font-bold mb-4 tracking-tight">Pause.</h2>
        <p className="text-lg text-surface-mint/80 font-medium">Take a slow breath before you continue.</p>
      </div>

      <div className="relative w-48 h-48 mb-16 flex items-center justify-center">
        {/* Breathing Circle */}
        <div className="absolute w-full h-full border-4 border-surface-mint/30 rounded-full animate-overlay-breathe"></div>
        <div className="absolute w-3/4 h-3/4 bg-surface-mint/10 rounded-full animate-overlay-breathe" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="z-10 text-6xl font-display-lg font-bold text-surface-mint drop-shadow-lg">
          {timeLeft > 0 ? timeLeft : ''}
        </div>
      </div>

      <div className={`w-full max-w-sm space-y-4 transition-all duration-1000 ${canClose ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-surface-mint text-primary rounded-2xl font-bold text-lg shadow-lg hover:bg-white transition-all active:scale-95"
        >
          Close App
        </button>
        <button 
          onClick={onClose}
          className="w-full py-4 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors"
        >
          Open Anyway (Break Streak)
        </button>
      </div>
    </div>
  );
}
