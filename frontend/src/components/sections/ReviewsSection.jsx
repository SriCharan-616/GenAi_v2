import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { LazyImage } from '../../utils/lazyLoading';
import Card from '../ui/Card';

const ReviewsSection = ({ translations }) => {
  const [currentReview, setCurrentReview] = useState(0);
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const reviews = [
    { 
      name: "Maria Rodriguez", 
      rating: 5, 
      text: "This platform transformed my small pottery business! Sales increased by 300%.", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e6cd?w=60",
      location: "Mexico City"
    },
    { 
      name: "James Chen", 
      rating: 5, 
      text: "The image enhancement feature is amazing. My products look professional now.", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60",
      location: "San Francisco"
    },
    { 
      name: "Priya Sharma", 
      rating: 5, 
      text: "Easy to use even for someone like me who's not tech-savvy. Wonderful!", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60",
      location: "Mumbai"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handleIndicatorClick = (index) => {
    setCurrentReview(index);
  };

  return (
    <section 
      id="reviews-section" 
      ref={elementRef}
      className="py-16 px-4"
      aria-labelledby="reviews-title"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div className={`text-center transition-all duration-1000 delay-500 ${hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 
            id="reviews-title"
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-800"
          >
            {translations[TRANSLATION_KEYS.REVIEWS_TITLE]}
          </h2>
          
          <Card 
            className="p-8 md:p-12 shadow-xl"
            hover={false}
          >
            <div className="flex flex-col items-center">
              <LazyImage 
                src={reviews[currentReview].avatar} 
                alt={`${reviews[currentReview].name} profile picture`}
                className="w-20 h-20 rounded-full mb-6 border-4 border-blue-200"
                placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5NDk0YTQiPkF2YXRhcjwvdGV4dD48L3N2Zz4="
              />
              
              <div className="flex mb-4" role="img" aria-label={`${reviews[currentReview].rating} out of 5 stars`}>
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-6 h-6 text-yellow-400 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-600 mb-6 italic leading-relaxed max-w-3xl">
                "{reviews[currentReview].text}"
              </blockquote>
              
              <div className="text-center">
                <cite className="font-bold text-lg text-gray-800 not-italic">
                  {reviews[currentReview].name}
                </cite>
                <p className="text-gray-500 text-sm mt-1">
                  {reviews[currentReview].location}
                </p>
              </div>
            </div>
            
            {/* Review Navigation */}
            <div 
              className="flex justify-center mt-8 gap-2"
              role="tablist"
              aria-label="Review navigation"
            >
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    index === currentReview 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  role="tab"
                  aria-selected={index === currentReview}
                  aria-label={`View review from ${reviews[index].name}`}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;