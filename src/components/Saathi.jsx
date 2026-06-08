import './app-pages.css';
import { Sparkles, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';

export default function Saathi() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    const storedName = localStorage.getItem('praana_userName') || 'Friend';
    const firstName = storedName.split(' ')[0];
    setUserName(firstName);
    
    let userId = localStorage.getItem('praana_userId');
    if (!userId) {
      userId = 'web-guest-' + Math.random().toString(36).substring(7);
      localStorage.setItem('praana_userId', userId);
    }

    // Check for mission context passed from Plan.jsx
    if (location.state?.missionContext) {
      setTimeout(() => {
        handleSend(location.state.missionContext);
      }, 300);
      // Clear the state so a refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
      return;
    }

    setIsTyping(true);

    const fetchWelcomeMessage = async () => {
      try {
        const welcomeUrl = import.meta.env.DEV 
          ? 'http://localhost:3000/api/v1/chat/welcome'
          : 'https://saathi-chat-bot.onrender.com/api/v1/chat/welcome';
          
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : '';
          
        const res = await fetch(welcomeUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            userId,
            behavioralContext: {
              emotionalState: 'neutral',
              repeatOpenCount: 1
            },
            language: i18n.language
          })
        });
        
        const data = await res.json();
        
        setMessages([
          { 
            text: data.saathi?.message || data.reply || t('saathi.welcomeFallback', { name: firstName }), 
            isBot: true, 
            isWelcome: true 
          }
        ]);
      } catch (err) {
        const hour = new Date().getHours();
        let greetingKey = 'home.goodEvening';
        if (hour >= 5 && hour < 12) greetingKey = 'home.goodMorning';
        else if (hour >= 12 && hour < 17) greetingKey = 'home.goodAfternoon';
        
        setMessages([
          { text: t('saathi.greetingFallback', { greeting: t(greetingKey), name: firstName }), isBot: true, isWelcome: true }
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : message;
    if (!text.trim()) return;

    setMessage('');
    setIsTyping(true);

    let currentHistory = [];

    // Add user message safely using functional update
    setMessages(prev => {
      const newMessages = [...prev, { text, isBot: false }];
      currentHistory = newMessages.map(m => ({
        text: m.text,
        isFromUser: !m.isBot
      }));
      return newMessages;
    });

    try {
      // We use a generic user ID since no login is required
      let userId = localStorage.getItem('praana_userId');
      if (!userId) {
        userId = 'web-guest-' + Math.random().toString(36).substring(7);
        localStorage.setItem('praana_userId', userId);
      }

      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3000/api/v1/chat'
        : 'https://saathi-chat-bot.onrender.com/api/v1/chat';
        
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';
        
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, userName, message: text, chatHistory: currentHistory, language: i18n.language })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { text: data.reply || t('saathi.errorResting'), isBot: true, highlight: data.emotion === 'crisis' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: t('saathi.errorNetwork'), isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="page-container saathi-page">
      <header className="page-header space-between">
        <div className="header-brand">
          <Sparkles size={24} color="var(--primary)" />
          <div className="saathi-title-group">
            <h2>Saathi</h2>
            <div className="saathi-status">
              <span className="status-dot"></span>
              {isTyping ? t('saathi.thinking') : t('saathi.listening')}
            </div>
          </div>
        </div>
      </header>

      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.isBot ? 'bot' : 'user'} ${msg.highlight ? 'highlight' : ''} ${msg.isWelcome ? 'welcome-message flex flex-col items-center mt-12' : ''}`}>
            {msg.isWelcome && (
              <div className="glowing-orb-wrapper relative flex justify-center items-center mb-6">
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[#c3e5b2] to-[#1a3821] blur-xl animate-pulse opacity-60"></div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-surface-mint to-white flex items-center justify-center shadow-[0_0_30px_rgba(195,229,178,0.6)] border border-white/50">
                  <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                </div>
              </div>
            )}
            <div className={`msg-bubble ${msg.isWelcome ? 'text-center text-lg md:text-xl font-medium bg-transparent shadow-none !text-primary px-4' : ''}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}></div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message bot">
            <div className="msg-bubble" style={{ letterSpacing: '2px', fontStyle: 'italic' }}>
              . . .
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="suggestion-chips">
          <button className="chip" onClick={() => handleSend(t('saathi.cantFocus'))}>{t('saathi.cantFocus')}</button>
          <button className="chip" onClick={() => handleSend(t('saathi.feelTired'))}>{t('saathi.feelTired')}</button>
          <button className="chip" onClick={() => handleSend(t('saathi.helpMe'))}>{t('saathi.helpMe')}</button>
        </div>
        
        <div className="message-input-wrapper">
          <input 
            type="text" 
            placeholder={t('saathi.typeThoughts')} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" disabled={!message.trim()} onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
