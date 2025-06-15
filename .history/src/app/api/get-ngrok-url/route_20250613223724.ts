import { NextResponse } from "next/server";
import ngrok from "ngrok";

let ngrokUrl: string | null = null;

// Cấu hình ngrok một lần khi server khởi động
(async () => {
  const authtoken = process.env.NGROK_AUTH_TOKEN;
  if (!authtoken) {
    console.error("NGROK_AUTH_TOKEN is not defined");
    return;
  }
  try {
    await ngrok.authtoken(authtoken);
  } catch (error) {
    console.error("Error configuring ngrok:", error);
  }
})();

export async function GET() {
  try {
    if (!process.env.NGROK_AUTH_TOKEN) {
      return NextResponse.json(
        { error: 'NGROK_AUTH_TOKEN is not configured' },
        { status: 500 }
      );
    }

    if (ngrokUrl) {
      return NextResponse.json({ url: ngrokUrl });
    }

    try {
      // Kill any existing tunnels
      await ngrok.kill();
      
      // Configure ngrok
      await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
      
      // Connect to port 3000
      const url = await ngrok.connect({
        addr: 3000,
        proto: 'http'
      });

      ngrokUrl = url;
      return NextResponse.json({ url });
    } catch (error) {
      console.error('Error connecting to ngrok:', error);
      return NextResponse.json(
        { error: 'Failed to connect to ngrok' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in get-ngrok-url:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
