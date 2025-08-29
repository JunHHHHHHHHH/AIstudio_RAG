import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
// FIX: Import BotIcon and UploadIcon to resolve missing component errors.
import { PaperclipIcon, SendIcon, XCircleIcon, BotIcon, UploadIcon } from './icons';
import ChatMessage from './ChatMessage';
import Spinner from './Spinner';

interface ChatPanelProps {
  messages: Message[];
  isModelLoading: boolean;
  onSendMessage: (prompt: string, imageBase64?: string, imageMimeType?: string) => void;
  isDocumentLoaded: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isModelLoading, onSendMessage, isDocumentLoaded }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ b64: string; mime: string; name: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isModelLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && isDocumentLoaded) {
      onSendMessage(prompt, image?.b64, image?.mime);
      setPrompt('');
      setImage(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = (loadEvent.target?.result as string).split(',')[1];
        setImage({ b64: base64, mime: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage(e);
      }
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-900 h-full">
      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isModelLoading && (
            <div className="flex items-start gap-4 my-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <BotIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
                    <Spinner size="5" />
                    <span className="ml-3 text-gray-400">Thinking...</span>
                </div>
            </div>
        )}
         {!isDocumentLoaded && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <UploadIcon className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-medium text-gray-300">Welcome to the RAG Chatbot</h2>
            <p>Please upload a PDF document using the panel on the left to begin.</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-700 bg-gray-800/50">
        <form onSubmit={handleSendMessage} className="relative">
          {image && (
            <div className="absolute bottom-full mb-2 left-0 w-full p-2 bg-gray-700 rounded-t-lg">
                <div className="flex items-center justify-between bg-gray-600 p-2 rounded">
                    <span className="text-sm text-gray-200 truncate">{image.name}</span>
                    <button onClick={() => setImage(null)} type="button" className="text-gray-400 hover:text-white">
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
          )}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={isDocumentLoaded ? "Ask a question about the document..." : "Upload a PDF to enable chat"}
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-4 pr-32 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={1}
            disabled={!isDocumentLoaded || isModelLoading}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <input type="file" ref={imageInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={!isDocumentLoaded || isModelLoading}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white disabled:text-gray-600 disabled:hover:bg-transparent"
            >
              <PaperclipIcon className="h-6 w-6" />
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || !isDocumentLoaded || isModelLoading}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
