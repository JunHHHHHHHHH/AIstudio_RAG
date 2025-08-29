
import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import ChatPanel from './components/ChatPanel';
import type { Document, Message } from './types';
import { Role } from './types';
import { parsePdf } from './services/pdfParser';
import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);
  
  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessingPdf(true);
    setPdfError(null);
    setDocument(null);
    setMessages([]); // Clear chat on new document
    
    try {
      const content = await parsePdf(file);
       // A bit of a hack to get page count, pdf.js on client side doesn't expose it easily after text extraction
      const pageCount = (await (window as any).pdfjsLib.getDocument(await file.arrayBuffer()).promise).numPages;
      setDocument({
        filename: file.name,
        content,
        pageCount,
      });
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "An unknown error occurred during PDF processing.");
    } finally {
      setIsProcessingPdf(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (prompt: string, imageBase64?: string, imageMimeType?: string) => {
    if (!document) return;

    const userMessage: Message = {
      role: Role.USER,
      text: prompt,
    };
    if (imageBase64) {
        userMessage.image = `data:${imageMimeType};base64,${imageBase64}`;
    }

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsModelLoading(true);
    setModelError(null);

    try {
      const responseText = await generateResponse(document.content, prompt, imageBase64, imageMimeType);
      const modelMessage: Message = {
        role: Role.MODEL,
        text: responseText,
      };
      setMessages((prevMessages) => [...prevMessages, modelMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setModelError(errorMessage);
       const errorResponse: Message = {
        role: Role.MODEL,
        text: `Sorry, I encountered an error: ${errorMessage}`
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsModelLoading(false);
    }
  }, [document]);

  return (
    <div className="flex h-screen w-screen font-sans text-gray-200">
      <ControlPanel 
        document={document}
        isProcessingPdf={isProcessingPdf}
        onFileSelect={handleFileSelect}
        pdfError={pdfError}
      />
      <ChatPanel
        messages={messages}
        isModelLoading={isModelLoading}
        onSendMessage={handleSendMessage}
        isDocumentLoaded={!!document}
      />
    </div>
  );
};

export default App;
