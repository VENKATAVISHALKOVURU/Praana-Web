import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home as HomeIcon, Timer, Users, Sparkles } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { path: '/home', icon: HomeIcon, label: 'Home' },
    { path: '/focus', icon: Timer, label: 'Focus' },
    { path: '/rooms', icon: Users, label: 'Rooms' },
    { path: '/saathi', icon: Sparkles, label: 'Saathi' },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f7f2] text-on-surface overflow-hidden font-body-md selection:bg-surface-herbal/30">
      
      {/* Desktop Top Navigation */}
      <header className="hidden md:flex items-center justify-between px-8 h-20 bg-white/80 backdrop-blur-xl border-b border-border-dusty/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-50 flex-shrink-0">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-mint flex items-center justify-center text-primary shadow-sm">
            <Sparkles size={20} />
          </div>
          <h1 className="font-headline-md text-2xl text-primary font-bold tracking-tight">
            Praana
          </h1>
        </div>
        
        {/* Centered Nav Links */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({isActive}) => 
                `flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-[0_4px_12px_rgba(13,46,25,0.15)]' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-medium'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <item.icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[15px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center">
          <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-border-dusty/20 hover:opacity-80 transition-opacity">
            <div className="flex flex-col items-end">
              <span className="text-[14px] font-semibold text-primary">Elias Thorne</span>
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Active Focus</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-primary">
              ET
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8f7f2] pb-24 md:pb-0 scroll-smooth">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-mint/10 to-transparent pointer-events-none"></div>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-border-dusty/20 flex justify-around items-center px-4 py-2 pb-6 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({isActive}) => 
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[64px] ${
                isActive 
                  ? 'text-primary' 
                  : 'text-outline hover:text-on-surface-variant'
              }`
            }
          >
            {({isActive}) => (
              <>
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-surface-mint shadow-sm scale-110' : 'bg-transparent'}`}>
                  <item.icon size={22} className={isActive ? 'text-primary' : ''} />
                </div>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
