import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-900 to-indigo-900 text-yellow-300 py-12 mt-auto border-t-2 border-yellow-300/30 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <img 
                src="/churpay_logo2.png" 
                alt="ChurPay Logo" 
                className="h-10 mr-2" 
              />
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200">ChurPay</span>
            </div>
            <p className="text-yellow-100/80 text-sm text-center md:text-left mb-4">
              Seamless giving solutions for faith communities worldwide.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-yellow-300 hover:text-yellow-400 transition-colors">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-200">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-200">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/testimonials" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-yellow-100 hover:text-yellow-300 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-200">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-yellow-100 text-sm">
                <FaEnvelope className="h-4 w-4 mr-2 text-yellow-300" />
                <a href="mailto:contact@churpay.com" className="hover:text-yellow-300 transition-colors">
                  contact@churpay.com
                </a>
              </li>
              <li className="flex items-center text-yellow-100 text-sm">
                <FaPhone className="h-4 w-4 mr-2 text-yellow-300" />
                <a href="tel:+1234567890" className="hover:text-yellow-300 transition-colors">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-yellow-300/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-yellow-100/70">
          <div className="mb-4 md:mb-0">
            ChurPay &copy; {new Date().getFullYear()} | Built for the Faith Community
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-yellow-300 transition-colors text-xs">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-yellow-300 transition-colors text-xs">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="hover:text-yellow-300 transition-colors text-xs">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}