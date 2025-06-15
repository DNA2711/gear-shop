import { NextResponse } from 'next/server';
import ngrok from 'ngrok';

let ngrokUrl: string | null = null;

export async function GET() {
  try {
    if (!ngrokUrl) {
      // Kết nối ngrok với port 3000
      ngrokUrl = await ngrok.connect(3000);
    }
    return NextResponse.json({ url: ngrokUrl });
  } catch (error) {
    console.error('Error getting ngrok URL:', error);
    return NextResponse.json({ error: 'Failed to get ngrok URL' }, { status: 500 });
  }
} 