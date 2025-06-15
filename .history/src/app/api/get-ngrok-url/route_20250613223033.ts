import { NextResponse } from "next/server";
import ngrok from "ngrok";

let ngrokUrl: string | null = null;
let isConnecting = false;
let connectionTimeout: NodeJS.Timeout | null = null;

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
    // Check if NGROK_AUTH_TOKEN is configured
    if (!process.env.NGROK_AUTH_TOKEN) {
      console.error("NGROK_AUTH_TOKEN is not configured");
      return NextResponse.json(
        { error: "NGROK_AUTH_TOKEN is not configured" },
        { status: 500 }
      );
    }

    // Return existing URL if available
    if (ngrokUrl) {
      console.log("Using existing ngrok URL:", ngrokUrl);
      return NextResponse.json({ url: ngrokUrl });
    }

    // If connection is in progress for more than 10 seconds, reset it
    if (isConnecting) {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      isConnecting = false;
      console.log("Reset connection state due to timeout");
    }

    try {
      isConnecting = true;
      console.log("Starting ngrok connection...");

      // Set a timeout to reset connection state
      connectionTimeout = setTimeout(() => {
        isConnecting = false;
        console.log("Connection timeout - reset state");
      }, 10000);

      // Kill any existing tunnels
      await ngrok.kill();
      console.log("Killed existing tunnels");

      // Configure ngrok
      await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
      console.log("Configured ngrok auth token");

      // Connect to port 3000 where Next.js is running
      const url = await ngrok.connect({
        addr: 3000,
        proto: "http",
      });
      console.log("Connected to ngrok:", url);

      // Clear timeout and reset connection state
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
      isConnecting = false;
      ngrokUrl = url;

      return NextResponse.json({ url });
    } catch (error) {
      // Clear timeout and reset connection state on error
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      isConnecting = false;
      console.error("Error connecting to ngrok:", error);
      return NextResponse.json(
        { error: "Failed to connect to ngrok" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in get-ngrok-url:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
