export enum fileTypes {
    'text',
    'image',
    // Add other file types as needed
  }
  
export interface Document {
    id: string;
    fileName: string;
    fileType: fileTypes;
    uri: string;
    isRemoved: boolean;
    base64? : string | null;
}

// the interface for the exam input content, will be used to store the content of the exam input and pass it to the next page
export interface ExamInputContent {
    inputText: string;
    documents: Document[];
}