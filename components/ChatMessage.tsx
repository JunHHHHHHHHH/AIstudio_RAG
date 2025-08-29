
import React from 'react';
import { Role } from '../types';
import type { Message } from '../types';
import { BotIcon, UserIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
          <BotIcon className="h-6 w-6 text-blue-400" />
        </div>
      )}
      <div className={`max-w-xl p-4 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.image && (
          <div className="mt-4">
            <img src={message.image} alt="User upload" className="rounded-lg max-w-xs" />
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
