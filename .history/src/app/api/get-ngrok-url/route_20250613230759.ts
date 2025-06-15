import { NextResponse } from "next/server";
import { spawn } from "child_process";

let ngrokUrl: string | null = null;

export async function GET(request: Request) {
  try {
    // If we already have a URL, return it
    if (ngrokUrl) {
      return NextResponse.json({ url: ngrokUrl });
    }

    try {
      // Get the current port from the request URL
      const url = new URL(request.url);
      const currentPort = url.port || "3001"; // Default to 3001 since server is running on 3001
      const currentPort = url.port || "3000";

      // Full path to ngrok executable
      const ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;

      // Set auth token first
      if (process.env.NGROK_AUTH_TOKEN) {
        await new Promise((resolve, reject) => {
          const authProcess = spawn(
            ngrokPath,
            ["authtoken", process.env.NGROK_AUTH_TOKEN!],
            {
              stdio: "pipe",
            }
          );

          authProcess.on("close", (code) => {
            if (code === 0) {
              resolve(null);
            } else {
              reject(new Error(`Auth failed with code ${code}`));
            }
          });
        });
      }

      // Start ngrok tunnel with the detected port
      const tunnelUrl = await new Promise<string>((resolve, reject) => {
        const ngrokProcess = spawn(
          ngrokPath,
          ["http", currentPort, "--log=stdout"],
          {
            stdio: "pipe",
          }
        );

        let output = "";

        ngrokProcess.stdout?.on("data", (data) => {
          output += data.toString();
          console.log("Ngrok output:", data.toString());

          // Look for the tunnel URL in the output
          const urlMatch = output.match(
            /https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/
          );
          if (urlMatch) {
            ngrokUrl = urlMatch[0];
            resolve(urlMatch[0]);
          }
        });

        ngrokProcess.stderr?.on("data", (data) => {
          console.error("Ngrok error:", data.toString());
        });

        ngrokProcess.on("error", (error) => {
          reject(error);
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          ngrokProcess.kill();
          reject(new Error("Ngrok connection timeout"));
        }, 30000);
      });

      return NextResponse.json({ url: tunnelUrl, port: currentPort });
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
