declare module 'pdf-parse' {
  export default function(buffer: Buffer): Promise<{ text: string, numpages: number, info: any }>;
}
