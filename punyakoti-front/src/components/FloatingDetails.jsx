import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail, FiMapPin, FiPhoneCall } from "react-icons/fi";

const FloatingDetails = () => {
  return (
    <div className="w-full mt-1 overflow-hidden whitespace-nowrap bg-[#ECEDEE]">
      <div className="animate-marquee py-1.5 font-semibold flex items-center gap-12 w-full text-xs sm:text-sm px-4">
        <div className="flex items-center gap-2 shrink-0">
          <FiPhoneCall className="text-primary" />
          <p>+91 98765 43210</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FiMail className="text-primary" />
          <p>support@punyakoti.com</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FiMapPin className="text-primary" />
          <p>Punyakoti Farms, Organic Zone, Bengaluru, Karnataka, 560001</p>
        </div>
        <span className="flex gap-3 items-center shrink-0">
          <p className="text-stone-600">Follow Us:</p>
          <div className="flex gap-3">
            <FaFacebookF className="hover:text-primary cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-primary cursor-pointer transition-colors" />
            <FaYoutube className="hover:text-primary cursor-pointer transition-colors" />
            <FaTwitter className="hover:text-primary cursor-pointer transition-colors" />
          </div>
        </span>
      </div>
    </div>
  );
};

export default FloatingDetails;
