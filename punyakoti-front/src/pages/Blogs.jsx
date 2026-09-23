import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiArrowRight } from "react-icons/fi";

const Blogs = () => {
  // Mock Blog Data
  const mockBlogs = [
    {
      id: 1,
      title: "Top 5 Dietary Supplements for Better Cattle Health",
      excerpt:
        "Discover the science behind our premium livestock supplements and why adding essential vitamins and minerals can drastically improve your herd's immunity.",
      image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Health & Nutrition",
      date: "Oct 12, 2026",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Choosing the Right Feed for High Yield",
      excerpt:
        "What makes a cattle feed optimal? We take a deep dive into protein content, roughage balance, and seasonal feeding strategies.",
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Agriculture",
      date: "Oct 05, 2026",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Essential Grooming Tips for Your Livestock",
      excerpt:
        "Keep your cows clean and free from pests. Learn about the best organic grooming brushes, tick repellants, and hygiene routines for your farm.",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Farm Care",
      date: "Sep 28, 2026",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Preventative Care for Common Cattle Diseases",
      excerpt:
        "From hoof infections to mastitis, learn how early detection and the right preventative care products can save your farm time and money.",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Veterinary",
      date: "Sep 15, 2026",
      readTime: "3 min read",
    },
    {
      id: 5,
      title: "Optimizing Your Milking Parlor Equipment",
      excerpt:
        "Ensure maximum efficiency and comfort for your cows. A guide to maintaining and upgrading your milking machines and sanitization supplies.",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Equipment",
      date: "Sep 02, 2026",
      readTime: "7 min read",
    },
    {
      id: 6,
      title: "Calf Nutrition: The First 90 Days",
      excerpt:
        "A comprehensive guide to calf starter feed, milk replacers, and creating a strong foundation for the future of your herd.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      category: "Breeding",
      date: "Aug 22, 2026",
      readTime: "5 min read",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Header */}
      <section className="bg-gray-900 text-white py-20 text-center relative overflow-hidden">
        {/* Subtle blur circles */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gray-700/50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-5 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">
            Punyakoti Journal
          </h1>
          <p className="text-stone-300 text-lg">
            Insights on livestock health, farm management, and agricultural supplies.
          </p>
        </div>
      </section>

      {/* Featured / Latest Post (optional hero block) */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 mt-12 mb-16">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/60 flex flex-col lg:flex-row group cursor-pointer hover:shadow-md transition-shadow">
          <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
            <img 
              src={mockBlogs[0].image} 
              alt={mockBlogs[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {mockBlogs[0].category}
              </span>
              <span className="text-stone-400 text-sm flex items-center gap-1.5">
                <FiClock className="w-4 h-4" />
                {mockBlogs[0].readTime}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-stone-850 mb-4 group-hover:text-primary transition-colors">
              {mockBlogs[0].title}
            </h2>
            <p className="text-stone-500 mb-8 line-clamp-3 leading-relaxed">
              {mockBlogs[0].excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-semibold text-stone-400">
                {mockBlogs[0].date}
              </span>
              <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Read Article <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-24">
        <h3 className="text-2xl font-display font-bold text-stone-850 mb-8">Latest Articles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.slice(1).map((blog) => (
            <article key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-lg transition-all group flex flex-col cursor-pointer">
              {/* Image */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-stone-800 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold mb-3">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {blog.readTime}
                  </span>
                </div>
                
                <h4 className="text-xl font-display font-bold text-stone-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h4>
                
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {blog.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-stone-100">
                  <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More <FiArrowRight />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button (Mock) */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
            Load More Articles
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
