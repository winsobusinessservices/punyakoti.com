import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotButton from '../components/ChatbotButton';
import WhatsAppButton from '../components/WhatsAppButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-warm-bg">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatbotButton />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
