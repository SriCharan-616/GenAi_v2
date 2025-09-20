import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import Button from '../ui/Button';

const ExploreMore = ({ translations }) => {
  const handleViewAll = () => {
    // In a real app, this would navigate to the products page
    console.log('Navigating to all products...');
  };

  return (
    <section 
      className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white relative overflow-hidden"
      aria-labelledby="explore-title"
    >
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 
          id="explore-title"
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          {translations[TRANSLATION_KEYS.EXPLORE_TITLE]}
        </h2>
        
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          {translations[TRANSLATION_KEYS.EXPLORE_SUBTITLE]}
        </p>
        
        <Button
          variant="secondary"
          size="lg"
          onClick={handleViewAll}
          className="bg-white text-blue-600 hover:bg-gray-100 border-0"
          icon={ArrowRight}
          iconPosition="right"
          ariaLabel="View all products in our marketplace"
        >
          {translations[TRANSLATION_KEYS.EXPLORE_VIEW_ALL]}
        </Button>
        </div>
      
      {/* Background decorative elements */}
      <div 
        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"
        aria-hidden="true"
      ></div>
      <div 
        className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-bounce"
        aria-hidden="true"
      ></div>
    </section>
  );
};

export default ExploreMore;