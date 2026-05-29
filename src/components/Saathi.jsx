import './app-pages.css';
import { Sparkles, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Saathi() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Take a deep breath. I'm here to hold space for whatever is weighing on you.", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : message;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { text, isBot: false }];
    setMessages(newMessages);
    setMessage('');
    setIsTyping(true);

    try {
      // We use a generic user ID since no login is required
      let userId = localStorage.getItem('praana_userId');
      if (!userId) {
        userId = 'web-guest-' + Math.random().toString(36).substring(7);
        localStorage.setItem('praana_userId', userId);
      }

      // Convert local state messages to the format the API expects
      const chatHistory = newMessages.map(m => ({
        text: m.text,
        isFromUser: !m.isBot
      }));

      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3000/api/saathi/chat'
        : 'https://saathi-chat-bot.onrender.com/api/saathi/chat';
        
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: text, chatHistory })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { text: data.reply || "Sorry, I'm resting right now.", isBot: true, highlight: data.emotion === 'crisis' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Saathi is resting right now. Try again in a moment.", isBot: true }]);
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
              {isTyping ? 'Thinking...' : 'Listening quietly'}
            </div>
          </div>
        </div>
      </header>

      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.isBot ? 'bot' : 'user'} ${msg.highlight ? 'highlight' : ''}`}>
            <div className="msg-bubble" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}></div>
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
          <button className="chip" onClick={() => handleSend("I can't focus")}>I can't focus</button>
          <button className="chip" onClick={() => handleSend("I feel tired")}>I feel tired</button>
          <button className="chip" onClick={() => handleSend("Help me")}>Help me</button>
        </div>
        
        <div className="message-input-wrapper">
          <input 
            type="text" 
            placeholder="Type your thoughts..." 
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
