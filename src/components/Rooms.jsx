import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove, onDisconnect, get } from 'firebase/database';
import { rtdb, auth } from '../firebase';
import { useTranslation } from 'react-i18next';

export default function Rooms() {
  const { t } = useTranslation();
  
  // Lobby states
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [lobbyView, setLobbyView] = useState('main'); // 'main', 'create', 'join'
  
  // Form states
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomPasswordInput, setRoomPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Room states
  const [participants, setParticipants] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [activeRoomsList, setActiveRoomsList] = useState([]);
  
  const [userId, setUserId] = useState(localStorage.getItem('praana_userId'));
  const [userName, setUserName] = useState(localStorage.getItem('praana_userName') || 'Explorer');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    const pwdParam = params.get('pwd');
    if (roomParam) {
      setLobbyView('join');
      setRoomCodeInput(roomParam);
      if (pwdParam) setRoomPasswordInput(pwdParam);
    }
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || user.email?.split('@')[0] || 'Explorer');
        localStorage.setItem('praana_userId', user.uid);
        localStorage.setItem('praana_userName', user.displayName || user.email?.split('@')[0] || 'Explorer');
      }
    });
    return () => unsubscribeAuth();
  }, []);
  
  // Dynamic refs based on activeRoomId
  const roomRef = activeRoomId ? ref(rtdb, `rooms/${activeRoomId}/participants`) : null;
  const userRef = (userId && activeRoomId) ? ref(rtdb, `rooms/${activeRoomId}/participants/${userId}`) : null;

  useEffect(() => {
    if (!roomRef) return;
    
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
  }, [activeRoomId, userId, isJoined]);

  // Fetch active rooms for lobby
  useEffect(() => {
    if (activeRoomId) return; // Only fetch in lobby
    const roomsRef = ref(rtdb, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, info]) => {
          const pCount = info.participants ? Object.keys(info.participants).length : 0;
          const isPrivate = !!info.settings?.password;
          return { id, participantCount: pCount, isPrivate };
        }).filter(r => r.participantCount > 0);
        setActiveRoomsList(list);
      } else {
        setActiveRoomsList([]);
      }
    });
    return () => unsubscribe();
  }, [activeRoomId]);

  const handleJoinActiveRoom = async () => {
    if (!userId || !userRef) return;
    await set(userRef, {
      name: userName,
      status: 'Deep Work',
      joinedAt: Date.now()
    });
    onDisconnect(userRef).remove();
  };

  const handleLeaveActiveRoom = async () => {
    if (!userId || !userRef) return;
    await remove(userRef);
    onDisconnect(userRef).cancel();
    setActiveRoomId(null);
    setLobbyView('main');
  };

  const createRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    if (roomPasswordInput.trim() !== '') {
      await set(ref(rtdb, `rooms/${newRoomId}/settings`), {
        password: roomPasswordInput.trim()
      });
    }
    setActiveRoomId(newRoomId);
    setRoomPasswordInput('');
    setErrorMsg('');
  };

  const joinPrivateRoom = async () => {
    if (!roomCodeInput.trim()) {
      setErrorMsg('Please enter a room code');
      return;
    }
    
    const roomId = roomCodeInput.trim().toUpperCase();
    const settingsRef = ref(rtdb, `rooms/${roomId}/settings`);
    const snapshot = await get(settingsRef);
    
    if (snapshot.exists() && snapshot.val().password) {
      if (snapshot.val().password !== roomPasswordInput.trim()) {
        setErrorMsg('Incorrect password');
        return;
      }
    }
    
    setActiveRoomId(roomId);
    setRoomCodeInput('');
    // Keep password in state for invite link generation
    setErrorMsg('');
  };

  const copyInviteLink = () => {
    const url = new URL(window.location.origin + '/rooms');
    url.searchParams.set('room', activeRoomId);
    if (roomPasswordInput) {
      url.searchParams.set('pwd', roomPasswordInput);
    }
    navigator.clipboard.writeText(url.toString());
    alert('Invite link copied to clipboard!');
  };

  const renderLobby = () => {
    if (lobbyView === 'create') {
      return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-border-dusty/30 max-w-md mx-auto w-full">
          <button onClick={() => setLobbyView('main')} className="text-on-surface-variant flex items-center gap-1 hover:text-primary mb-6 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <h2 className="text-2xl font-bold text-primary mb-2">Create Private Room</h2>
          <p className="text-on-surface-variant text-sm mb-6">Create an exclusive space for you and your friends to focus together.</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Password (Optional)</label>
              <input 
                type="password" 
                value={roomPasswordInput}
                onChange={(e) => setRoomPasswordInput(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                placeholder="Leave blank for public access via code"
              />
            </div>
          </div>
          
          <button onClick={createRoom} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#0a2313] transition-colors shadow-sm">
            Generate Room Code
          </button>
        </div>
      );
    }
    
    if (lobbyView === 'join') {
      return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-border-dusty/30 max-w-md mx-auto w-full">
          <button onClick={() => setLobbyView('main')} className="text-on-surface-variant flex items-center gap-1 hover:text-primary mb-6 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>
          <h2 className="text-2xl font-bold text-primary mb-2">Join a Room</h2>
          <p className="text-on-surface-variant text-sm mb-6">Enter a room code to join an existing focus session.</p>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {errorMsg}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Room Code</label>
              <input 
                type="text" 
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow uppercase font-bold"
                placeholder="e.g. A1B2C3"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Password (If required)</label>
              <input 
                type="password" 
                value={roomPasswordInput}
                onChange={(e) => setRoomPasswordInput(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                placeholder="Enter password"
              />
            </div>
          </div>
          
          <button onClick={joinPrivateRoom} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#0a2313] transition-colors shadow-sm">
            Join Room
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => { setActiveRoomId('GLOBAL'); }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-border-dusty/30 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-surface-mint rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">public</span>
            </div>
            <h3 className="font-bold text-xl text-primary mb-2">Global Space</h3>
            <p className="text-on-surface-variant text-sm">Join the open focus room and work alongside the entire community.</p>
          </div>

          <div 
            onClick={() => setLobbyView('join')}
            className="bg-white p-8 rounded-3xl shadow-sm border border-border-dusty/30 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-white">
              <span className="material-symbols-outlined text-3xl">meeting_room</span>
            </div>
            <h3 className="font-bold text-xl text-primary mb-2">Join Room</h3>
            <p className="text-on-surface-variant text-sm">Got a code? Join a private focus room with your friends or colleagues.</p>
          </div>

          <div 
            onClick={() => setLobbyView('create')}
            className="bg-primary p-8 rounded-3xl shadow-sm border border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Create Room</h3>
            <p className="text-white/80 text-sm">Start a new private focus session and invite others with a secure code.</p>
          </div>
        </div>

        {activeRoomsList.length > 0 && (
          <div className="mt-8 w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">explore</span>
              Active Rooms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeRoomsList.map((room) => (
                <div 
                  key={room.id}
                  onClick={() => {
                    if (room.isPrivate) {
                      setLobbyView('join');
                      setRoomCodeInput(room.id);
                    } else {
                      setActiveRoomId(room.id);
                    }
                  }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-border-dusty/30 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${room.isPrivate ? 'bg-surface-container-low text-on-surface-variant' : 'bg-surface-mint text-primary'}`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {room.isPrivate ? 'lock' : 'public'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm group-hover:text-primary/80 transition-colors">
                        {room.id === 'GLOBAL' ? 'Global Space' : `Room ${room.id}`}
                      </h4>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {room.participantCount} active
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-border-dusty group-hover:text-primary transition-colors text-[20px]">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-[#fcfbf7] text-on-surface">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-8 py-6 border-b border-border-dusty/10 flex justify-between items-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-3xl text-primary tracking-tight font-bold">{t('rooms.focusRoom')}</h1>
            <p className="text-on-surface-variant text-lg font-medium mt-1">
              {!activeRoomId ? 'Lobby' : activeRoomId === 'GLOBAL' ? t('rooms.globalSpace') : `Room: ${activeRoomId}`}
            </p>
          </div>
          {activeRoomId && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-surface-container-low px-4 py-2 rounded-xl text-primary font-bold font-display text-sm items-center gap-2 border border-border-dusty/30 cursor-pointer hover:bg-border-dusty/10 transition-colors" onClick={copyInviteLink} title="Copy Invite Link">
                <span className="text-on-surface-variant text-xs">CODE:</span>
                {activeRoomId}
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant ml-1">content_copy</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-mint/30 px-4 py-2 rounded-full border border-surface-herbal/20">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-sm font-bold text-primary">{t('rooms.activeCount', { count: participants.length })}</span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 px-8 pt-10 pb-32 max-w-7xl mx-auto w-full flex flex-col gap-10">
        
        {!activeRoomId ? (
          <section className="flex flex-col items-center">
            <div className="text-center max-w-lg mb-12">
              <span className="material-symbols-outlined text-5xl text-surface-mint mb-4">location_city</span>
              <h2 className="text-3xl font-headline-md font-bold text-primary mb-4">Welcome to the Lobby</h2>
              <p className="text-on-surface-variant text-lg">Choose how you want to focus today. Join the community globally, or coordinate a private session.</p>
            </div>
            {renderLobby()}
          </section>
        ) : (
          <>
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
                    onClick={handleLeaveActiveRoom}
                    className="bg-white/80 backdrop-blur text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-all shadow-sm active:scale-95 border border-primary/10 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    {t('rooms.leaveRoom')}
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setActiveRoomId(null); setLobbyView('main'); }}
                      className="bg-white/50 text-primary font-bold px-6 py-3.5 rounded-xl hover:bg-white transition-all border border-primary/10"
                    >
                      Back to Lobby
                    </button>
                    <button 
                      onClick={handleJoinActiveRoom}
                      className="bg-primary text-surface-mint font-bold px-8 py-3.5 rounded-xl hover:bg-[#0a2313] transition-all shadow-md active:scale-95"
                    >
                      {t('rooms.joinRoom')}
                    </button>
                  </div>
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
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border-dusty/40 flex flex-col items-center">
                  <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">hourglass_empty</span>
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-2">The room is currently empty</h4>
                  <p className="text-on-surface-variant text-lg">Be the first to join and set the intention.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
          </>
        )}
      </main>
    </div>
  );
}

