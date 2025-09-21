import React, { createContext, useState, useContext, useEffect } from "react";

const MyContext = createContext();

// Default translations
const defaultText = {
  home: 'Home',
  explore: 'Explore Products',
  about: 'About Us',
  contact: 'Contact',
  signin: 'Sign In',
  register: 'Register',
  myProfile: 'My Profile',
  logout: 'Logout',
  heroTitle: 'Empower Your Craft',
  heroSubtitle: 'Upload, enhance, and share your beautiful creations with the world',
  heroListen: 'Listen to Introduction',
  introWhoWeAre: 'Who We Are',
  introText: 'We help artisans showcase their beautiful handmade products with enhanced images and easy social media sharing. Join thousands of creators growing their business with us.',
  productsTrending: 'Trending',
  productsSeasonal: 'Seasonal',
  productsBestselling: 'Bestselling',
  sampleTitle: 'Sample Enhanced Images',
  sampleBefore: 'Before',
  sampleAfter: 'After',
  reviewsTitle: 'What Our Artisans Say',
  review1: 'This platform transformed my small pottery business! Sales increased by 300%.',
  review2: 'The image enhancement feature is amazing. My products look professional now.',
  authSellBuyContext: 'Want to sell your crafts or buy unique items?',
  authSignin: 'Sign In',
  authRegister: 'Register',
  authOr: 'or',
  exploreTitle: 'Explore More Products',
  exploreSubtitle: 'Discover thousands of unique handmade products',
  exploreViewAll: 'View All',
  commonListen: 'Listen',
  commonDiscover: 'Discover More',
  errorTranslationFetch: 'Unable to load translations. Using default language.',
  errorSpeechNotSupported: 'Text-to-speech is not supported in your browser.',
  errorGeneric: 'Something went wrong. Please try again.'
};

export function MyProvider({ children }) {
  const [text, setText] = useState(() => {
    // Check sessionStorage first
    const cached = sessionStorage.getItem("translations");
    return cached ? JSON.parse(cached) : defaultText;
  });

  // Save to sessionStorage whenever text changes
  useEffect(() => {
    sessionStorage.setItem("translations", JSON.stringify(text));
  }, [text]);

  return (
    <MyContext.Provider value={{ text, setText }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  return useContext(MyContext);
}
