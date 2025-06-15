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
    const authtoken = process.env.NGROK_AUTH_TOKEN;
    if (!authtoken) {
      throw new Error("NGROK_AUTH_TOKEN is not defined");
    }

    if (!ngrokUrl) {
      // Cấu hình ngrok
      await ngrok.authtoken(authtoken);
      // Kết nối ngrok với port 3000
      ngrokUrl = await ngrok.connect({
        addr: 3000,
        authtoken,
        proto: "http",
      });
    }

    return NextResponse.json({ url: ngrokUrl });
  } catch (error) {
    console.error("Error in get-ngrok-url:", error);
    return NextResponse.json(
      {
        error: "Failed to get ngrok URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
