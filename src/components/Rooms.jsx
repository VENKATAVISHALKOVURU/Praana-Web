import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim() !== '') {
      // For now, this is a mock. It would normally navigate to a specific room path
      alert(`Joining room: ${roomId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfaed] text-[#1b1c15] selection:bg-[#E7F6E6]">
      {/* TopAppBar */}
      <header className="bg-surface sticky top-0 z-40 flex justify-between items-center w-full px-margin-mobile py-sm">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">bubble_chart</span>
          <span className="font-headline-md text-headline-md text-primary tracking-tight">Praana</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border border-outline-variant">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDknCoprzI3frSGErUxteOWs_Nfk-1H5U_1o3-lRxzJd83dzdBKhDpUd9PBRj9HF6JSJIT6QuuTYBgtscXQ0nCTEBa1MDKH9WCMDRLWhKgYO4pBLAf5JjBjKIpR4cXOugUdz8j0N-5nWgsFL-hrlfb-p8FSbd0ZIHrCG5zP97MCqac3Sb5VzimfkCZoasuVSw3D9-VA8Kl4ERZ-UpsQBy_GCgUrAzOmxLcQb1v9jY4uKNI9dPYo7AHPT29dgTt_68pg95WbYsFygM"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-margin-mobile pb-32">
        {/* Hero Section */}
        <section className="mt-lg mb-xl">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Focus Rooms</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs opacity-80">Focus quietly with others</p>
        </section>

        {/* Active Rooms Grid */}
        <section className="mb-xl">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-title-lg text-title-lg text-primary">Active Rooms</h2>
            <button className="font-label-md text-label-md text-secondary hover:underline">View all</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Large Featured Room Card */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-xl bg-surface-mint p-lg shadow-[0_4px_12px_rgba(90,91,44,0.05)] border border-border-dusty/30 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-label-sm font-label-sm animate-pulse">LIVE</span>
                    <div className="flex -space-x-2">
                      <img alt="Participant" className="w-6 h-6 rounded-full border-2 border-surface-mint" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjmUUVoL0KWNxUtnYnBnxmlohXW3-lN58WgLB1-foIIblZch5meBmIh1ns33j3kwtHk0R5UpFQg4T3DYWcwM94cPDh7esbR0WKa6ehfTv7VYIbpVMccgpLDuC4M1NDAXKepsmkOPMA1KYqjjr2-6M2-QOL5uVFtTuIsmpRiU2Gl0eJQp2Wx4YUuIKlnYdqT1hfeddIEDT-Ajvgt5Q61q4tpUKCiIDEs3swahZRVrGoIfekovtwjbylN2n9hwlX3hIqZolfCpCYBZ8" />
                      <img alt="Participant" className="w-6 h-6 rounded-full border-2 border-surface-mint" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACIxyVLslwDoXRbBq3m7NeWjavBkbOGNBu1cKRyT1Nxv-vsXMmKxAPgPVzdJOOonD-ZtTLgKq9jcxEzUc0rZ1JCzCKJWuwzMDMAU_KItiZfP5PpOHrtRd-sMF14d6nLLyffYWqWn5evg5Lp4MDkhNLSxiYB76OoMNLLQB638bfy9VgXSHTaSFHPljZXHBy0YwbHx7O1m8SkXkhPZ9JYYMg5ve7uS608V5XjTHzSJzdPqfkyGhx47jfqaRmqiPmMaN9sgunYJOqyR4" />
                      <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center border-2 border-surface-mint">
                        <span className="text-[10px] font-bold text-on-secondary-container">+12</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mt-md">Deep Work Room</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Strictly no microphones. Pomodoro: 50/10.</p>
                </div>
                <div className="mt-lg flex items-center justify-between">
                  <div className="flex items-center gap-sm text-secondary">
                    <span className="material-symbols-outlined text-body-md">timer</span>
                    <span className="font-label-md text-label-md">24:12 remaining</span>
                  </div>
                  <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md transition-opacity active:opacity-80">Join Now</button>
                </div>
              </div>
            </div>

            {/* Secondary Room Card */}
            <div className="rounded-xl bg-surface-container-low p-md border border-border-dusty/20 transition-transform duration-300 hover:border-border-dusty/50 hover:-translate-y-1">
              <div className="flex justify-between items-center mb-sm">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary">groups</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">8 Active</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant opacity-30">lock_open</span>
              </div>
              <h4 className="font-title-lg text-title-lg text-primary">Silent Study</h4>
              <p className="font-label-md text-label-md text-on-surface-variant mt-xs">Perfect for reading and solo research.</p>
              <button className="w-full mt-md py-sm rounded-lg border border-border-dusty text-primary font-label-md hover:bg-surface-container-high transition-colors">Enter</button>
            </div>

            {/* Secondary Room Card */}
            <div className="rounded-xl bg-surface-container-low p-md border border-border-dusty/20 transition-transform duration-300 hover:border-border-dusty/50 hover:-translate-y-1">
              <div className="flex justify-between items-center mb-sm">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-secondary">groups</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">3 Active</span>
                </div>
                <span className="material-symbols-outlined text-secondary">nightlight</span>
              </div>
              <h4 className="font-title-lg text-title-lg text-primary">Midnight Focus</h4>
              <p className="font-label-md text-label-md text-on-surface-variant mt-xs">Low lighting, lofi beats, collective calm.</p>
              <button className="w-full mt-md py-sm rounded-lg border border-border-dusty text-primary font-label-md hover:bg-surface-container-high transition-colors">Enter</button>
            </div>
          </div>
        </section>

        {/* Create Room Button Section */}
        <section className="mb-xl">
          <div className="relative group cursor-pointer overflow-hidden rounded-xl bg-primary py-xl px-lg text-center shadow-[0_8px_16px_rgba(90,91,44,0.1)] transition-transform active:scale-[0.98]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-container rounded-full blur-2xl -translate-x-10 translate-y-10"></div>
            </div>
            <div className="relative z-10">
              <div className="bg-primary-container inline-flex p-md rounded-full mb-md">
                <span className="material-symbols-outlined text-on-primary-container">add</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-primary">Host a Private Room</h2>
              <p className="font-body-md text-body-md text-primary-fixed mt-xs opacity-70">Create a space for your inner circle</p>
            </div>
          </div>
        </section>

        {/* Join Room Section */}
        <section className="mb-8">
          <div className="bg-surface-container-highest/30 rounded-xl p-lg border border-dashed border-border-dusty">
            <h3 className="font-title-lg text-title-lg text-primary mb-md">Join by Room ID</h3>
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-md">
              <div className="flex-1">
                <input 
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-md py-sm bg-surface border border-border-dusty rounded-lg text-body-md focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40" 
                  placeholder="Enter 6-digit ID"
                />
              </div>
              <button type="submit" className="bg-secondary text-on-secondary px-xl py-sm rounded-lg font-label-md hover:opacity-90 transition-opacity">
                Join Room
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
