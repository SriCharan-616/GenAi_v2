// SEO utilities for managing meta tags and structured data

export const updateMetaTags = (tags) => {
  Object.entries(tags).forEach(([name, content]) => {
    let element = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
    
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  });
};

export const updateTitle = (title) => {
  document.title = title;
  updateMetaTags({
    'og:title': title,
    'twitter:title': title
  });
};

export const setCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', url);
  } else {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    document.head.appendChild(canonical);
  }
};

export const addStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Homepage SEO configuration
export const homepageSEO = {
  title: 'ArtisanHub - Empower Your Craft | Handmade Products Marketplace',
  description: 'Upload, enhance, and share your beautiful handmade creations with the world. Join thousands of artisans growing their business on ArtisanHub.',
  keywords: 'handmade, artisan, crafts, marketplace, handcrafted, unique products, artisan hub, sell crafts',
  'og:title': 'ArtisanHub - Empower Your Craft',
  'og:description': 'Upload, enhance, and share your beautiful handmade creations with the world',
  'og:type': 'website',
  'og:url': window.location.href,
  'og:image': '/images/og-image.jpg',
  'og:site_name': 'ArtisanHub',
  'twitter:card': 'summary_large_image',
  'twitter:title': 'ArtisanHub - Empower Your Craft',
  'twitter:description': 'Upload, enhance, and share your beautiful handmade creations with the world',
  'twitter:image': '/images/twitter-image.jpg',
  'twitter:site': '@artisanhub',
  author: 'ArtisanHub Team',
  robots: 'index, follow',
  language: 'en',
  revisit: '7 days'
};

export const generateStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ArtisanHub",
  "description": "A marketplace for handmade and artisan products",
  "url": window.location.origin,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://www.facebook.com/artisanhub",
    "https://www.instagram.com/artisanhub",
    "https://www.twitter.com/artisanhub"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "ArtisanHub",
    "logo": {
      "@type": "ImageObject",
      "url": `${window.location.origin}/images/logo.png`
    }
  }
});

// Hook for managing SEO
import { useEffect } from 'react';

export const useSEO = (seoConfig) => {
  useEffect(() => {
    // Update title
    if (seoConfig.title) {
      updateTitle(seoConfig.title);
    }

    // Update meta tags
    const metaTags = { ...seoConfig };
    delete metaTags.title; // Remove title from meta tags as it's handled separately
    updateMetaTags(metaTags);

    // Set canonical URL
    if (seoConfig.canonical) {
      setCanonicalUrl(seoConfig.canonical);
    }

    // Add structured data
    if (seoConfig.structuredData) {
      addStructuredData(seoConfig.structuredData);
    }

    // Add hreflang for multilingual sites
    if (seoConfig.hreflang) {
      Object.entries(seoConfig.hreflang).forEach(([lang, url]) => {
        let link = document.querySelector(`link[hreflang="${lang}"]`);
        if (link) {
          link.setAttribute('href', url);
        } else {
          link = document.createElement('link');
          link.setAttribute('rel', 'alternate');
          link.setAttribute('hreflang', lang);
          link.setAttribute('href', url);
          document.head.appendChild(link);
        }
      });
    }
  }, [seoConfig]);
};