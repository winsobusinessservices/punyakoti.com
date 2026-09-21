import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[radial-gradient(#e2dfd2_1px,transparent_1px)] [background-size:20px_20px]">
      {/* Abstract warm organic shapes for modern aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-secondary/5 blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-stone-200/50 relative overflow-hidden">
        {/* Decorative gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-light to-secondary"></div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
