import React, { useState, useEffect } from 'react';

export default function Focus() {
  const [activeMindStates, setActiveMindStates] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [timerDuration, setTimerDuration] = useState(25); // initial selected minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // time left in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);

  const statusMessages = [
      "Your attention is settling.",
      "Stay with what matters.",
      "The breath is your anchor.",
      "Gentle awareness only.",
      "Presence over performance."
  ];

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
          <div className="text-label-md font-label-md text-outline">Active Focus</div>
        </header>
        
        <main className="flex-grow flex flex-col items-center justify-center relative px-margin-mobile overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="breathing-bg w-[150%] h-[150%] rounded-full bg-gradient-to-tr from-surface-mint via-surface-bright to-surface-herbal blur-3xl opacity-30"></div>
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
                  Take a deep breath. The world can wait for a few moments.
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
              End Session
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
    <div className="bg-background text-on-surface font-body-md selection:bg-surface-herbal min-h-screen pb-24">
      <header className="w-full top-0 z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md bg-surface dark:bg-surface-dim transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary dark:text-inverse-primary">spa</span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-tertiary-fixed-dim">Praana</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-mint dark:hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-outline">account_circle</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-margin-mobile pt-lg space-y-xl">
        <header className="text-center space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-primary">Focus</h2>
          <p className="font-body-md text-on-surface-variant italic">Protect your attention intentionally.</p>
        </header>

        <section className="space-y-md">
          <h3 className="font-title-lg text-title-lg text-on-background">How does your mind feel right now?</h3>
          <div className="flex flex-wrap gap-sm">
            {['Restless', 'Distracted', 'Calm', 'Mentally Heavy', 'Focused'].map(state => {
              const isActive = activeMindStates.includes(state);
              return (
                <button 
                  key={state}
                  onClick={() => toggleMindState(state)}
                  className={`px-md py-sm rounded-full border text-label-md font-label-md transition-colors ${
                    isActive ? 'bg-[#24452d] text-[#aad0af] border-transparent' : 'border-border-dusty bg-surface hover:bg-surface-mint text-on-surface'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-md">
          <h3 className="font-title-lg text-title-lg text-on-background">What deserves your attention right now?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {focusOptions.map(option => {
              const isActive = selectedFocus === option.id;
              return (
                <div 
                  key={option.id}
                  onClick={() => setSelectedFocus(option.id)}
                  className={`cursor-pointer p-md rounded-xl border transition-all flex flex-col items-center gap-sm text-center ${
                    isActive ? 'bg-secondary-container border-primary' : 'bg-surface-mint border-transparent hover:border-border-dusty'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[32px]">{option.icon}</span>
                  <span className="font-label-md text-label-md">{option.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col items-center space-y-lg py-xl bg-surface-herbal/20 rounded-[32px] border border-outline-variant/30">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle className="text-outline-variant/20" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="4"></circle>
              <circle 
                className="text-primary transition-all duration-[1000ms] ease-linear" 
                cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" 
                strokeDasharray="691" 
                strokeDashoffset="0" 
                strokeLinecap="round" strokeWidth="4"
              ></circle>
            </svg>
            <div className="text-center">
              <span className="font-display-lg text-display-lg text-primary tracking-tight">
                {timerDuration}:00
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mt-1">minutes</p>
            </div>
          </div>
          <div className="flex gap-sm">
            {[25, 45, 60].map(mins => {
              const isActive = timerDuration === mins;
              return (
                <button 
                  key={mins}
                  onClick={() => setTimerDuration(mins)}
                  className={`px-lg py-sm rounded-full border text-label-md font-label-md transition-colors ${
                    isActive ? 'bg-[#24452d] text-[#aad0af] border-transparent' : 'border-border-dusty bg-surface hover:bg-secondary-container'
                  }`}
                >
                  {mins}
                </button>
              );
            })}
            <button className="px-lg py-sm rounded-full border border-border-dusty text-label-md font-label-md bg-surface hover:bg-secondary-container transition-colors">
              Custom
            </button>
          </div>
        </section>

        <section className="space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="font-title-lg text-title-lg text-on-background">Protected From</h3>
            <span className="text-label-sm font-label-sm text-secondary uppercase">All Notifications Off</span>
          </div>
          <div className="flex flex-wrap gap-sm">
            {['Instagram', 'YouTube', 'WhatsApp', 'Facebook', 'X', 'Snapchat'].map(app => (
              <div key={app} className="flex items-center gap-2 px-md py-sm rounded-full bg-surface-container border border-outline-variant">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">block</span>
                <span className="font-label-md text-label-md">{app}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-xl pb-margin-desktop">
          <button 
            onClick={() => setIsRunning(true)}
            className="w-full py-lg rounded-xl bg-primary text-white font-title-lg text-on-primary shadow-sm hover:shadow-md hover:bg-primary-container transition-all active:scale-[0.98]"
          >
            Begin Focus Session
          </button>
        </div>
      </main>
    </div>
  );
}
