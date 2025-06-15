import { NextResponse } from "next/server";
import ngrok from "ngrok";

let ngrokUrl: string | null = null;

// Cấu hình ngrok một lần khi server khởi động
(async () => {
  try {
    await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
  } catch (error) {
    console.error("Error configuring ngrok:", error);
  }
})();

export async function GET() {
  try {
    if (!ngrokUrl) {
      // Kết nối ngrok với port 3000
      ngrokUrl = await ngrok.connect({
        addr: 3000,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });
    }
    return NextResponse.json({ url: ngrokUrl });
  } catch (error) {
    console.error("Error getting ngrok URL:", error);
    return NextResponse.json(
      { error: "Failed to get ngrok URL" },
      { status: 500 }
    );
  }
}
