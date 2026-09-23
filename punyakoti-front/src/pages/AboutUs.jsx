import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiHeart, FiShield, FiSun } from "react-icons/fi";

const AboutUs = () => {
  const values = [
    {
      icon: <FiHeart className="w-6 h-6 text-red-500" />,
      title: "Animal Wellbeing First",
      desc: "Our products are designed to enhance the health, comfort, and productivity of your livestock.",
    },
    {
      icon: <FiSun className="w-6 h-6 text-yellow-500" />,
      title: "Scientifically Formulated",
      desc: "We combine agricultural science with practical farming needs to create optimal nutritional and care solutions.",
    },
    {
      icon: <FiShield className="w-6 h-6 text-green-500" />,
      title: "Quality & Safety Tested",
      desc: "Every product undergoes rigorous testing to ensure it meets the highest standards for livestock safety.",
    },
    {
      icon: <FiCheckCircle className="w-6 h-6 text-blue-500" />,
      title: "Trusted by Farmers",
      desc: "Partnering with dairy and cattle farmers worldwide to provide reliable, farm-tested equipment and supplies.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          {/* A subtle background gradient or texture could go here */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 leading-tight">
            Empowering Farmers, <br className="hidden sm:block" />
            Protecting Livestock
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed mb-10">
            Punyakoti is dedicated to providing high-quality cattle feed, veterinary supplements, and farming equipment to ensure your livestock remains healthy, happy, and highly productive.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-850">
              Your Partner in Agriculture
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
            <p className="text-stone-600 leading-relaxed">
              Our journey began with a simple vision: to bridge the gap between traditional cattle farming and modern, scientifically-backed agricultural supplies. In an era of demanding yield requirements, we wanted to create a platform where farmers could easily access the best resources for their animals.
            </p>
            <p className="text-stone-600 leading-relaxed">
              At Punyakoti, we understand that healthy livestock is the backbone of any successful farm. Whether it is premium cattle feed, essential vitamins, organic grooming products, or robust milking essentials, we source and manufacture products that prioritize the wellbeing of your herd.
            </p>
            <p className="text-stone-600 leading-relaxed font-semibold">
              We don't just sell supplies; we deliver health, resilience, and operational efficiency to farms across the country.
            </p>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden shadow-xl relative">
              {/* Placeholder for an image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-200 to-stone-100 flex items-center justify-center">
                <span className="text-stone-400 font-semibold tracking-widest uppercase">Farm Supplies Image</span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full -z-10 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-stone-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-850 mb-12 sm:mb-16">
            The Punyakoti Promise
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center mb-6 mx-auto">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{val.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 max-w-5xl mx-auto px-5 text-center">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-stone-850 mb-6">
          Elevate Your Farm's Productivity
        </h2>
        <p className="text-stone-500 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of successful farmers who trust Punyakoti for their premium cattle feed, supplements, and agricultural supplies.
        </p>
        <Link
          to="/products"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Explore Our Products
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
