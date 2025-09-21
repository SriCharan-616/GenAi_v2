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
  emailOrphone:'Email or Phone no.',
  enterEmailOrPhone:'Enter your email or phone',
  password:'Password',
  emailOrPhoneRequired:'Email/Phone is required',
  passwordRequired:'Password is required',
  enterPassword:'Enter your password',
  signIn:'Sign In',
  noAccount:'Don\'t have an account?',
  signingIn:'Signing In...',
  artisanSignup:'Register as Artisan',
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
  review3: 'Easy to use even for someone like me who\'s not tech-savvy. Wonderful!',
  authSellBuyContext: 'Want to sell your crafts or buy unique items?',
  authSignin: 'Sign In',
  authRegister: 'Register',
  authOr: 'or',
  welcomeBack:'Welcome Back',
  loginDescription:'Sign in to your ArtisanHub account',
  artwelcome:'Join thousands of artisans and customers in our growing marketplace',
  exploreTitle: 'Explore More Products',
  exploreSubtitle: 'Discover thousands of unique handmade products',
  exploreViewAll: 'View All',
  commonListen: 'Listen',
  commonDiscover: 'Discover More',
  errorTranslationFetch: 'Unable to load translations. Using default language.',
  errorSpeechNotSupported: 'Text-to-speech is not supported in your browser.',
  errorGeneric: 'Something went wrong. Please try again.',
  welcome: "Welcome",
  artisanDashboard: "Manage your artisan business and showcase your products",
  createProduct: "Create Product",
  creatingProduct: "Creating Product...",
  createNewProduct: "Create New Product",
  productName: "Product Name",
  enterProductName: "Enter product name",
  category: "Category",
  selectCategory: "Select category",
  price: "Price",
  description: "Description",
  enterDescription: "Describe your product, materials used, dimensions, etc.",
  productPhoto: "Product Photo",
  preview: "Preview",
  addNewProduct: "Add New Product",
  myProducts: "My Products",
  edit: "Edit",
  delete: "Delete",
  noProducts: "No Products Yet",
  createFirstProduct: "Create your first product to start showcasing your craftsmanship.",
  createFirstProductBtn: "Create Your First Product",
  photoRequired: "Product photo is required",
  photoTooLarge: "Photo size must be less than 5MB",
  productNameRequired: "Product name is required",
  descriptionRequired: "Description is required",
  descriptionTooShort: "Description must be at least 20 characters",
  priceRequired: "Valid price is required",
  categoryRequired: "Category is required",
  productCreationError: "Failed to create product. Please try again.",
  speechNotSupported: "Text-to-speech is not supported in your browser.",
  selectCategory : [
  'woodwork', 'pottery', 'textiles', 'jewelry',
  'metalwork', 'paintings', 'sculptures', 'glasswork',
  'leatherwork', 'ceramics', 'other'
]
};

export function MyProvider({ children }) {
  const [text, setText] = useState(() => {
    
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
