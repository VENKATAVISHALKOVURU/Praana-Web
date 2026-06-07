import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

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

      <main className="max-w-2xl mx-auto px-6 pt-10 space-y-12">
        <header className="space-y-2">
          <h2 className="font-headline-lg text-4xl text-primary font-bold tracking-tight">{t('focus.focusRooms')}</h2>
          <p className="font-body-md text-on-surface-variant opacity-80">{t('focus.focusQuietly')}</p>
        </header>

        {/* Setup App Limits Card */}
        <section>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-mint flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">phonelink_lock</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-xl text-primary font-bold">{t('focus.appLimits')}</h3>
                  <p className="text-sm text-on-surface-variant font-medium">{t('focus.protectAttention')}</p>
                </div>
              </div>
              <button className="bg-surface-container-low text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-surface-mint transition-colors">
                {t('focus.manage')}
              </button>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface-variant">Instagram (30m)</div>
              <div className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface-variant">Twitter (15m)</div>
              <div className="px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface-variant">YouTube (1h)</div>
            </div>
          </div>
        </section>

        {/* Focus Rooms Carousel */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl text-primary font-bold tracking-tight">{t('focus.quickFocus')}</h3>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            {focusOptions.map(option => (
              <div 
                key={option.id}
                onClick={() => {
                  setSelectedFocus(option.id);
                  setTimerDuration(25);
                  setIsRunning(true);
                }}
                className="snap-start shrink-0 w-32 cursor-pointer p-4 rounded-2xl border border-transparent bg-surface-mint/50 hover:bg-surface-mint hover:border-primary/20 transition-all flex flex-col items-center gap-3 text-center"
              >
                <span className="material-symbols-outlined text-primary text-3xl">{option.icon}</span>
                <span className="font-bold text-sm text-primary">{option.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Host a Room Card */}
        <section>
          <div 
            onClick={() => setIsRunning(true)}
            className="cursor-pointer group relative overflow-hidden rounded-3xl bg-[#1a3b2b] p-8 shadow-[0_12px_24px_rgba(26,59,43,0.15)] hover:shadow-[0_16px_32px_rgba(26,59,43,0.25)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
              <div className="absolute top-0 right-0 w-32 h-32 bg-surface-mint rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
            </div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{t('focus.hostRoom')}</h3>
                <p className="text-surface-mint/80 font-medium">{t('focus.createSpace')}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl">add</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Rooms */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl text-primary font-bold tracking-tight">{t('focus.activeRooms')}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-surface-mint px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {t('focus.liveNow')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-border-dusty/20 hover:border-primary/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white font-bold text-xs">A</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-herbal flex items-center justify-center text-primary font-bold text-xs">J</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-[10px]">+14</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50] shadow-[0_0_8px_rgba(76,175,80,0.6)] animate-pulse"></span>
                    <h4 className="font-bold text-lg text-primary">Deep Work Session</h4>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">Zen · 25m</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="w-12 h-12 rounded-xl border border-border-dusty flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button 
                  onClick={() => setIsRunning(true)}
                  className="flex-1 md:flex-none px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors shadow-sm"
                >
                  {t('focus.join')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Join by Room ID */}
        <section>
          <div className="bg-surface-container-low rounded-3xl p-6 md:p-8 border border-dashed border-border-dusty/50">
            <h3 className="text-lg text-primary font-bold mb-4">{t('focus.joinRoomId')}</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="ABC123" 
                className="flex-1 px-4 py-3 rounded-xl border border-border-dusty bg-white focus:outline-none focus:border-primary transition-colors font-medium tracking-wide uppercase"
              />
              <button className="px-8 py-3 bg-surface-mint text-primary rounded-xl font-bold hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-border-dusty/20">
                {t('focus.join')}
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
