import React, { useState } from 'react';

export default function Focus() {
  const [activeMindStates, setActiveMindStates] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [timerDuration, setTimerDuration] = useState(25);

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

  const blockedApps = ['Instagram', 'YouTube', 'WhatsApp', 'Facebook', 'X', 'Snapchat'];

  return (
    <div className="min-h-full pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#f8f7f2]/80 backdrop-blur-xl border-b border-border-dusty/10 flex justify-between items-center w-full px-6 py-4 md:px-12 md:py-6 shadow-[0_4px_32px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex flex-col gap-0.5">
          <span className="font-headline-md text-xl md:text-2xl text-primary tracking-tight font-semibold">Focus Mode</span>
          <span className="font-label-sm text-xs md:text-sm text-on-surface-variant/80 italic font-medium">Protect your attention intentionally.</span>
        </div>
      </header>

      <main className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-6 pt-8 space-y-12 md:px-12 md:pt-10">
        
        {/* Section 1: Mind State */}
        <section className="space-y-4">
          <h3 className="font-title-lg text-lg text-on-surface font-semibold">How does your mind feel right now?</h3>
          <div className="flex flex-wrap gap-2">
            {['Restless', 'Distracted', 'Calm', 'Mentally Heavy', 'Focused'].map(state => {
              const isActive = activeMindStates.includes(state);
              return (
                <button 
                  key={state}
                  onClick={() => toggleMindState(state)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary border-primary text-surface-mint shadow-md' 
                      : 'border-border-dusty bg-white text-on-surface hover:bg-surface-mint hover:border-surface-herbal'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Intentional Focus */}
        <section className="space-y-4">
          <h3 className="font-title-lg text-lg text-on-surface font-semibold">What deserves your attention right now?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {focusOptions.map(option => {
              const isActive = selectedFocus === option.id;
              return (
                <div 
                  key={option.id}
                  onClick={() => setSelectedFocus(option.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 text-center shadow-sm ${
                    isActive 
                      ? 'bg-surface-herbal border-primary shadow-[0_4px_12px_rgba(13,46,25,0.1)] scale-[1.02]' 
                      : 'bg-white border-border-dusty/30 hover:border-border-dusty hover:shadow-md'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[32px] transition-colors ${isActive ? 'text-primary' : 'text-primary/70'}`}>
                    {option.icon}
                  </span>
                  <span className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Timer */}
        <section className="flex flex-col items-center space-y-8 py-10 bg-white rounded-3xl border border-border-dusty/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle className="text-surface-container-high" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="6"></circle>
              <circle 
                className="text-primary transition-all duration-700 ease-out" 
                cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" 
                strokeDasharray="691" 
                strokeDashoffset={691 - (timerDuration / 60) * 691} 
                strokeLinecap="round" strokeWidth="6"
              ></circle>
            </svg>
            <div className="text-center">
              <span className="font-display-lg text-5xl font-semibold text-primary tracking-tight">
                {timerDuration}:00
              </span>
              <p className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-[0.2em] mt-2">minutes</p>
            </div>
          </div>
          
          <div className="flex gap-3 bg-surface-container-low p-2 rounded-full border border-border-dusty/20">
            {[25, 45, 60].map(mins => {
              const isActive = timerDuration === mins;
              return (
                <button 
                  key={mins}
                  onClick={() => setTimerDuration(mins)}
                  className={`w-14 h-10 rounded-full font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-on-surface-variant hover:bg-surface-mint hover:text-primary'
                  }`}
                >
                  {mins}
                </button>
              );
            })}
            <button className="px-4 h-10 rounded-full font-semibold text-sm text-on-surface-variant hover:bg-surface-mint hover:text-primary transition-colors">
              Custom
            </button>
          </div>
        </section>

        {/* Section 4: Shielding */}
        <section className="space-y-4">
          <div className="flex justify-between items-center bg-surface-container-low px-4 py-3 rounded-2xl border border-border-dusty/20">
            <h3 className="font-title-lg text-sm text-on-surface font-semibold">Protected From</h3>
            <span className="text-[10px] font-bold text-white bg-error px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">All Notifications Off</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedApps.map(app => (
              <div key={app} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-outline-variant/30 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-error">block</span>
                <span className="text-xs font-semibold text-on-surface">{app}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="pt-8">
          <button className="w-full md:w-auto md:px-16 md:mx-auto md:block py-4 rounded-2xl bg-primary text-white font-semibold text-lg shadow-[0_8px_24px_rgba(13,46,25,0.25)] hover:shadow-[0_12px_32px_rgba(13,46,25,0.35)] hover:bg-[#0a2313] transition-all active:scale-[0.98]">
            Begin Focus Session
          </button>
        </div>
      </main>
    </div>
  );
}
