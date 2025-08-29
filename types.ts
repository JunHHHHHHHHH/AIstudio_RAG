
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
  image?: string; // base64 encoded image
}

export interface Document {
  filename: string;
  content: string;
  pageCount: number;
}
