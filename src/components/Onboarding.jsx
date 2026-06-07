import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(1);
  const [answers, setAnswers] = useState({
    q1: null,
    q2: [],
    q3: null,
    q4: null,
    q5: null
  });
  const [isSaving, setIsSaving] = useState(false);

  const questions = [
    {
      id: 'q1',
      title: t('onboarding.q1.title'),
      subtitle: t('onboarding.q1.subtitle'),
      type: 'single',
      options: t('onboarding.q1.options', { returnObjects: true })
    },
    {
      id: 'q2',
      title: t('onboarding.q2.title'),
      subtitle: t('onboarding.q2.subtitle'),
      type: 'multiple',
      options: t('onboarding.q2.options', { returnObjects: true })
    },
    {
      id: 'q3',
      title: t('onboarding.q3.title'),
      subtitle: t('onboarding.q3.subtitle'),
      type: 'single',
      options: t('onboarding.q3.options', { returnObjects: true })
    },
    {
      id: 'q4',
      title: t('onboarding.q4.title'),
      subtitle: t('onboarding.q4.subtitle'),
      type: 'single',
      options: t('onboarding.q4.options', { returnObjects: true })
    },
    {
      id: 'q5',
      title: t('onboarding.q5.title'),
      subtitle: t('onboarding.q5.subtitle'),
      type: 'single',
      options: t('onboarding.q5.options', { returnObjects: true })
    }
  ];

  const currentQ = questions[step - 1];
  const currentAnswer = answers[currentQ.id];
  const canContinue = currentQ.type === 'single' ? currentAnswer !== null : (currentAnswer && currentAnswer.length > 0);

  const letters = ['A', 'B', 'C', 'D', 'E'];

  const handleSelect = (option) => {
    if (currentQ.type === 'single') {
      setAnswers({ ...answers, [currentQ.id]: option });
      // Auto advance for single choice
      setTimeout(() => {
        handleNext();
      }, 400);
    } else {
      const isSelected = currentAnswer && currentAnswer.includes(option);
      const newAns = isSelected 
        ? currentAnswer.filter(item => item !== option)
        : [...(currentAnswer || []), option];
      setAnswers({ ...answers, [currentQ.id]: newAns });
    }
  };

  const handleNext = async () => {
    if (step < questions.length) {
      setStep(step + 1);
      setFadeKey(prev => prev + 1);
    } else {
      const userId = localStorage.getItem('praana_userId');
      if (userId) {
        setIsSaving(true);
        try {
          const { doc, setDoc } = await import('firebase/firestore');
          const { db } = await import('../firebase');
          await setDoc(doc(db, 'users', userId), {
            onboarding: answers,
            profileGenerated: false,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error("Failed to save onboarding data:", error);
        }
        setIsSaving(false);
      }
      navigate('/home'); 
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setFadeKey(prev => prev + 1);
    } else {
      navigate(-1);
    }
  };

  // Listen for Enter key to continue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && canContinue) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, canContinue]);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-on-surface font-body-md selection:bg-surface-herbal flex flex-col items-center">
      
      {/* Top Progress Bar */}
      <div className="w-full h-1.5 bg-surface-container-high">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${(step / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center p-6 md:p-10">
        <button 
          onClick={handleBack} 
          className="p-2 -ml-2 rounded-full hover:bg-surface-mint transition-colors text-on-surface-variant"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => navigate('/home')} 
          className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          {t('onboarding.skip')}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl px-6 flex flex-col justify-center pb-32">
        
        {/* Animated Wrapper for smooth step transitions */}
        <div key={fadeKey} className="animate-fade-in-up">
          
          <div className="mb-10 space-y-3">
            <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold tracking-tight">
              {currentQ.title}
            </h1>
            <p className="font-body-md text-lg text-on-surface-variant/80 italic">
              {currentQ.subtitle}
              {currentQ.type === 'multiple' && <span className="block mt-1 text-sm font-semibold text-primary/60 not-italic">{t('onboarding.chooseAllThatApply')}</span>}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentQ.type === 'single' 
                ? currentAnswer === opt 
                : currentAnswer && currentAnswer.includes(opt);
                
              return (
                <button 
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-primary bg-surface-mint/50 shadow-[0_4px_16px_rgba(13,46,25,0.06)] scale-[1.01]' 
                      : 'border-border-dusty/20 bg-white hover:border-primary/40 hover:bg-[#faf9f5] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-herbal/50 group-hover:text-primary'
                    }`}>
                      {letters[idx]}
                    </div>
                    <span className={`text-base md:text-lg font-medium transition-colors ${
                      isSelected ? 'text-primary font-semibold' : 'text-on-surface'
                    }`}>
                      {opt}
                    </span>
                  </div>
                  
                  <div className={`transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                    <CheckCircle2 size={24} className="text-primary" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex items-center gap-4">
            <button 
              onClick={handleNext}
              disabled={!canContinue || isSaving}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                canContinue 
                  ? 'bg-primary text-white shadow-md hover:bg-[#0a2313] hover:shadow-lg active:scale-95' 
                  : 'bg-surface-container text-outline cursor-not-allowed'
              }`}
            >
              {isSaving ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
              {isSaving ? t('onboarding.saving') : t('onboarding.continue')}
            </button>
            {canContinue && (
              <span className="hidden md:inline text-sm text-on-surface-variant font-medium animate-pulse">
                {t('onboarding.pressEnter')}
              </span>
            )}
          </div>
          
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
