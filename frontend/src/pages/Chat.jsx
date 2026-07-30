import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import chatService from '../services/chatService';
import documentService from '../services/documentService';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Terminal, ShieldCheck, Sparkles, AlertCircle, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_QUESTIONS = [
  "How to use list comprehensions with conditional logic in Python?",
  "Explain the Global Interpreter Lock (GIL) and asyncio concurrency.",
  "What is the difference between __init__ and __call__ in Python classes?",
  "How do python decorators work under the hood?"
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [documents, setDocuments] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const fetchInitialData = async () => {
    try {
      const [historyData, docsData] = await Promise.all([
        chatService.getHistory(),
        documentService.getDocuments()
      ]);
      
      const formattedMessages = [];
      historyData.forEach((item) => {
        formattedMessages.push({
          id: `u-${item.id}`,
          sender: 'user',
          text: item.prompt,
          timestamp: item.created_at
        });
        formattedMessages.push({
          id: `a-${item.id}`,
          sender: 'assistant',
          prompt: item.prompt,
          text: item.response,
          sources: item.sources,
          is_python_query: item.is_python_query,
          timestamp: item.created_at
        });
      });

      setMessages(formattedMessages);
      setDocuments(docsData);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    const userMsgId = Date.now();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setSending(true);

    try {
      const res = await chatService.sendMessage(text);
      const newAiMsg = {
        id: res.id,
        sender: 'assistant',
        prompt: res.prompt,
        text: res.response,
        sources: res.sources,
        is_python_query: res.is_python_query,
        timestamp: res.created_at
      };
      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "I encountered an issue processing your request. Please ensure backend server is reachable.",
        is_python_query: true,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner label="Loading Chat Workspace..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto">
        {/* Chat Messages Body Container */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px] shadow-2xl">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Ask Anything About Python</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  I answer <span className="text-amber-400 font-semibold">ONLY</span> Python-related queries. Non-Python questions (sports, politics, general math, movies) are automatically rejected.
                </p>
              </div>

              {/* Sample Prompt Chips */}
              <div className="w-full space-y-2 text-left">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suggested Questions</p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/40 text-left text-xs text-slate-300 transition flex items-center justify-between group"
                    >
                      <span>{q}</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onRegenerate={msg.sender === 'assistant' ? handleSendMessage : null}
              />
            ))
          )}

          {sending && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div className="shrink-0 pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            onClearChat={messages.length > 0 ? handleClearHistory : null}
            disabled={sending}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
