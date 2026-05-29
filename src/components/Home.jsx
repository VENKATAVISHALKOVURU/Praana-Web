import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-full pb-12 relative z-10">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#f8f7f2]/80 backdrop-blur-xl border-b border-border-dusty/10 flex justify-between items-center w-full px-6 py-4 md:px-12 md:py-6 shadow-[0_4px_32px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex flex-col gap-0.5">
          <span className="font-headline-md text-xl md:text-2xl text-primary tracking-tight font-semibold">Good evening, Aditi</span>
          <span className="font-label-sm text-xs md:text-sm text-on-surface-variant/80 italic font-medium">Awareness grows through noticing.</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-white hover:shadow-sm hover:text-primary p-2.5 rounded-full transition-all duration-300">notifications</button>
          <Link to="/profile" className="w-11 h-11 rounded-full bg-white border-2 border-surface-herbal overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block relative group">
            <img alt="User avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgqVFkg0OY44M303BTUEQ7iFZSLAAIfdVuHWp_2QrI1DhX0knt-Vi-1BpaBT46RevIrV92T9MA2-aLoX4WoZ-4KfcH1v7Z42O1LteLPR2DM6YvsjbTdT-4CTMlEO56L_fWPcmvxiULFPcFeMo2F8kXTGsdNFrU7jn3iGrQtE7u6gyaYxJq--Wh-Q8N9KVYjKZJEKn9r9FjrseTcaQ8Vrt21Ito0xDomTzxpylB3abVSv8pnh3bQlmkRWJdSKsIx_9zA-zNAE1F3E0" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-6 pt-8 space-y-8 md:px-12 md:pt-10">
        
        {/* Date & Hero Section */}
        <section className="stagger-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-border-dusty/20"></div>
            <span className="font-label-md text-xs font-bold text-outline tracking-[0.2em] uppercase bg-white/50 px-4 py-1 rounded-full border border-border-dusty/10">Thursday, Oct 24</span>
            <div className="h-[1px] flex-1 bg-border-dusty/20"></div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-primary-container p-8 md:p-10 shadow-[0_20px_40px_-12px_rgba(13,46,25,0.4)] animate-breathing group">
            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none">
              <img alt="Abstract painting" className="w-full h-full object-cover mix-blend-overlay scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-DtvVeKkOkw0gOx5eLkztNkThjoxb4Q9w4X2Hn1EhkZy4JP2O_FG0l4uCRjsUlAVYYw6H3Dhd16d5PGvVPgKWxcF-vAs_t9BlgYZR7h_fNqyvjS2n-fVHGlE-zluLMo3IeuNBVDk8ebzvFsXgUAM81RcsjZXXV5Q29BXQNK62oSQwQz1x6ES01QXXL6GRmYMFOF1dvpH9WACSmqVW41f252CdC2OA4RSNuH8L1sFTwwmsaDOVA9kln2x-mVsWWGcnDFicYJ5DD8" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-between h-48 md:h-56">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-mint animate-pulse"></span>
                <span className="font-label-sm text-xs font-bold uppercase tracking-[0.15em] text-surface-mint/90">Main Insight</span>
              </div>
              <h1 className="text-white max-w-[95%] md:max-w-[85%] font-headline-md text-3xl md:text-4xl lg:text-5xl leading-[1.15] font-medium tracking-tight drop-shadow-md">
                Your attention feels more fragmented after 11 PM lately.
              </h1>
            </div>
          </div>
        </section>

        {/* 2x2 Grid Section */}
        <section className="grid grid-cols-2 gap-4 md:gap-6 stagger-fade-in" style={{ animationDelay: '0.2s' }}>
          
          {/* Streak Card */}
          <div className="bg-white p-6 rounded-3xl flex flex-col justify-between min-h-[160px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-surface-mint transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">nightlight</span>
              </div>
              <span className="uppercase text-[10px] font-bold tracking-widest text-outline">Streak</span>
            </div>
            <div className="mt-6">
              <span className="block text-4xl font-display-lg text-primary tracking-tight font-semibold">12 Days</span>
              <span className="text-sm font-medium text-on-surface-variant mt-1 block">Conscious Evenings</span>
            </div>
          </div>

          {/* Behavioral Reflection (Dynamic Card) */}
          <div className="col-span-1 bg-gradient-to-br from-surface-mint to-[#d2eed0] p-6 rounded-3xl flex flex-col gap-4 shadow-[0_4px_24px_rgba(13,46,25,0.06)] border border-surface-herbal/50 hover:shadow-[0_8px_32px_rgba(13,46,25,0.1)] transition-all duration-300 relative overflow-hidden group cursor-default">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <span className="uppercase text-[10px] tracking-widest font-bold">Reflection</span>
            </div>
            <p className="text-lg md:text-xl leading-tight text-primary font-medium z-10 mt-2">
              "Late nights feel <span className="italic font-semibold text-[#0a2313]">heavier</span> lately."
            </p>
            <div className="mt-auto pt-2 z-10">
              <div className="w-12 h-1.5 rounded-full bg-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Awareness Heatmap Card */}
          <div className="col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col gap-1">
                <span className="uppercase text-[10px] tracking-widest text-outline font-bold">Awareness Rhythm</span>
                <span className="font-display text-xl text-primary font-semibold tracking-tight">Weekly Flow</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">calendar_today</span>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 md:gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-3 flex-1 group cursor-pointer">
                  <span className={`uppercase font-bold text-[11px] transition-colors ${idx === 3 ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`}>{day}</span>
                  <div className={`w-full aspect-square rounded-2xl flex items-center justify-center relative transition-all duration-300
                    ${idx === 1 || idx === 2 ? 'bg-surface-mint shadow-inner' : idx === 3 ? 'border-2 border-primary bg-white shadow-sm scale-110' : 'bg-surface-container-low group-hover:bg-[#ebe9dd]'}`}>
                    {idx === 1 || idx === 2 ? <span className="material-symbols-outlined text-base text-primary">circle</span> : null}
                    {idx === 3 ? <div className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse"></div> : null}
                    {idx === 0 ? <div className="w-2.5 h-2.5 rounded-full bg-border-dusty/40"></div> : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t border-border-dusty/15 flex items-center justify-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-surface-herbal shadow-[0_0_8px_rgba(195,229,178,0.8)]"></span>
              <span className="text-[11px] font-medium text-on-surface-variant italic">Conscious alignment detected on 2 days this week</span>
            </div>
          </div>
        </section>

        {/* Digital Consumption / Screen Time Section */}
        <section className="stagger-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl text-primary font-semibold tracking-tight">Digital Consumption</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-outline bg-surface-container-low px-3 py-1.5 rounded-lg">Today</span>
            </div>
            <div className="space-y-7">
              <div className="space-y-2.5 group">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-semibold group-hover:text-primary transition-colors">Instagram usage</span>
                  <span className="text-on-surface-variant text-xs font-medium bg-surface-container-low px-2 py-0.5 rounded-md">Rises post-stress</span>
                </div>
                <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8a8a47] to-[#606129] rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-2.5 group">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-semibold group-hover:text-primary transition-colors">Reading & Quietness</span>
                  <span className="text-on-surface-variant text-xs font-medium bg-surface-container-low px-2 py-0.5 rounded-md">Weekend peaks</span>
                </div>
                <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9bcf8a] to-surface-herbal rounded-full transition-all duration-1000 ease-out delay-300" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-border-dusty/10 flex items-start gap-3 opacity-70">
              <span className="material-symbols-outlined text-lg text-outline">info</span>
              <p className="text-xs font-medium text-on-surface-variant leading-relaxed">Visualization based on emotional metadata, not just raw timers. Praana analyzes context around app usage.</p>
            </div>
          </div>
        </section>

        {/* Saathi AI Interface (Talk to Saathi) */}
        <section className="stagger-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gradient-to-br from-primary-container to-[#1a3821] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center gap-6 relative overflow-hidden shadow-[0_20px_40px_-12px_rgba(13,46,25,0.3)] group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-surface-mint mb-2 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <span className="material-symbols-outlined text-4xl">auto_awesome</span>
            </div>
            
            <div className="space-y-2 z-10 max-w-md">
              <h3 className="font-semibold text-2xl text-white tracking-tight">Saathi's Mirror</h3>
              <p className="text-base md:text-lg font-medium text-surface-mint/80 leading-relaxed">"What actually needed your attention today?"</p>
            </div>
            
            <Link to="/saathi" className="w-full md:w-auto md:px-12 bg-surface-mint text-primary py-4 rounded-2xl font-bold text-[15px] transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(0,0,0,0.2)] z-10 mt-4 block text-center">
              Reflect with Saathi
            </Link>
          </div>
        </section>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breathing {
            0%, 100% { transform: scale(1); opacity: 0.98; }
            50% { transform: scale(1.02); opacity: 1; }
        }
        .animate-breathing {
            animation: breathing 12s ease-in-out infinite;
        }
        .stagger-fade-in {
            animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
