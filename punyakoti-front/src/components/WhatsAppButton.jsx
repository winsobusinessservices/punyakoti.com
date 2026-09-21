import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = ({
  phoneNumber = "919876543210",
  message = "Hello! I would like to know more about Punyakoti dairy products.",
}) => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-hidden"
      aria-label="Contact support on WhatsApp"
    >
      <span className="absolute right-14 bg-emerald-500 text-white font-medium text-xs py-1.5 px-3 rounded-xl shadow-md opacity-0 translate-x-4 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
        Chat with Us
      </span>
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none"></span>
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
