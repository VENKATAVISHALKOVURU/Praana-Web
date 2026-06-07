import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function BreathingOrb3D() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // 8-second breathing cycle (match the CSS animation duration)
      // Math.sin(time) goes from -1 to 1.
      const t = state.clock.getElapsedTime();
      const cycle = Math.sin((t * Math.PI * 2) / 8); 
      
      // Scale between 2.0 and 2.2
      const scale = 2.0 + cycle * 0.1;
      meshRef.current.scale.setScalar(scale);
      
      // Slow rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} visible args={[1, 64, 64]} scale={2.0}>
      <MeshDistortMaterial
        color="#c3e5b2"
        attach="material"
        distort={0.4}
        speed={1.0}
        roughness={0.5}
        transparent
        opacity={0.3}
      />
    </Sphere>
  );
}

export default function Focus() {
  const { t } = useTranslation();
  const [activeMindStates, setActiveMindStates] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [timerDuration, setTimerDuration] = useState(25); // initial selected minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // time left in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
  const navigate = useNavigate();

  const statusMessages = t('focus.statusMessages', { returnObjects: true }) || [];

  useEffect(() => {
    // Reset time left when duration selection changes and timer is not running
    if (!isRunning) {
      setTimeLeft(timerDuration * 60);
    }
  }, [timerDuration, isRunning]);

  useEffect(() => {
    let interval = null;
    let messageInterval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      messageInterval = setInterval(() => {
        setStatusMessageIndex(prev => (prev + 1) % statusMessages.length);
      }, 15000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      clearInterval(interval);
      clearInterval(messageInterval);
    }
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [isRunning, timeLeft, statusMessages.length]);

  const toggleMindState = (state) => {
    setActiveMindStates(prev => 
      prev.includes(state) 
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  const focusOptions = [
    { id: 'reading', icon: 'menu_book', label: 'Reading' },
    { id: 'studying', icon: 'school', label: 'Studying' },
    { id: 'deep_work', icon: 'terminal', label: 'Deep Work' },
    { id: 'creative', icon: 'palette', label: 'Creative Work' },
    { id: 'thinking', icon: 'self_improvement', label: 'Quiet Thinking' },
  ];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = timerDuration * 60;
  const progress = totalSeconds > 0 ? (timeLeft / totalSeconds) : 0;
  const strokeDashoffset = 691 - (progress * 691); // 691 is circumference (2 * pi * 110)

  // ----------------------------------------------------------------------
  // VIEW: ACTIVE FOCUS SESSION
  // ----------------------------------------------------------------------
  if (isRunning) {
    return (
      <div className="bg-surface text-on-surface font-body-md overflow-hidden h-screen flex flex-col relative z-50">
        <style>{`
          @keyframes breathe {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.1); opacity: 0.6; }
          }
          .breathing-bg {
              animation: breathe 8s ease-in-out infinite;
          }
          .timer-glow {
              text-shadow: 0 0 40px rgba(13, 46, 25, 0.05);
          }
        `}</style>
        
        <header className="w-full top-0 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">Praana</span>
          </div>
          <div className="text-label-md font-label-md text-outline">{t('focus.activeFocus')}</div>
        </header>
        
        <main className="flex-grow flex flex-col items-center justify-center relative px-margin-mobile overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[0, 5, 5]} intensity={1} />
              <BreathingOrb3D />
            </Canvas>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            <div className="mb-xl opacity-60">
              <span className="material-symbols-outlined text-[48px] text-primary">adjust</span>
            </div>
            
            <div className="font-display-lg text-[80px] md:text-[120px] leading-none font-bold text-primary timer-glow tracking-tighter mb-lg transition-all">
              {formatTime(timeLeft)}
            </div>
            
            <div className="space-y-sm min-h-[80px]">
              <h2 className="font-headline-md text-headline-md text-on-surface-variant transition-opacity duration-1000">
                  {statusMessages[statusMessageIndex]}
              </h2>
              <p className="font-body-md text-outline max-w-[280px] mx-auto">
                  {t('focus.deepBreath')}
              </p>
            </div>
            
            <div className="mt-xl flex gap-unit">
              <div className="h-1 w-8 rounded-full bg-primary/20 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${progress * 100}%` }}
                ></div>
              </div>
              <div className="h-1 w-8 rounded-full bg-primary/10"></div>
              <div className="h-1 w-8 rounded-full bg-primary/10"></div>
            </div>
          </div>
          
          <div className="absolute bottom-12 w-full flex justify-center px-margin-mobile">
            <button 
              onClick={() => setIsRunning(false)}
              className="px-lg py-md border border-border-dusty rounded-xl text-on-surface-variant font-label-md hover:bg-surface-variant/50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              {t('focus.endSession')}
            </button>
          </div>
        </main>
        
        <div className="fixed bottom-0 right-0 p-margin-desktop hidden md:block opacity-10 pointer-events-none">
          <img alt="Abstract botanical texture" className="w-64 h-64 object-contain grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNJQkM7Sq2unvDdN2jHpaGm1MNoqc5mgI87cvDDqcNJGBubUUDb-jhXg381Rov5nQ4P_f4Nm3fAO3BY-Gq_KFDUXBHuwt2-K28JlfoguAcGb0nAYbLbRdSE_0Im5yOKiQdW7f-01blAkZNOW6jecTeHW-6FRG8AhSQ60nLgp8Wm1omjgNCCW0plNDdK5xc0UMJV11NG3TRrkOUlK6DnF0sBNJaEw5JAjdoScr8Zmoj67IBQWsw-0r9bCw55itOAZ40i8fh8MgAorA" />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: FOCUS SETUP
  // ----------------------------------------------------------------------
  return (
    <div className="bg-[#f8f7f2] text-[#1b1c15] font-body-md selection:bg-surface-herbal min-h-screen pb-24">
      <header className="w-full top-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-white/80 backdrop-blur-xl border-b border-border-dusty/10 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">bubble_chart</span>
          </div>
          <h1 className="font-headline-md text-2xl font-bold text-primary">Praana</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20 space-y-12">
        <header className="space-y-4 max-w-2xl">
          <h2 className="font-headline-lg text-5xl text-primary font-bold tracking-tight">{t('focus.focusRooms')}</h2>
          <p className="font-body-md text-on-surface-variant text-lg opacity-80">{t('focus.focusQuietly')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Solo Focus Card */}
          <div 
            className="group relative overflow-hidden rounded-[2rem] bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-border-dusty/20 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-mint/50 rounded-full blur-3xl translate-x-20 -translate-y-20 pointer-events-none transition-all group-hover:bg-surface-mint"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-surface-mint flex items-center justify-center mb-8 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>self_improvement</span>
              </div>
              
              <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">Solo Focus</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10 flex-1">
                Enter a deep work state completely distraction-free. Choose your focus type, set a timer, and cultivate deep presence on your own.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-bold text-primary tracking-tight text-sm uppercase">Quick Start</h4>
                <div className="flex flex-wrap gap-3">
                  {focusOptions.slice(0, 4).map(option => (
                    <button 
                      key={option.id}
                      onClick={() => {
                        setSelectedFocus(option.id);
                        setTimerDuration(25);
                        setIsRunning(true);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-border-dusty bg-surface-container-low hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 font-bold text-sm text-on-surface-variant group/btn"
                    >
                      <span className="material-symbols-outlined text-[18px] group-hover/btn:text-white">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Partner with Community Card */}
          <div 
            onClick={() => navigate('/rooms')}
            className="group relative overflow-hidden rounded-[2rem] bg-[#1a3b2b] p-10 shadow-[0_12px_24px_rgba(26,59,43,0.15)] hover:shadow-[0_24px_48px_rgba(26,59,43,0.25)] transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-mint rounded-full blur-3xl translate-x-20 -translate-y-20 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>group_work</span>
                </div>
                <div className="bg-surface-mint/20 backdrop-blur-sm border border-surface-mint/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-surface-mint animate-pulse"></span>
                  <span className="text-xs font-bold text-surface-mint tracking-wider uppercase">Live Now</span>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Partner with Community</h3>
              <p className="text-white/80 text-lg leading-relaxed mb-10 flex-1">
                Join others in real-time focus rooms. The presence of others creates accountability and shared energy, making deep work easier to sustain.
              </p>
              
              <div className="mt-auto flex items-center text-surface-mint font-bold group-hover:gap-4 gap-2 transition-all">
                <span className="text-lg">Enter Focus Rooms</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
