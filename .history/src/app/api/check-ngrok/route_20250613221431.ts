import { NextResponse } from 'next/server';
import ngrok from 'ngrok';

export async function GET() {
  try {
    // Get all active tunnels
    const tunnels = await ngrok.getUrl();
    
    if (!tunnels) {
      return NextResponse.json(
        { status: 'disconnected', message: 'No active ngrok tunnels' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        status: 'connected',
        url: tunnels,
        message: 'Ngrok tunnel is active'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking ngrok status:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to check ngrok status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 