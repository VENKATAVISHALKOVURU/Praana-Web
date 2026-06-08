import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../firebase.js';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [timeOfDay, setTimeOfDay] = useState('evening');
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('P');
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentDate, setCurrentDate] = useState('Today');
  const [insightIndex, setInsightIndex] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState(0);
  
  // App usage state (simulated for demo purposes based on prompt)
  const [mounted, setMounted] = useState(false);
  
  // Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(120); // 2 minutes
  const [breathingInterval, setBreathingInterval] = useState(null);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingTimeLeft(120);
    const interval = setInterval(() => {
      setBreathingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBreathingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setBreathingInterval(interval);
  };

  const stopBreathing = () => {
    if (breathingInterval) clearInterval(breathingInterval);
    setBreathingActive(false);
    setBreathingTimeLeft(0);
  };

  const extendBreathing = () => {
    setBreathingTimeLeft((prev) => prev + 60); // Add 1 minute
  };

  useEffect(() => {
    return () => {
      if (breathingInterval) clearInterval(breathingInterval);
    };
  }, [breathingInterval]);

  useEffect(() => {
    // Trigger animations after mount
    setTimeout(() => setMounted(true), 100);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }

    // Set dynamic date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', options));

    // Set dynamic insight based on day
    const insightsCount = 6;
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setInsightIndex(dayOfYear % insightsCount);

    // Listen to Firebase auth and get real user data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhoto(user.photoURL || null);
        const name = user.displayName || user.email?.split('@')[0] || 'Friend';
        const firstName = name.split(' ')[0];
        setUserName(firstName);
        const parts = name.trim().split(' ').filter(Boolean);
        const initials = parts.length >= 2
          ? parts[0][0] + parts[1][0]
          : parts[0]?.slice(0, 2) || 'P';
        setUserInitials(initials.toUpperCase());
        localStorage.setItem('praana_userName', name);
      } else {
        const storedName = localStorage.getItem('praana_userName') || 'Friend';
        const firstName = storedName.split(' ')[0];
        setUserName(firstName);
        setUserInitials(firstName.slice(0, 2).toUpperCase());
      }
    });

    // Listen to active rooms
    const roomRef = ref(rtdb, 'rooms/global/participants');
    const unsubscribeRooms = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setActiveParticipants(Object.keys(data).length);
      } else {
        setActiveParticipants(0);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeRooms();
    };
  }, []);

  // Simulated App Data
  const appUsageData = [
    { name: 'Instagram', icon: 'photo_camera', color: 'bg-pink-500', used: 102, limit: 60 },     // Exceeded (102m / 60m)
    { name: 'YouTube', icon: 'play_arrow', color: 'bg-red-500', used: 45, limit: 50 },         // Warning (>80%) (45m / 50m)
    { name: 'Twitter', icon: 'flutter_dash', color: 'bg-blue-400', used: 20, limit: 60 },      // Safe
    { name: 'TikTok', icon: 'music_note', color: 'bg-black', used: 15, limit: null },          // No limit set
  ];

  const getProgressColor = (used, limit) => {
    if (!limit) return 'bg-surface-mint';
    const percent = (used / limit) * 100;
    if (percent >= 100) return 'bg-[#C81E1E]'; // Soft Red
    if (percent >= 80) return 'bg-orange-400';
    return 'bg-[#0D2E19]'; // Primary Deep Green
  };

  const getProgressWidth = (used, limit) => {
    if (!limit) return '0%';
    return `${Math.min((used / limit) * 100, 100)}%`;
  };

  return (
    <div className="min-h-full pb-12 relative z-10 bg-[#FCFBF7]">
      {/* 1. Header Section */}
      <header className="sticky top-0 z-40 bg-[#FCFBF7]/80 backdrop-blur-xl border-b border-border-dusty/10 flex justify-between items-center w-full px-6 py-4 md:px-12 md:py-6 transition-all">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-xl md:text-2xl text-[#0D2E19] tracking-tight font-semibold">
              Welcome back{userName ? `, ${userName}` : ''}
            </span>
          </div>
          <span className="font-label-sm text-xs md:text-sm text-[#0D2E19]/70 font-medium">
            {currentDate}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={startBreathing} className="w-10 h-10 rounded-full bg-[#C3E5B2] flex items-center justify-center text-[#0D2E19] hover:shadow-md transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
          </button>
          <Link to="/saathi" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D2E19]/70 hover:text-[#0D2E19] hover:shadow-md transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </Link>
          <Link to="/profile" className="w-11 h-11 rounded-full border-2 border-[#C3E5B2] shadow-sm hover:shadow-md transition-all duration-300 block relative group overflow-hidden">
            {userPhoto ? (
              <img
                alt="User avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={userPhoto}
                referrerPolicy="no-referrer"
                onError={() => setUserPhoto(null)}
              />
            ) : (
              <div className="w-full h-full bg-[#0D2E19] flex items-center justify-center">
                <span className="text-white text-sm font-bold tracking-wide">{userInitials}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 flex flex-col gap-8">
        
        {/* 2. AI Insight Card (The "Saathi" Summary) */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-sm border border-[#0D2E19]/5 bg-white/60 backdrop-blur-xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C3E5B2]/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex items-start gap-4 md:gap-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0D2E19] flex items-center justify-center text-[#C3E5B2] shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg md:text-xl text-[#0D2E19] tracking-tight">Saathi's Insight</h3>
              <p className="text-sm md:text-base font-medium text-[#0D2E19]/80 leading-relaxed max-w-3xl">
                Your screen time is down 20% compared to yesterday. You are successfully maintaining your boundaries. Keep up the momentum!
              </p>
            </div>
          </div>
        </section>

        {/* 3. Key Stats Grid (4 Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-[#0D2E19]/5 hover:border-[#0D2E19]/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="uppercase text-[10px] font-bold tracking-widest text-[#0D2E19]/50">Current Streak</span>
              <span className="material-symbols-outlined text-[#0D2E19]/30 group-hover:text-[#0D2E19] transition-colors">local_fire_department</span>
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-display text-[#0D2E19] font-bold">12 Days</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <Link to="/rooms" className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-[#0D2E19]/5 hover:border-[#0D2E19]/10 hover:-translate-y-1 hover:bg-[#C3E5B2]/10 transition-all duration-300 group flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="uppercase text-[10px] font-bold tracking-widest text-[#0D2E19]/50">Focus Sessions</span>
              <span className="material-symbols-outlined text-[#0D2E19]/30 group-hover:text-[#0D2E19] transition-colors">group_work</span>
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-display text-[#0D2E19] font-bold">{activeParticipants > 0 ? activeParticipants : '3'}</span>
            </div>
          </Link>
          
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-[#0D2E19]/5 hover:border-[#0D2E19]/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="uppercase text-[10px] font-bold tracking-widest text-[#0D2E19]/50">Screen Time</span>
              <span className="material-symbols-outlined text-[#0D2E19]/30 group-hover:text-[#0D2E19] transition-colors">smartphone</span>
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-display text-[#0D2E19] font-bold">2h 45m</span>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-[#0D2E19]/5 hover:border-[#0D2E19]/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="uppercase text-[10px] font-bold tracking-widest text-[#0D2E19]/50">Interruptions</span>
              <span className="material-symbols-outlined text-[#0D2E19]/30 group-hover:text-[#C81E1E] transition-colors">notifications_paused</span>
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-display text-[#0D2E19] font-bold">8</span>
            </div>
          </div>
        </section>

        {/* 4. App Usage & Time Limits (Progress Bars) */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#0D2E19]/5">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0D2E19] tracking-tight">App Daily Limits</h2>
            <span className="text-xs font-bold bg-[#C3E5B2]/30 text-[#0D2E19] px-3 py-1.5 rounded-full">Today</span>
          </div>
          
          <div className="space-y-6">
            {appUsageData.map((app, idx) => (
              <div key={idx} className="flex flex-col gap-2 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${app.color} flex items-center justify-center text-white shadow-sm`}>
                      <span className="material-symbols-outlined text-[16px]">{app.icon}</span>
                    </div>
                    <span className="font-semibold text-[#0D2E19]">{app.name}</span>
                  </div>
                  
                  {app.limit ? (
                    <div className="text-sm font-medium">
                      <span className={getProgressColor(app.used, app.limit).replace('bg-', 'text-')}>{app.used}m</span>
                      <span className="text-[#0D2E19]/40"> / {app.limit}m</span>
                    </div>
                  ) : (
                    <button className="text-xs font-bold text-[#0D2E19]/60 hover:text-[#0D2E19] bg-[#FCFBF7] hover:bg-[#C3E5B2]/30 px-3 py-1 rounded-lg border border-[#0D2E19]/10 transition-colors">
                      + Set Limit
                    </button>
                  )}
                </div>
                
                {app.limit && (
                  <div className="w-full h-2.5 bg-[#FCFBF7] rounded-full overflow-hidden shadow-inner relative">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(app.used, app.limit)}`}
                      style={{ width: mounted ? getProgressWidth(app.used, app.limit) : '0%' }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Full-Screen Breathing Overlay */}
      {breathingActive && (
        <div className="fixed inset-0 z-50 bg-[#1a3821]/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-8 right-8 z-20 flex gap-4">
            <button 
              onClick={extendBreathing}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-colors flex items-center gap-2 border border-white/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              1 Min
            </button>
            <button 
              onClick={stopBreathing}
              className="bg-white hover:bg-gray-100 text-primary px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Stop
            </button>
          </div>

          <style>{`
            @keyframes breathe-circle-full {
              0%, 10% { transform: scale(0.6); opacity: 0.3; }
              30%, 40% { transform: scale(1.4); opacity: 0.8; }
              60%, 70% { transform: scale(0.6); opacity: 0.3; }
              100% { transform: scale(0.6); opacity: 0.3; }
            }
            @keyframes breathe-text-full {
              0%, 10% { opacity: 0; transform: translateY(10px); }
              20%, 35% { opacity: 1; transform: translateY(0); content: "Inhale"; }
              45%, 55% { opacity: 0; transform: translateY(-10px); }
              65%, 80% { opacity: 1; transform: translateY(0); content: "Exhale"; }
              90%, 100% { opacity: 0; transform: translateY(10px); }
            }
            .breathing-orb-full {
              animation: breathe-circle-full 8s infinite ease-in-out;
            }
            .inhale-exhale-text-full::after {
              content: "Breathe";
              animation: breathe-text-full 8s infinite ease-in-out;
            }
          `}</style>
          
          <div className="relative w-64 h-64 flex items-center justify-center z-10 mb-12">
            <div className="absolute inset-0 bg-[#C3E5B2] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C3E5B2] to-[#e6f4e1] rounded-full breathing-orb-full shadow-[0_0_80px_rgba(195,229,178,0.5)]"></div>
            <div className="relative text-[#0D2E19] font-display text-4xl bg-white/90 backdrop-blur-md w-32 h-32 rounded-full flex items-center justify-center shadow-inner font-bold tracking-tight">
              {Math.floor(breathingTimeLeft / 60)}:{(breathingTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="inhale-exhale-text-full font-display-lg text-5xl text-[#C3E5B2] tracking-tight font-semibold drop-shadow-md z-10 h-12 flex items-center justify-center"></div>
        </div>
      )}
    </div>
  );
}
