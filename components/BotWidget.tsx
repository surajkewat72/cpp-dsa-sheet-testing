"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";

export default function BotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "👋 Hi! I’m your DSAMate Bot. Tell me what you’ve done so far!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/bot-chat", {
        messages: updatedMessages,
      });

      const botReply = res.data.result;
      setMessages([...updatedMessages, { role: "bot", content: botReply }]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: "bot", content: "⚠️ Gemini API failed. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div ref={chatRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-12 xl:right-12 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-blue-700"
        style={{
          width: screenSize.width >= 1536 ? '8rem' : 
                 screenSize.width >= 1200 ? '7rem' : 
                 screenSize.width >= 900 ? '6rem' : 
                 screenSize.width >= 750 ? '5.5rem' : 
                 screenSize.width >= 640 ? '4rem' : '3rem',
          height: screenSize.width >= 1536 ? '8rem' : 
                  screenSize.width >= 1200 ? '7rem' : 
                  screenSize.width >= 900 ? '6rem' : 
                  screenSize.width >= 750 ? '5.5rem' : 
                  screenSize.width >= 640 ? '4rem' : '3rem'
        }}
      >
        <Image
          src="/assets/bot.gif"
          alt="BOT"
          width={80}
          height={80}
          className="object-contain"
          style={{
            width: screenSize.width >= 1536 ? '4.5rem' : 
                   screenSize.width >= 1280 ? '4rem' : 
                   screenSize.width >= 1024 ? '3.5rem' : 
                   screenSize.width >= 768 ? '3rem' : 
                   screenSize.width >= 640 ? '2.5rem' : '2rem',
            height: screenSize.width >= 1536 ? '4.5rem' : 
                    screenSize.width >= 1280 ? '4rem' : 
                    screenSize.width >= 1024 ? '3.5rem' : 
                    screenSize.width >= 768 ? '3rem' : 
                    screenSize.width >= 640 ? '2.5rem' : '2rem'
          }}
          unoptimized
        />
      </button>

      {open && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border flex flex-col absolute bottom-16 right-0 sm:bottom-auto sm:right-auto sm:relative"
             style={{
               width: screenSize.width >= 640 ? `${screenSize.width * 0.85}px` : 'calc(100vw - 1rem)',
               maxWidth: '85vw',
               height: screenSize.height >= 1200 ? `${screenSize.height * 0.70}px` : 
                       screenSize.height >= 900 ? `${screenSize.height * 0.68}px` : 
                       screenSize.height >= 700 ? `${screenSize.height * 0.65}px` : 
                       `${screenSize.height * 0.60}px`,
               maxHeight: '70vh'
             }}>
          <div className="flex-1 p-4 overflow-y-auto space-y-3" 
               style={{ 
                 maxHeight: `${screenSize.height * 0.55}px`,
                 fontSize: screenSize.width >= 900 ? '1rem' : '0.875rem'
               }}>
            {messages.map((msg, i) => {
  let contentElement;

  // Try to parse JSON
  try {
    const data = JSON.parse(msg.content);
    if (Array.isArray(data) && data[0]?.title && data[0]?.description) {
      // Render as question cards
      contentElement = (
        <div className="space-y-3">
          {data.map((q, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 bg-white text-black shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-blue-600 text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">{q.title}</h3>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mt-1">{q.description}</p>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl mt-2 text-gray-500">
                <b>Topic:</b> {q.topic} | <b>Level:</b> {q.level}
              </p>
            </div>
          ))}
        </div>
      );
    } else {
      contentElement = <span>{msg.content}</span>;
    }
  } catch {
    // Parse markdown-style formatting
    const formattedContent = msg.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
      .replace(/^(\d+\.)\s/gm, '<strong>$1</strong> '); // numbered lists
    
    contentElement = (
      <span 
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    );
  }

  return (
    <div
      key={i}
      className={`rounded-lg text-black whitespace-pre-line transition-all ${
        msg.role === "user"
          ? "bg-blue-100 text-right"
          : "bg-gray-100 text-left"
      }`}
      style={{
        padding: screenSize.width >= 1536 ? '1.5rem' : 
                 screenSize.width >= 1280 ? '1.25rem' : 
                 screenSize.width >= 1024 ? '1rem' : 
                 screenSize.width >= 768 ? '0.75rem' : '0.5rem',
        fontSize: screenSize.width >= 1536 ? '1.5rem' : 
                  screenSize.width >= 1280 ? '1.25rem' : 
                  screenSize.width >= 1024 ? '1.125rem' : 
                  screenSize.width >= 768 ? '1rem' : 
                  screenSize.width >= 640 ? '0.875rem' : '0.75rem',
        marginLeft: msg.role === "user" ? (screenSize.width >= 1024 ? '2rem' : '1rem') : '0',
        marginRight: msg.role === "bot" ? (screenSize.width >= 1024 ? '2rem' : '1rem') : '0'
      }}
    >
      {contentElement}
    </div>
  );
})}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What have you covered so far?"
                className="flex-grow border p-3 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{
                  fontSize: screenSize.width >= 900 ? '1rem' : '0.875rem'
                }}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className={`p-3 rounded-lg text-white transition-all duration-200 ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                }`}
              >
                <SendHorizonal 
                  size={screenSize.width >= 900 ? 20 : 16} 
                />
              </button>
            </div>
            {loading && (
              <p className="text-gray-500 mt-2 animate-pulse"
                 style={{
                   fontSize: screenSize.width >= 900 ? '1rem' : '0.875rem'
                 }}>🤖 Thinking...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
