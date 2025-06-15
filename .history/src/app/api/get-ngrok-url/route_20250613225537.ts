import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
let ngrokUrl: string | null = null;

export async function GET() {
  try {
    // If we already have a URL, return it
    if (ngrokUrl) {
      return NextResponse.json({ url: ngrokUrl });
    }

    try {
      // Kill any existing ngrok processes
      try {
        await execAsync(`taskkill /f /im ngrok.exe`);
      } catch (error) {
        // Ignore if no ngrok processes are running
      }

      // Set auth token using global ngrok CLI
      if (process.env.NGROK_AUTH_TOKEN) {
        await execAsync(`ngrok authtoken ${process.env.NGROK_AUTH_TOKEN}`);
      }

      // Start ngrok tunnel using global CLI
      const { stdout } = await execAsync(`ngrok http 3000 --log=stdout`);

      // Extract URL from ngrok output
      const urlMatch = stdout.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/);
      if (urlMatch) {
        ngrokUrl = urlMatch[0];
        return NextResponse.json({ url: ngrokUrl });
      } else {
        throw new Error("Could not extract ngrok URL from output");
      }
    } catch (error) {
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
