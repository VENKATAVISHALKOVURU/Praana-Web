import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../landing.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#e8ede9"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auth');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { t } = useTranslation();

  const userVoices = [
    { quote: "The 21-day plan made me realize how often I opened Instagram without any reason. For the first time, I started using my phone more intentionally.", name: "Sai Kiran Reddy", role: "College Student, Bucchireddypalem", avatar: "🌱" },
    { quote: "I used to switch between apps while studying. The focus timer helped me complete tasks without constantly checking notifications.", name: "Ayesha Sultana", role: "School Student, Bucchireddypalem", avatar: "⏱️" },
    { quote: "Praana didn't force me to stop using my phone. It simply helped me become aware of my habits.", name: "Naveen Kumar", role: "Professional, Nellore", avatar: "👁️" },
    { quote: "The daily missions were small enough to follow but powerful enough to create change.", name: "Lakshmi Prasanna", role: "College Student, Nellore", avatar: "🌿" },
    { quote: "I was surprised by how much time I spent on short videos. The insights dashboard opened my eyes.", name: "Sneha", role: "College Student, Bucchireddypalem", avatar: "📊" },
    { quote: "Focus Rooms gave me a feeling that I wasn't working alone. It improved my consistency.", name: "Abdul Rahman", role: "Professional, Nellore", avatar: "👥" }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % userVoices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [userVoices.length]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          if (e.target.classList.contains('how-step')) {
            const num = e.target.querySelector('.step-num');
            if (num) num.classList.add('active');
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.feature-card, .stat-card, .testimonial-card, .how-step, .hero-logo-mark, .fade-up').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleEnterSpace = () => {
    navigate('/login');
  };

  const handleBeginJourney = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page-wrapper">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

<nav>
  <a href="#" className="nav-logo">
    <svg viewBox="0 0 28 28" fill="none">
      <circle cx="18" cy="8" r="7" stroke="currentColor" strokeWidth="2.2"/>
      <circle cx="8" cy="18" r="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="21" cy="21" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
    Praana
  </a>
  <ul className="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#how">How it works</a></li>
    <li><a href="#screens">App Screens</a></li>
    <li><a href="#saathi">Saathi AI</a></li>
    <li><a href="/about">About Us</a></li>
  </ul>
  <button className="nav-cta" onClick={handleBeginJourney}>{t('landing.navBeginJourney')}</button>
</nav>


<div className="hero">
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <AnimatedOrb />
    </Canvas>
  </div>
  <div className="hero-inner" style={{ zIndex: 1, position: 'relative' }}>
    <div className="hero-logo-mark fade-up">
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="26" cy="12" r="10" stroke="currentColor" strokeWidth="2.8"/>
        <circle cx="11" cy="25" r="7" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="30" cy="30" r="4.5" stroke="currentColor" strokeWidth="2.2"/>
      </svg>
    </div>
    <h1 className="fade-up fade-up-delay-1">Praana</h1>
    <p className="hero-tagline fade-up fade-up-delay-2">{t('landing.heroTagline')}</p>
    <p className="hero-label fade-up fade-up-delay-2">{t('landing.heroLabel')}</p>
    <div className="hero-buttons fade-up fade-up-delay-3" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <button className="btn-primary" onClick={handleEnterSpace}>{t('landing.btnEnterSpace')}</button>
      <a 
        href="https://github.com/VENKATAVISHALKOVURU/Praana-Web/raw/main/public/downloads/newpraana.apk" 
        download="newpraana.apk" 
        className="btn-secondary" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download App (APK)
      </a>
    </div>
  </div>
</div>


<section>
  <div className="stats-row">
    <div className="stat-card">
      <div className="stat-num">47%</div>
      <div className="stat-label">Reduction in mindless app opens</div>
    </div>
    <div className="stat-card">
      <div className="stat-num">2.8×</div>
      <div className="stat-label">Deeper focus sessions reported</div>
    </div>
    <div className="stat-card">
      <div className="stat-num">12k+</div>
      <div className="stat-label">Active souls in focus rooms</div>
    </div>
    <div className="stat-card">
      <div className="stat-num">94%</div>
      <div className="stat-label">Feel more intentional daily</div>
    </div>
  </div>
</section>


<section id="features" className="screens-section">
  <p className="section-label">What Praana Does</p>
  <h2 className="section-title">A digital buffer for your nervous system.</h2>
  <p className="section-desc">Praana intercepts the scroll-impulse loop with gentle friction — breathing exercises, emotional check-ins, and focus rooms — restoring your capacity to choose.</p>
  <div className="features-grid">
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <h3>Focus Sessions</h3>
      <p>Lock into timed deep work with a minimal timer, calming prompts, and zero distractions. Your attention is settling — let it.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <h3>Breathing Overlay</h3>
      <p>Before opening a distracting app, Praana prompts a mindful transition — a breathing orb that guides you back to center before you decide to continue.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h3>Focus Rooms</h3>
      <p>Co-work in silence with strangers. A shared canopy of focus — 12 active souls, one timer, the quiet comfort of collective intentionality.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <h3>Saathi AI</h3>
      <p>A conscious AI companion — not a chatbot, but a reflective space. Saathi listens quietly and holds space for whatever is weighing on you.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      </div>
      <h3>Weekly Insights</h3>
      <p>Visualize your screen-time habits in a beautiful 3D flow. Understand your triggers, track your progress, and celebrate your mindful victories.</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </div>
      <h3>App Protection</h3>
      <p>Choose the apps that trigger you most. Praana wraps them in a conscious layer — a breath, a question, a pause — before letting you through.</p>
    </div>
  </div>
</section>


<section id="how" style={{"paddingBottom":"0"}}>
  <p className="section-label">How It Works</p>
  <h2 className="section-title">Presence through friction.</h2>
  <p className="section-desc">Praana is designed to interrupt the autopilot. A few gentle steps each time restores your power to choose.</p>
  <div className="how-grid" style={{"marginTop":"48px"}}>
    <div className="how-step">
      <div className="step-num">1</div>
      <div className="step-content">
        <h4>You open an app</h4>
        <p>Instagram, TikTok, whatever triggers the scroll. Praana notices.</p>
      </div>
    </div>
    <div className="how-step">
      <div className="step-num">2</div>
      <div className="step-content">
        <h4>Breathing overlay</h4>
        <p>A soft orb guides one conscious breath. Pause before impulse.</p>
      </div>
    </div>
    <div className="how-step">
      <div className="step-num">3</div>
      <div className="step-content">
        <h4>Emotional check-in</h4>
        <p>A single question. Why are you here right now? What do you need?</p>
      </div>
    </div>
    <div className="how-step">
      <div className="step-num">4</div>
      <div className="step-content">
        <h4>You choose</h4>
        <p>Continue with intent — or return to focus. Either way, it was a choice.</p>
      </div>
    </div>
  </div>
</section>


<section id="screens" style={{"paddingTop":"80px"}}>
  <p className="section-label">App Screens</p>
  <h2 className="section-title">Every screen, a moment of stillness.</h2>
</section>

<div className="screens-showcase" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "center", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
<div className="phone-frame">
      <div className="phone-screen">
        <div className="sim-screen" style={{ padding: 0, overflow: 'hidden' }}>
          <img src="/images/dashboard.png" alt="Home Screen Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
<div className="phone-frame">
      <div className="phone-screen">
        <div className="sim-screen sim-focus">
          <div className="focus-header">
            <div className="focus-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="var(--primary)" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round"/></svg>
              <span>Praana</span>
            </div>
            <span className="focus-badge">Active Focus</span>
          </div>
          <div className="focus-body">
            <div className="focus-dot"><div className="focus-dot-inner"></div></div>
            <div className="focus-timer">24:57</div>
            <div className="focus-msg">Your attention is settling.</div>
            <div className="focus-sub">Take a deep breath. The world can<br />wait for a few moments.</div>
          </div>
          <button className="focus-end">✕ End Session</button>
        </div>
      </div>
    </div>
<div className="phone-frame">
      <div className="phone-screen">
        <div className="sim-screen sim-room">
          <div className="room-header">
            <div className="room-close">✕</div>
            <div className="room-info">
              <h4>Focus Room #24</h4>
              <div className="room-souls">12 active souls</div>
            </div>
            <div style={{"width":"28px"}}></div>
          </div>
          <div className="room-timer-circle">
            <div className="room-time">24:56</div>
            <div className="room-time-label">MINUTES LEFT</div>
          </div>
          <div>
            <div className="room-quote">"Everyone is focusing quietly"</div>
            <div className="room-caption">A shared canopy of silence</div>
            <div className="room-avatars" style={{"marginTop":"10px","justifyContent":"center","display":"flex"}}>
              <div className="avatar">👤</div>
              <div className="avatar">🧘</div>
              <div className="avatar">🌿</div>
              <div className="avatar" style={{"background":"var(--surface-low)","fontSize":"9px","fontWeight":"600","color":"var(--primary)"}}>+9</div>
            </div>
          </div>
          <div className="room-controls">
            <button className="ctrl-btn">
              <div className="ctrl-icon">↺+</div>
              <div className="ctrl-label">Extend</div>
            </button>
            <button className="ctrl-btn">
              <div className="ctrl-icon main" style={{"fontSize":"16px","color":"#00210d"}}>⏸</div>
              <div className="ctrl-label main">Focusing</div>
            </button>
            <button className="ctrl-btn">
              <div className="ctrl-icon">→</div>
              <div className="ctrl-label danger">Leave</div>
            </button>
          </div>
        </div>
      </div>
    </div>
<div className="phone-frame">
      <div className="phone-screen">
        <div className="sim-screen sim-saathi" style={{"paddingBottom":"8px"}}>
          <div className="saathi-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface)" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            <div className="saathi-info">
              <h4>Saathi</h4>
              <div className="saathi-status"><div className="status-dot"></div>Listening quietly</div>
            </div>
          </div>
          <div className="chat-messages">
            <div className="msg msg-saathi">Take a deep breath. I'm here to hold space for whatever is weighing on you.</div>
            <div className="msg-time" style={{"fontSize":"9px","color":"var(--outline)"}}>Just now</div>
            <div className="msg msg-user">I feel like I'm constantly rushing but never getting anywhere. My thoughts are tangled.</div>
            <div className="msg msg-saathi-accent">It sounds like your mind is searching for a boundary that doesn't exist right now. When we rush without direction, we're often trying to outrun an internal feeling...<br /><br /><em>If you were to sit with that feeling—</em></div>
          </div>
          <div className="chat-chips">
            <div className="chip">I can't focus</div>
            <div className="chip">I feel tired</div>
            <div className="chip">Help me</div>
          </div>
          <div className="sim-bottomnav">
            <div className="nav-item"><div className="nav-icon">🏠</div><div className="nav-item-label">Home</div></div>
            <div className="nav-item"><div className="nav-icon">⏱</div><div className="nav-item-label">Focus</div></div>
            <div className="nav-item"><div className="nav-icon">👥</div><div className="nav-item-label">Rooms</div></div>
            <div className="nav-item active"><div className="nav-pill"><div className="nav-icon">✦</div></div><div className="nav-item-label">Saathi</div></div>
          </div>
        </div>
      </div>
    </div>
</div>

<div className="testimonials" id="saathi" style={{"marginTop":"80px", overflow: "hidden"}}>
  <p className="section-label" style={{"textAlign":"center"}}>From the community</p>
  <h2 className="section-title" style={{"textAlign":"center","marginBottom":"40px"}}>What souls are saying.</h2>
  
  <div className="carousel-container" style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', height: '220px' }}>
    {userVoices.map((voice, i) => {
      const offset = i - activeTestimonial;
      const isVisible = offset === 0;
      
      return (
        <div key={i} className="testimonial-card" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: isVisible ? 1 : 0,
          transform: `translateX(${offset * 100}%)`,
          transition: 'all 0.6s ease-in-out',
          margin: 0
        }}>
          <blockquote style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '24px' }}>"{voice.quote}"</blockquote>
          <div className="testimonial-author">
            <div className="author-avatar">{voice.avatar}</div>
            <div>
              <div className="author-name">{voice.name}</div>
              <div className="author-role">{voice.role}</div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
  
  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
    {userVoices.map((_, i) => (
      <button key={i} onClick={() => setActiveTestimonial(i)} style={{
        width: i === activeTestimonial ? '24px' : '8px',
        height: '8px',
        borderRadius: '4px',
        background: i === activeTestimonial ? 'var(--primary)' : 'rgba(13, 46, 25, 0.1)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }} aria-label={`Go to slide ${i + 1}`} />
    ))}
  </div>
</div>


<div id="signup">
  <div className="cta-section">
    <h2>Begin your journey.</h2>
    <p>A digital space that slows you down, so you can finally move with intent.</p>
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
      <button className="cta-btn" onClick={handleBeginJourney} style={{ margin: 0 }}>Enter Space — It's Free</button>
      <a 
        href="https://github.com/VENKATAVISHALKOVURU/Praana-Web/raw/main/public/downloads/newpraana.apk" 
        download="newpraana.apk" 
        className="cta-btn secondary-btn" 
        style={{ margin: 0, backgroundColor: 'transparent', border: '2px solid rgba(255, 255, 255, 0.3)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download App (APK)
      </a>
    </div>
  </div>
</div>


<footer>
  <div className="footer-inner">
    <div className="footer-top">
      <div className="footer-brand">
        <div className="footer-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="18" cy="8" r="7" stroke="white" strokeWidth="2.2"/>
            <circle cx="8" cy="18" r="5" stroke="white" strokeWidth="2"/>
            <circle cx="21" cy="21" r="3" stroke="white" strokeWidth="1.8"/>
          </svg>
          Praana
        </div>
        <div className="footer-tagline">AWARENESS BEFORE IMPULSE</div>
      </div>
      <div className="footer-links">
        <h4>Product</h4>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="/rooms">Focus Rooms</a></li>
          <li><a href="#saathi">Saathi AI</a></li>
          <li><a href="#how">App Protection</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/philosophy">Philosophy</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/careers">Careers</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Legal</h4>
        <ul>
          <li><a href="/praana_legal.html">Privacy</a></li>
          <li><a href="/praana_legal.html">Terms</a></li>
          <li><a href="/praana_legal.html">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 Praana. Built with intentionality.</span>
      <span style={{"fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase"}}>PRESENCE THROUGH FOCUS</span>
    </div>
  </div>
</footer>



    </div>
  );
}
