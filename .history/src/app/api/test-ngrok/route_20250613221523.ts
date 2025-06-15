import { NextResponse } from "next/server";
import ngrok from "ngrok";

export async function GET() {
  try {
    if (!process.env.NGROK_AUTH_TOKEN) {
      return NextResponse.json(
        { error: "NGROK_AUTH_TOKEN is not configured" },
        { status: 500 }
      );
    }

    // Kill any existing tunnels
    await ngrok.kill();

    // Configure ngrok
    await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);

    // Connect to port 3000
    const url = await ngrok.connect({
      addr: 3000,
      proto: "http",
    });

    return NextResponse.json({
      success: true,
      url,
      message: "Ngrok connection successful",
    });
  } catch (error) {
    console.error("Error testing ngrok connection:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to connect to ngrok",
      },
      { status: 500 }
    );
  }
}
