import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center border border-stone-100">
        {status === "verifying" && (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-stone-800">Verifying Email...</h2>
            <p className="text-stone-500 mt-2">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-stone-800">Email Verified!</h2>
            <p className="text-stone-500 mt-2 mb-8">Your account has been successfully verified.</p>
            <Link
              to="/login"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors inline-block"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <FiXCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-stone-800">Verification Failed</h2>
            <p className="text-stone-500 mt-2 mb-8">The verification link is invalid or has expired.</p>
            <Link
              to="/login"
              className="px-8 py-3 bg-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-300 transition-colors inline-block"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
