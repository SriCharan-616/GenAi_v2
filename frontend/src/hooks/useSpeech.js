import { useState, useCallback } from 'react';

export const useSpeech = (selectedLanguage = 'en') => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState('speechSynthesis' in window);

  const getLanguageCode = (lang) => {
    const languageMap = {
      'hi': 'hi-IN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ar': 'ar-SA',
      'en': 'en-US'
    };
    return languageMap[lang] || 'en-US';
  };

  const speak = useCallback((text) => {
    if (!isSupported) {
      console.error('Text-to-speech is not supported in this browser');
      return false;
    }

    if (!text || text.trim() === '') {
      console.warn('No text provided for speech');
      return false;
    }

    try {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Failed to start speech synthesis:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [selectedLanguage, isSupported]);

  const stop = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
};