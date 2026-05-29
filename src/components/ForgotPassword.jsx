import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header Logo */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <div style={{ position: 'absolute', top: '0px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
            <div style={{ position: 'absolute', top: '8px', left: '0px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
            <div style={{ position: 'absolute', bottom: '0px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Praana</h2>
        </div>
      </div>

      {/* Decorative Image area */}
      <div style={{ 
        height: '180px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        background: 'linear-gradient(to bottom, #a3c4b0, #cde3d6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(90, 91, 44, 0.1)'
      }}>
        {/* Abstract shape representing the design in mockup */}
        <div style={{
          width: '80%',
          height: '120%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.4), transparent)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'translateY(20px)'
        }}></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px' }}>Sometimes we all need a reset.</h1>
        <p className="subtitle" style={{ marginBottom: '8px', fontStyle: 'normal' }}>
          If you've forgotten your path back, enter your email and we'll help you find it.
        </p>
      </div>

      <div style={{ flex: 1, backgroundColor: 'rgba(231, 246, 230, 0.3)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(194, 200, 192, 0.3)', backdropFilter: 'blur(4px)' }}>
        <div className="input-group">
          <label style={{ fontSize: '12px', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
          <div className="input-wrapper">
            <input type="email" placeholder="name@example.com" />
            <Mail className="input-icon" size={18} />
          </div>
        </div>

        <button className="btn btn-primary mt-4">
          Reset password
        </button>
      </div>

      <div style={{ marginTop: '32px' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: '500' }}>
          <ArrowLeft size={18} />
          Back to login
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px', fontSize: '10px', letterSpacing: '1px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
        INNER PEACE THROUGH INTENTIONALITY
      </div>
    </div>
  );
}
