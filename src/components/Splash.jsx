import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to login after 3 seconds to simulate splash
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Simple CSS logo representing the 3 dots */}
        <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 16px auto', borderRadius: '50%', border: '1px solid rgba(26, 59, 43, 0.1)' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid var(--color-primary)' }}></div>
          <div style={{ position: 'absolute', top: '24px', left: '10px', width: '14px', height: '14px', borderRadius: '50%', border: '3px solid var(--color-primary)' }}></div>
          <div style={{ position: 'absolute', bottom: '10px', right: '22px', width: '10px', height: '10px', borderRadius: '50%', border: '3px solid var(--color-primary)' }}></div>
        </div>
        
        <h1 style={{ fontSize: '28px', marginBottom: '0' }}>Praana</h1>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '2px', backgroundColor: 'rgba(26, 59, 43, 0.4)', margin: '0 auto 16px auto' }}></div>
        <p style={{ fontSize: '11px', letterSpacing: '1px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
          Awareness before impulse.
        </p>
      </div>
    </div>
  );
}
