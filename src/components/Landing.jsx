import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../landing.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
  const meshRef = React.useRef();
  const materialRef = React.useRef();

  useFrame((state, delta) => {
    // Calculate scroll progress (0 to 1)
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    
    if (meshRef.current) {
      // Smoothly interpolate rotation
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, scrollProgress * Math.PI * 4, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, scrollProgress * Math.PI * 2, 0.05);
      
      // Move orb around based on scroll
      // Starts center (0,0), moves right then left
      const targetX = Math.sin(scrollProgress * Math.PI * 2) * 3;
      const targetY = Math.cos(scrollProgress * Math.PI) * -1.5 + 1.5; // slight bobbing
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      
      // Scale down slightly as user scrolls
      const targetScale = 2.5 - scrollProgress * 1.0;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05));
    }
    
    if (materialRef.current) {
      // Change distortion based on scroll (more distorted at the bottom)
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.3 + scrollProgress * 0.4, 0.05);
      
      // Shift color from mint to a deeper olive based on scroll
      const color1 = new THREE.Color("#c3e5b2"); // surface-herbal
      const color2 = new THREE.Color("#aad0af"); // primary-fixed-dim
      materialRef.current.color.copy(color1).lerp(color2, scrollProgress);
    }
  });

  return (
    <Sphere ref={meshRef} visible args={[1, 64, 64]} scale={2.5}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#c3e5b2"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        transparent
        opacity={0.65}
      />
    </Sphere>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auth');

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

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
    <div className="landing-page-wrapper relative">
      {/* 3D Background Canvas */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <AnimatedOrb />
        </Canvas>
      </div>

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
  </ul>
  <button className="nav-cta" onClick={handleBeginJourney}>Begin Journey</button>
</nav>


<div className="hero">
  <div className="hero-inner" style={{ zIndex: 1, position: 'relative' }}>
    <div className="hero-logo-mark fade-up">
      <svg viewBox="0 0 40 40" fill="none">
        <circle cx="26" cy="12" r="10" stroke="currentColor" strokeWidth="2.8"/>
        <circle cx="11" cy="25" r="7" stroke="currentColor" strokeWidth="2.5"/>
        <circle cx="30" cy="30" r="4.5" stroke="currentColor" strokeWidth="2.2"/>
      </svg>
    </div>
    <h1 className="fade-up fade-up-delay-1">Praana</h1>
    <p className="hero-tagline fade-up fade-up-delay-2">Your conscious layer between impulse and action.</p>
    <p className="hero-label fade-up fade-up-delay-2">AWARENESS BEFORE IMPULSE</p>
    <div className="hero-buttons fade-up fade-up-delay-3">
      <button className="btn-primary" onClick={handleEnterSpace}>Enter Space</button>
      <button className="btn-secondary" onClick={() => document.getElementById('screens')?.scrollIntoView({behavior:'smooth'})}>See the App</button>
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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
      </div>
      <h3>Story Reflection</h3>
      <p>At the end of each day, Praana surfaces a gentle reflection — a quote, prompts, and space to write. Your journal as a wellness ritual.</p>
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
      <div className="step-num active">1</div>
      <h4>You open an app</h4>
      <p>Instagram, TikTok, whatever triggers the scroll. Praana notices.</p>
    </div>
    <div className="how-step">
      <div className="step-num">2</div>
      <h4>Breathing overlay</h4>
      <p>A soft orb guides one conscious breath. Pause before impulse.</p>
    </div>
    <div className="how-step">
      <div className="step-num">3</div>
      <h4>Emotional check-in</h4>
      <p>A single question. Why are you here right now? What do you need?</p>
    </div>
    <div className="how-step">
      <div className="step-num">4</div>
      <h4>You choose</h4>
      <p>Continue with intent — or return to focus. Either way, it was a choice.</p>
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
        <div className="sim-screen sim-login">
          <div className="sim-logo-sm">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <circle cx="18" cy="8" r="7" stroke="#0d2e19" strokeWidth="2.2"/>
                <circle cx="8" cy="18" r="5" stroke="#0d2e19" strokeWidth="2"/>
                <circle cx="21" cy="21" r="3" stroke="#0d2e19" strokeWidth="1.8"/>
              </svg>
            </div>
            <div className="sim-title">Praana</div>
            <div className="sim-subtitle">Return to your center.</div>
          </div>
          <div className="sim-card">
            <div className="sim-input-group">
              <div className="sim-label">Email Address</div>
              <input className="sim-input" placeholder="name@example.com" readOnly />
            </div>
            <div className="sim-input-group">
              <div className="sim-label" style={{"display":"flex","justifyContent":"space-between"}}><span>Password</span><span style={{"color":"#606129","fontWeight":"500"}}>Forgot?</span></div>
              <input className="sim-input" type="password" value="••••••••" readOnly />
            </div>
            <button className="sim-btn">Enter Space</button>
            <div className="sim-divider">or continue with</div>
            <button className="sim-google">
              <svg width="14" height="14" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>
          </div>
          <div style={{"textAlign":"center","marginTop":"12px","fontSize":"11px","color":"var(--on-surface-variant)"}}>New to the breath? <strong style={{"color":"var(--primary)"}}>Create an Account</strong></div>
          <div style={{"textAlign":"center","marginTop":"auto","paddingTop":"12px","fontSize":"9px","letterSpacing":"0.08em","textTransform":"uppercase","color":"var(--outline)"}}>PRESENCE THROUGH FOCUS</div>
        </div>
      </div>
    </div>
<div className="phone-frame">
      <div className="phone-screen">
        <div className="sim-screen sim-focus">
          <div className="focus-header">
            <div className="focus-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="#0d2e19" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#0d2e19" strokeWidth="2" strokeLinecap="round"/></svg>
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
              <div className="ctrl-icon main" style={{"fontSize":"16px","color":"white"}}>⏸</div>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b1c15" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
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

<div className="testimonials" id="saathi" style={{"marginTop":"80px"}}>
  <p className="section-label" style={{"textAlign":"center"}}>From the community</p>
  <h2 className="section-title" style={{"textAlign":"center","marginBottom":"0"}}>What souls are saying.</h2>
  <div className="testimonials-grid">
    <div className="testimonial-card">
      <blockquote>"The breathing overlay actually stopped me mid-scroll three times yesterday. I didn't open Instagram once on autopilot. That's never happened."</blockquote>
      <div className="testimonial-author">
        <div className="author-avatar">🌿</div>
        <div>
          <div className="author-name">Aditi R.</div>
          <div className="author-role">Product designer, Bengaluru</div>
        </div>
      </div>
    </div>
    <div className="testimonial-card">
      <blockquote>"The focus rooms are unlike anything I've used. Knowing 12 strangers are working in silence with you is oddly motivating. No chat. No pings. Just time."</blockquote>
      <div className="testimonial-author">
        <div className="author-avatar">🧘</div>
        <div>
          <div className="author-name">Marcus L.</div>
          <div className="author-role">Researcher, Amsterdam</div>
        </div>
      </div>
    </div>
    <div className="testimonial-card">
      <blockquote>"Saathi doesn't feel like a bot. It asked me one question that I've been sitting with for two days. 'What are you actually looking for when you open your phone?'"</blockquote>
      <div className="testimonial-author">
        <div className="author-avatar">✨</div>
        <div>
          <div className="author-name">Priya K.</div>
          <div className="author-role">Writer, Mumbai</div>
        </div>
      </div>
    </div>
  </div>
</div>


<div id="signup">
  <div className="cta-section">
    <h2>Begin your journey.</h2>
    <p>A digital space that slows you down, so you can finally move with intent.</p>
    <button className="cta-btn" onClick={handleBeginJourney}>Enter Space — It's Free</button>
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
          <li><a href="#">Features</a></li>
          <li><a href="#">Focus Rooms</a></li>
          <li><a href="#">Saathi AI</a></li>
          <li><a href="#">App Protection</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Philosophy</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Careers</a></li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Legal</h4>
        <ul>
          <li><a href="/praana_legal.html">Privacy</a></li>
          <li><a href="/praana_legal.html">Terms</a></li>
          <li><a href="#">Cookie Policy</a></li>
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
