
import React, { useRef } from 'react';
import type { Document } from '../types';
import { UploadIcon, DocumentIcon } from './icons';
import Spinner from './Spinner';

interface ControlPanelProps {
  document: Document | null;
  isProcessingPdf: boolean;
  onFileSelect: (file: File) => void;
  pdfError: string | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ document, isProcessingPdf, onFileSelect, pdfError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-6 flex flex-col h-full border-r border-gray-700">
      <h1 className="text-2xl font-bold text-white mb-2">Multimodal RAG Chat</h1>
      <p className="text-gray-400 mb-6">Upload a PDF to start a conversation.</p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
        disabled={isProcessingPdf}
      />

      <button
        onClick={handleButtonClick}
        disabled={isProcessingPdf}
        className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
      >
        {isProcessingPdf ? (
          <>
            <Spinner size="5" />
            <span className="ml-2">Processing PDF...</span>
          </>
        ) : (
          <>
            <UploadIcon className="h-5 w-5 mr-2" />
            <span>{document ? 'Upload Another PDF' : 'Upload PDF'}</span>
          </>
        )}
      </button>

      {pdfError && <p className="text-red-400 mt-4 text-sm">{pdfError}</p>}

      {document && !pdfError && (
        <div className="mt-8 p-4 bg-gray-700/50 rounded-lg border border-gray-600 flex-grow overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-3">Active Document</h2>
          <div className="flex items-start text-gray-300">
            <DocumentIcon className="h-6 w-6 mr-3 mt-1 flex-shrink-0 text-blue-400" />
            <div>
              <p className="font-medium break-all">{document.filename}</p>
              <p className="text-sm text-gray-400">{document.pageCount} pages</p>
            </div>
          </div>
        </div>
      )}
      
      {!document && !isProcessingPdf && !pdfError && (
         <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700 border-dashed flex-grow flex flex-col items-center justify-center text-center">
            <DocumentIcon className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-500">Your document details will appear here once uploaded.</p>
         </div>
      )}

    </div>
  );
};

export default ControlPanel;
