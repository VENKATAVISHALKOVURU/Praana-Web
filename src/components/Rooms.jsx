import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove, onDisconnect } from 'firebase/database';
import { rtdb } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function Rooms() {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  
  const userId = localStorage.getItem('praana_userId');
  const userName = localStorage.getItem('praana_userName') || 'Explorer';
  
  const roomRef = ref(rtdb, 'rooms/global/participants');
  const userRef = userId ? ref(rtdb, `rooms/global/participants/${userId}`) : null;

  useEffect(() => {
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const participantList = Object.entries(data).map(([id, info]) => ({
          id,
          ...info
        }));
        setParticipants(participantList);
        setIsJoined(!!data[userId]);
      } else {
        setParticipants([]);
        setIsJoined(false);
      }
    });

    return () => {
      unsubscribe();
      if (userId && isJoined && userRef) {
         remove(userRef);
      }
    };
  }, [userId, isJoined]);

  const handleJoin = async () => {
    if (!userId || !userRef) return;
    await set(userRef, {
      name: userName,
      status: 'Deep Work',
      joinedAt: Date.now()
    });
    onDisconnect(userRef).remove();
  };

  const handleLeave = async () => {
    if (!userId || !userRef) return;
    await remove(userRef);
    onDisconnect(userRef).cancel();
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fcfbf7] text-on-surface">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 py-6 border-b border-border-dusty/10 flex justify-between items-center">
        <div>
          <h1 className="font-headline-md text-2xl text-primary tracking-tight font-bold">{t('rooms.focusRoom')}</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-1">{t('rooms.globalSpace')}</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-mint/30 px-3 py-1.5 rounded-full border border-surface-herbal/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-primary">{t('rooms.activeCount', { count: participants.length })}</span>
        </div>
      </header>
      
      <main className="flex-1 px-6 pt-8 pb-32 max-w-3xl mx-auto w-full flex flex-col gap-8">
        
        {/* Status Card */}
        <section className="bg-surface-mint w-full p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(90,91,44,0.1)] relative overflow-hidden border border-border-dusty/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-20 translate-x-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-4" style={{ fontVariationSettings: '"FILL" 1' }}>
              {isJoined ? 'self_improvement' : 'group_work'}
            </span>
            <h2 className="text-2xl font-headline-md font-medium tracking-tight mb-2 text-primary">
              {isJoined ? t('rooms.inFlow') : t('rooms.readyFocus')}
            </h2>
            <p className="text-on-surface-variant text-sm max-w-sm mb-8">
              {isJoined 
                ? t('rooms.presenceContributing') 
                : t('rooms.joinToSignal')}
            </p>
            
            {isJoined ? (
              <button 
                onClick={handleLeave}
                className="bg-white/80 backdrop-blur text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all shadow-sm active:scale-95 border border-primary/10"
              >
                {t('rooms.leaveRoom')}
              </button>
            ) : (
              <button 
                onClick={handleJoin}
                className="bg-primary text-surface-mint font-bold px-8 py-3.5 rounded-xl hover:bg-[#0a2313] transition-all shadow-md active:scale-95"
              >
                {t('rooms.joinRoom')}
              </button>
            )}
          </div>
        </section>

        {/* Participants Grid */}
        <section>
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">people</span>
            {t('rooms.fellowExplorers')}
          </h3>
          
          {participants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border-dusty/40">
              <p className="text-on-surface-variant text-sm font-medium" dangerouslySetInnerHTML={{ __html: t('rooms.roomEmpty') }}></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {participants.map((p) => {
                const isMe = p.id === userId;
                return (
                  <div key={p.id} className={`flex flex-col items-center p-5 rounded-2xl border transition-all ${isMe ? 'bg-surface-mint/20 border-primary/20' : 'bg-white border-border-dusty/20'} shadow-sm hover:shadow-md`}>
                    <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-xl font-bold text-primary mb-3 relative">
                      {p.name.charAt(0).toUpperCase()}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-on-surface truncate w-full text-center">
                      {isMe ? t('rooms.you') : p.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-outline mt-1">
                      {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        
      </main>
    </div>
  );
}
