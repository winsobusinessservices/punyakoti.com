import React, { useState, useRef, useEffect } from "react";
import { FiX, FiSend } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { chatbotQuestions, defaultResponse } from "../data/chatbotQuestions";
import AnimatedBot from "./AnimatedBot";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to Punyakoti. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendQuestion = (questionObj) => {
    const userMsg = { sender: "user", text: questionObj.question };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: questionObj.answer },
      ]);
    }, 600);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    const userQuery = inputText.trim().toLowerCase();
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Match query with preset answers
      const matched = chatbotQuestions.find(
        (q) =>
          userQuery.includes(q.question.toLowerCase()) ||
          q.question.toLowerCase().includes(userQuery),
      );

      const botReply = matched ? matched.answer : defaultResponse;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 850);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-hidden relative cursor-pointer border-0 bg-transparent p-0"
        aria-label="Open Chatbot Assistant"
      >
        <span className="absolute right-16 bg-primary text-white font-medium text-xs py-1.5 px-3 rounded-xl shadow-md opacity-0 translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
          Ask Assistant
        </span>
        {isOpen ? (
          <FiX className="w-8 h-8 text-stone-600 bg-white border border-stone-200/80 p-1.5 rounded-full shadow-md shrink-0" />
        ) : (
          <AnimatedBot className="w-14 h-14" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute right-0 bottom-16 w-80 md:w-96 h-[450px] bg-white border border-stone-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-float-up">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                <AnimatedBot className="w-7 h-7 mt-1.5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm">
                  Punyakoti Assistant
                </h4>
                <p className="text-[10px] text-stone-200">
                  Online | Organic Help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all focus:outline-hidden"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-secondary text-primary-dark font-medium rounded-tr-none"
                      : "bg-white text-stone-700 shadow-xs border border-stone-200/60 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-stone-200/60 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Questions Suggestions */}
          <div className="px-4 py-2 border-t border-stone-100 bg-white space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1">
              {chatbotQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSendQuestion(q)}
                  className="text-[11px] font-medium text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/10 px-2.5 py-1 rounded-full transition-all text-left"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendText}
            className="p-3 border-t border-stone-150 bg-stone-50 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything..."
              className="flex-grow bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-light text-white p-2 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center focus:outline-hidden"
              aria-label="Send message"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
