import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function Plan() {
  const { t } = useTranslation();
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
    try {
      // Initialize Gemini
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      // Assume VITE_GEMINI_API_KEY is available or use a dummy fallback just for compilation
      // Since we don't have the key in code, we will rely on env. If missing, it will throw.
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key';
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are a psychological architect specializing in digital wellbeing.
Create a customized 21-day behavioral change roadmap based on the following user onboarding data:
${JSON.stringify(onboardingData, null, 2)}

Output strictly valid JSON exactly matching this structure:
{
  "missions": [
    {
      "day": 1,
      "title": "String",
      "description": "String"
    }
  ]
}
Make sure there are exactly 21 missions. Do not output anything other than JSON.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Strip markdown code block wrappers if any
      if (text.startsWith('\`\`\`json')) text = text.substring(7);
      if (text.startsWith('\`\`\`')) text = text.substring(3);
      if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);

      const parsedPlan = JSON.parse(text);
      const newPlan = {
        currentDay: 1,
        missions: parsedPlan.missions || parsedPlan
      };
      
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { plan: newPlan, profileGenerated: true }, { merge: true });
      setPlan(newPlan);
    } catch (e) {
      console.error("Failed to save generated plan", e);
      // Fallback to dummy plan if Gemini API fails (e.g., missing API key)
      const newPlan = {
        currentDay: 1,
        missions: Array.from({ length: 21 }).map((_, index) => {
          const day = index + 1;
          let title = `Mission ${day}`;
          let desc = "Build friction into the habit loop.";
          if (day === 1) { title = "Acknowledge the baseline."; desc = "Observe your usage without judgment."; }
          else if (day === 2) { title = "Audit your triggers."; desc = "Identify what prompts the mindless scroll."; }
          return { day, title, description: desc };
        })
      };
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, { plan: newPlan, profileGenerated: true }, { merge: true });
      setPlan(newPlan);
    }
    
    setIsGenerating(false);
    setIsLoading(false);
  };

  if (isLoading || isGenerating) {
    return (
      <div className="flex flex-col min-h-full bg-[#f8f7f2] items-center justify-center text-center p-6 pb-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-6">progress_activity</span>
        <h2 className="text-2xl font-headline-md font-bold text-primary tracking-tight mb-2">
          {isGenerating ? t('plan.synthesizing') : t('plan.loading')}
        </h2>
        <p className="text-on-surface-variant max-w-sm">
          {isGenerating ? t('plan.crafting') : t('plan.preparing')}
        </p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col min-h-full bg-[#f8f7f2] items-center justify-center text-center p-6 pb-32">
        <p className="text-on-surface-variant mb-4">{t('plan.noPlan')}</p>
      </div>
    );
  }

  const todayMission = plan.missions[currentDay - 1];

  return (
    <div className="flex flex-col min-h-full bg-[#f8f7f2] text-on-surface">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 py-6 border-b border-border-dusty/10">
        <h1 className="font-headline-md text-2xl text-primary tracking-tight font-bold">{t('plan.actionPlan')}</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-1">{t('plan.journey')}</p>
      </header>
      
      <main className="flex-1 px-6 pt-6 pb-32 max-w-3xl mx-auto w-full">
        {/* Today's Mission Card */}
        <section className="mb-10">
          <div className="bg-primary text-white rounded-3xl p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="uppercase text-xs font-bold tracking-widest text-surface-mint/80 mb-2 block">{t('plan.todaysMissionLabel', { day: currentDay })}</span>
              <h2 className="text-3xl font-headline-md font-medium tracking-tight leading-tight mb-4">
                {todayMission.title}
              </h2>
              <p className="text-surface-mint/90 text-sm font-medium leading-relaxed mb-6">
                {todayMission.description}
              </p>
              <button className="bg-surface-mint text-primary font-bold px-6 py-3 rounded-full hover:bg-white transition-colors shadow-md active:scale-95">
                {t('plan.completeMission')}
              </button>
            </div>
          </div>
        </section>

        {/* Journey Map */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl text-primary font-bold tracking-tight">{t('plan.journeyMap')}</h3>
            <span className="text-xs font-bold uppercase tracking-widest text-outline">{t('plan.days21')}</span>
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
                      {isCurrent ? t('plan.todaysFocus') : isCompleted ? t('plan.dayCompleted', { day }) : t('plan.dayMission', { day })}
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
