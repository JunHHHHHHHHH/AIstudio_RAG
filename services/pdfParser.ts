
// This uses the pdfjs-dist library loaded from a CDN in index.html
declare const pdfjsLib: any;

/**
 * Parses a PDF file to extract its text content.
 * @param file The PDF file to parse.
 * @returns A promise that resolves to the extracted text content.
 */
export const parsePdf = async (file: File): Promise<string> => {
  if (!pdfjsLib) {
    throw new Error('pdf.js library is not loaded.');
  }
  
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read file.'));
      }
      try {
        const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        resolve(fullText);
      } catch (error) {
        reject(new Error('Failed to parse PDF: ' + (error as Error).message));
      }
    };
    fileReader.onerror = () => reject(new Error('Error reading the file.'));
    fileReader.readAsArrayBuffer(file);
  });
};
