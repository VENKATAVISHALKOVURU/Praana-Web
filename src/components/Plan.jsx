import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Plan() {
  const [currentDay, setCurrentDay] = useState(1);
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const userId = localStorage.getItem('praana_userId');

  useEffect(() => {
    if (userId) {
      fetchPlan();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchPlan = async () => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.plan) {
          setPlan(data.plan);
          setCurrentDay(data.plan.currentDay || 1);
          setIsLoading(false);
        } else {
          // Generate plan if it doesn't exist
          generatePlan(data.onboarding);
        }
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const generatePlan = async (onboardingData) => {
    setIsGenerating(true);
    // Simulating AI generation via an API (e.g. Groq/Gemini)
    setTimeout(async () => {
      const newPlan = {
        currentDay: 1,
        missions: Array.from({ length: 21 }).map((_, index) => {
          const day = index + 1;
          let title = `Mission ${day}`;
          let desc = "Build friction into the habit loop.";
          
          if (day === 1) { title = "Acknowledge the baseline."; desc = "Observe your usage without judgment."; }
          else if (day === 2) { title = "Audit your triggers."; desc = "Identify what prompts the mindless scroll."; }
          else if (day === 3) { title = "The first boundary."; desc = "Set a physical limit on your device."; }
          else if (day === 4) { title = "Wait 5 seconds."; desc = "Friction breaks the automatic loop. Force a 5-second pause."; }
          
          return { day, title, description: desc };
        })
      };
      
      try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, { plan: newPlan, profileGenerated: true }, { merge: true });
        setPlan(newPlan);
      } catch (e) {
        console.error("Failed to save generated plan", e);
      }
      
      setIsGenerating(false);
      setIsLoading(false);
    }, 3000);
  };

  if (isLoading || isGenerating) {
    return (
      <div className="flex flex-col min-h-full bg-[#f8f7f2] items-center justify-center text-center p-6 pb-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-6">progress_activity</span>
        <h2 className="text-2xl font-headline-md font-bold text-primary tracking-tight mb-2">
          {isGenerating ? "Synthesizing your profile..." : "Loading your journey..."}
        </h2>
        <p className="text-on-surface-variant max-w-sm">
          {isGenerating ? "We are crafting a personalized 21-day psychological roadmap based on your responses." : "Preparing your space."}
        </p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col min-h-full bg-[#f8f7f2] items-center justify-center text-center p-6 pb-32">
        <p className="text-on-surface-variant mb-4">No plan found. Please complete onboarding.</p>
      </div>
    );
  }

  const todayMission = plan.missions[currentDay - 1];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f7f2] text-on-surface">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 py-6 border-b border-border-dusty/10">
        <h1 className="font-headline-md text-2xl text-primary tracking-tight font-bold">Action Plan</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1">Your 21-Day Psychological Journey</p>
      </header>
      
      <main className="flex-1 px-6 pt-6 pb-32 max-w-3xl mx-auto w-full">
        {/* Today's Mission Card */}
        <section className="mb-10">
          <div className="bg-primary text-white rounded-3xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="uppercase text-xs font-bold tracking-widest text-surface-mint/80 mb-2 block">Day {currentDay} • Today's Mission</span>
              <h2 className="text-3xl font-headline-md font-medium tracking-tight leading-tight mb-4">
                {todayMission.title}
              </h2>
              <p className="text-surface-mint/90 text-sm font-medium leading-relaxed mb-6">
                {todayMission.description}
              </p>
              <button className="bg-surface-mint text-primary font-bold px-6 py-3 rounded-full hover:bg-white transition-colors shadow-md active:scale-95">
                Complete Mission
              </button>
            </div>
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl text-primary font-bold tracking-tight">Journey Map</h3>
            <span className="text-xs font-bold uppercase tracking-widest text-outline">21 Days</span>
          </div>

          <div className="space-y-4">
            {plan.missions.map((mission) => {
              const { day, title, description } = mission;
              const isCompleted = day < currentDay;
              const isCurrent = day === currentDay;
              const isLocked = day > currentDay;

              return (
                <div 
                  key={day} 
                  className={`flex items-center p-5 rounded-2xl border transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-white border-primary/30 shadow-md transform scale-[1.02]' 
                      : isCompleted 
                        ? 'bg-surface-mint/20 border-surface-herbal/50 hover:bg-surface-mint/30' 
                        : 'bg-surface-container-low border-transparent opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                    isCurrent ? 'bg-primary text-surface-mint shadow-inner' :
                    isCompleted ? 'bg-surface-mint text-primary' :
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined font-bold">check</span>
                    ) : isLocked ? (
                      <span className="material-symbols-outlined text-sm">lock</span>
                    ) : (
                      <span className="font-bold">{day}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {isCurrent ? "Today's Focus" : isCompleted ? `Day ${day} Completed` : `Day ${day} Mission`}
                    </h4>
                    {!isLocked && (
                      <p className="text-sm text-on-surface-variant mt-1">
                        {title}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
