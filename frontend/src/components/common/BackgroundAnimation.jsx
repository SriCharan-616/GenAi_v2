import React from 'react';
import { ShoppingBag, Heart, Star } from 'lucide-react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Floating Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200/20 rounded-full animate-pulse"></div>
      <div 
        className="absolute top-1/4 right-20 w-32 h-32 bg-cyan-200/30 rounded-full animate-bounce" 
        style={{animationDelay: '1s'}}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-sky-200/25 rounded-full animate-pulse" 
        style={{animationDelay: '2s'}}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/20 rounded-full animate-bounce" 
        style={{animationDelay: '3s'}}
      ></div>
      
      {/* Floating Icons */}
      <div 
        className="absolute top-1/3 left-1/3 animate-float" 
        style={{animationDelay: '0.5s'}}
      >
        <ShoppingBag className="w-8 h-8 text-blue-300/40" />
      </div>
      <div 
        className="absolute top-2/3 right-1/3 animate-float" 
        style={{animationDelay: '1.5s'}}
      >
        <Heart className="w-6 h-6 text-cyan-300/40" />
      </div>
      <div 
        className="absolute bottom-1/3 left-2/3 animate-float" 
        style={{animationDelay: '2.5s'}}
      >
        <Star className="w-7 h-7 text-sky-300/40" />
      </div>
    </div>
  );
};

export default BackgroundAnimation;