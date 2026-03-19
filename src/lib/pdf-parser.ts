export async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Worker 설정 - public 폴더에서 로드
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    
    // Base64를 Uint8Array로 변환
    const base64String = base64Data.split(',')[1];
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // PDF 로드
    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
    });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => {
          return 'str' in item ? item.str : '';
        })
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}