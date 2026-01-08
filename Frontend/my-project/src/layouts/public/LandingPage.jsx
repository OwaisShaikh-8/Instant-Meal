import React from 'react';
import img from '../../assets/images/Banner.webp';
import { Fade, Zoom } from 'react-awesome-reveal';
import { ChevronDown } from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LandingPage = () => {
  const reviews = [
    {
      name: 'Sara M.',
      role: 'Customer',
      quote: 'I picked up my meal in under 2 minutes. No waiting, no stress.',
      avatar: '👩'
    },
    {
      name: 'Ali R.',
      role: 'Restaurant Manager',
      quote: 'Managing orders during rush hour is finally under control.',
      avatar: '👨‍💼'
    },
    {
      name: 'Chef Imran',
      role: 'Head Chef',
      quote: 'The dashboard is a lifesaver for our kitchen staff.',
      avatar: '👨‍🍳'
    },
  ];

  return (
    <>
    <Navbar/>
      <div
        className="min-h-screen w-full bg-cover bg-center px-6 py-20 md:px-20 text-center md:text-start relative overflow-hidden flex items-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${img})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A3A3A]/70 to-[#FFA31A]/30 z-0"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <Fade direction="down" triggerOnce cascade damping={0.2}>
            <div className="w-full flex flex-col items-center text-center justify-center space-y-6">
              <h1 className="md:text-6xl text-4xl font-bold text-white leading-tight">
                Where <span className="text-[#FFA31A]">Food</span> Meets <span className="text-white">Efficiency</span>
              </h1>
              <p className="text-lg text-gray-200 leading-relaxed">
                Connecting hungry customers with restaurants — pre-order meals, skip the wait, while restaurants run smoothly with our intelligent management system.
              </p>

              <div className="pt-10 flex flex-col md:flex-row items-center gap-5">
                <button className="px-8 py-3 rounded-full font-medium text-white bg-[#FFA31A] hover:bg-[#FF8A00] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Order Your Meals
                </button>
                <button className="px-8 py-3 rounded-full font-medium text-[#3A3A3A] bg-white hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Join As a Restaurant
                </button>
              </div>
            </div>
          </Fade>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex">
          <div className="animate-bounce w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex md:hidden">
  <div className="flex flex-col items-center text-white animate-bounce">
    <ChevronDown size={28} className="text-white" />
    <span className="text-xs mt-1 tracking-wide">Swipe</span>
  </div>
</div>
      </div>
      
      {/* Section 2: How It Works */}
      <section className="py-24 px-6 md:px-20 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]">
        <div className="max-w-6xl mx-auto">
          <Fade direction="up" triggerOnce>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">Streamlined Operations</h2>
              <div className="w-20 h-1 bg-[#FFA31A] mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform delivers a seamless experience designed for both customers and restaurant teams.
              </p>
            </div>
          </Fade>

          <div className="grid md:grid-cols-2 gap-10">
            <Zoom triggerOnce>
              {/* Customer Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#FFA31A] transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#FFF5E6] flex items-center justify-center mr-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#3A3A3A]">For Customers</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Browse meals & schedule pickup</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Secure online payment system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Real-time order tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Direct chat with restaurant staff</span>
                  </li>
                </ul>
              </div>

              {/* Restaurant Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#3A3A3A] transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E9ECEF] flex items-center justify-center mr-4">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#3A3A3A]">For Restaurants</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Pre-orders with time slot management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Kitchen workflow optimization tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Live order status updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span className="text-gray-700">Customer engagement platform</span>
                  </li>
                </ul>
              </div>
            </Zoom>
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <Fade direction="right" triggerOnce>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">Trusted By Industry Professionals</h2>
              <div className="w-20 h-1 bg-[#FFA31A] mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from those who have transformed their food service experience with our platform.
              </p>
            </div>
          </Fade>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Fade direction="left" triggerOnce delay={index * 100} key={index}>
                <div className="bg-gradient-to-br from-[#FFF7E8] to-[#FFE5B4] p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 relative">
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-[#FFA31A] rounded-full flex items-center justify-center text-white">
                    {review.avatar}
                  </div>
                  <div className="pt-4">
                    <p className="text-gray-700 italic text-lg leading-relaxed">"{review.quote}"</p>
                    <div className="mt-6 flex items-center">
                      <div className="ml-2">
                        <div className="font-semibold text-[#3A3A3A]">{review.name}</div>
                        <div className="text-sm text-[#FFA31A]">{review.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}

export default LandingPage;