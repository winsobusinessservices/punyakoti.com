import React, { useState } from "react";
import { FiPhone, FiMessageCircle, FiUser, FiMail, FiTag } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { contactApi } from "../api/contactApi";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: contactApi.submitContact,
    onSuccess: () => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-white py-16 lg:py-24 px-5 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-gray-900">
          Contact Us
        </h1>
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          Feel free to contact us? submit your queries here and we will listen
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1 */}
          <div className="bg-primary text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group flex-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10 transition-transform duration-500 group-hover:scale-150"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-white/90">
                  Call Us Directly At
                </span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-display font-bold tracking-wider mb-8 drop-shadow-sm">
                +91 98765 43210
              </h3>
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3.5 rounded-2xl transition-colors backdrop-blur-md relative z-10">
              Contact Us
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-100 text-gray-900 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group border border-gray-200 flex-1">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-200">
                  <FiMessageCircle className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Chat With Our Team
                </span>
              </div>
              <h3 className="text-2xl lg:text-[28px] font-display font-bold tracking-tight mb-8">
                support@punyakoti.com
              </h3>
            </div>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3.5 rounded-2xl transition-colors relative z-10">
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 h-full flex flex-col justify-center">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                  className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <FiTag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                  className="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Message Here..."
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-800 placeholder-gray-400 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg active:scale-[0.99] mt-2 text-sm md:text-base"
              >
                {mutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
