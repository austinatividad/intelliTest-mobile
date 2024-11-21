import { WebView } from 'react-native-webview';
import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

type ExtractBase64ImagesProps = {
  pdfUrls: string[]; // Array of PDF URLs
  onImagesExtracted: (images: { pdfUrl: string; base64Images: string[] }[]) => void; // Callback with images grouped by PDF URL
};

export default function ExtractBase64Images({ pdfUrls, onImagesExtracted }: ExtractBase64ImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // Track which PDF is being processed
  const [results, setResults] = useState<{ pdfUrl: string; base64Images: string[] }[]>([]);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Current Index: ${currentIndex}`);
    if (currentIndex >= pdfUrls.length) {
      console.log('All PDFs processed, calling onImagesExtracted callback.');
      onImagesExtracted(results);
    } else {
      prepareHtmlForPdf(pdfUrls[currentIndex]);
    }
  }, [currentIndex, pdfUrls.length, results, onImagesExtracted]);

    // Convert local file to Base64 and prepare HTML content
const prepareHtmlForPdf = async (pdfUrl: string) => {
  try {
    console.log(`Preparing HTML for PDF: ${pdfUrl}`);
    let pdfBase64 = '';
    if (pdfUrl.startsWith('file://')) {
      console.log('Reading local PDF file...');
      pdfBase64 = await FileSystem.readAsStringAsync(pdfUrl, {
        encoding: FileSystem.EncodingType.Base64,
      });
      pdfBase64 = `data:application/pdf;base64,${pdfBase64}`;
    } else {
      pdfBase64 = pdfUrl; // Use remote URL directly
    }

    console.log('Done reading PDF. Base64 length:', pdfBase64.length);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs"></script>
        <script>
          console.log("HTML File is running")
          document.addEventListener('DOMContentLoaded', async () => {
            try {
              console.log('PDF.js script loaded. Starting to process PDF...');
              
              // Validate PDF.js Library
              if (!pdfjsLib) {
                console.error('PDF.js library is not loaded.');
                return;
              }

              console.log('Initializing PDF.js...');
              const pdf = await pdfjsLib.getDocument('${pdfBase64}').promise;
              console.log('PDF loaded. Number of pages:', pdf.numPages);

              const base64Images = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                try {
                  console.log('Processing page:', i);
                  const page = await pdf.getPage(i);
                  const viewport = page.getViewport({ scale: 1.5 });

                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  canvas.width = viewport.width;
                  canvas.height = viewport.height;

                  await page.render({ canvasContext: context, viewport }).promise;

                  const base64Image = canvas.toDataURL('image/png');
                  base64Images.push(base64Image);

                  console.log('Page rendered and converted to Base64.');
                  canvas.remove();
                } catch (pageError) {
                  console.error('Error processing page:', i, pageError);
                }
              }

              console.log('PDF processed. Sending Base64 images back to React Native.');
              window.ReactNativeWebView.postMessage(JSON.stringify(base64Images));
            } catch (pdfError) {
              console.error('Error processing PDF:', pdfError);
            }
          });
        </script>
      </head>
      <body></body>
      </html>
    `;
    setHtmlContent(html);
    console.log('HTML Content set');
  } catch (error) {
    console.error('Error preparing HTML for PDF:', error);
  }
};

    const handleMessage = (event: any) => {
      console.log('Message received from WebView:', event.nativeEvent.data);
      const base64Array = JSON.parse(event.nativeEvent.data);
      const currentPdfUrl = pdfUrls[currentIndex];
  
      console.log(`PDF processed: ${currentPdfUrl}`);
      console.log(`Extracted Images Count: ${base64Array.length}`);
  
      // Append results for the current PDF
      setResults((prev) => [
        ...prev,
        { pdfUrl: currentPdfUrl, base64Images: base64Array },
      ]);
  
      // Move to the next PDF
      setCurrentIndex((prev) => prev + 1);
    };
  
    if (!htmlContent || currentIndex >= pdfUrls.length) {
      console.log('No more PDFs to process or HTML not ready.');
      return null;
    }
  
    console.log(`Rendering WebView for PDF at index ${currentIndex}: ${pdfUrls[currentIndex]}`);
    return (
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        source={{ html: htmlContent }}
        style={{ height: 0, width: 0 }} // Invisible WebView
        onMessage={handleMessage}
      />
    );
}

