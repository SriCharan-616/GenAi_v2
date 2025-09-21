import React from 'react';
import { MessageCircle, Volume2 } from 'lucide-react';
import { useMyContext } from '../../services/translationContext';

const FloatingButtons = ({ speak, isSpeaking }) => {
  const { text } = useMyContext(); // get translations from context

  const handleVoiceClick = () => {
    // Speak the hero title and subtitle
    speak(`${text.heroTitle}. ${text.heroSubtitle}`);
  };

  const handleChatClick = () => {
    // In a real app, this would open a chat widget
    console.log('Opening chat...');
  };

  return (
    <>
      {/* Floating Chatbot */}
      <button 
        onClick={handleChatClick}
        className="fixed bottom-10 right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={text.chat || 'Open chat support'}
        title={text.chat || 'Chat with support'}
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Voice Assistant Button */}
      <button 
        onClick={handleVoiceClick}
        disabled={isSpeaking}
        className={`fixed bottom-32 right-6 bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
        aria-label={isSpeaking ? text.speaking || 'Speech in progress' : text.listen || 'Listen to page content'}
        title={isSpeaking ? text.speaking || 'Speaking...' : text.listen || 'Listen to page'}
      >
        <Volume2 className="w-6 h-6" aria-hidden="true" />
      </button>
    </>
  );
};

export default FloatingButtons;
