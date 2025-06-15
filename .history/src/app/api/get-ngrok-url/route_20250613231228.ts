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

      // Full path to ngrok executable
      const ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;

      console.log("Starting ngrok connection...");
      console.log("Port:", currentPort);
      console.log("Ngrok path:", ngrokPath);

      // Set auth token first if not already set
      if (process.env.NGROK_AUTH_TOKEN) {
        console.log("Setting auth token...");
        await new Promise((resolve, reject) => {
          const authProcess = spawn(
            ngrokPath,
            ["authtoken", process.env.NGROK_AUTH_TOKEN!],
            {
              stdio: "pipe",
            }
          );

          authProcess.stdout?.on("data", (data) => {
            console.log("Auth stdout:", data.toString());
          });

          authProcess.stderr?.on("data", (data) => {
            console.log("Auth stderr:", data.toString());
          });

          authProcess.on("close", (code) => {
            console.log("Auth process closed with code:", code);
            if (code === 0) {
              resolve(null);
            } else {
              reject(new Error(`Auth failed with code ${code}`));
            }
          });
        });
      }

      // Start ngrok tunnel with increased timeout
      const tunnelUrl = await new Promise<string>((resolve, reject) => {
        const ngrokProcess = spawn(ngrokPath, ["http", currentPort], {
          stdio: "pipe",
        });

        let output = "";
        let hasResolved = false;

        ngrokProcess.stdout?.on("data", (data) => {
          const dataStr = data.toString();
          output += dataStr;
          console.log("Ngrok stdout:", dataStr);

          // Look for the tunnel URL in the output
          const urlMatch = dataStr.match(
            /https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/
          );
          if (urlMatch && !hasResolved) {
            hasResolved = true;
            ngrokUrl = urlMatch[0];
            console.log("Found ngrok URL:", urlMatch[0]);
            resolve(urlMatch[0]);
          }
        });

        ngrokProcess.stderr?.on("data", (data) => {
          const dataStr = data.toString();
          console.log("Ngrok stderr:", dataStr);

          // Also check stderr for URL
          const urlMatch = dataStr.match(
            /https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/
          );
          if (urlMatch && !hasResolved) {
            hasResolved = true;
            ngrokUrl = urlMatch[0];
            console.log("Found ngrok URL in stderr:", urlMatch[0]);
            resolve(urlMatch[0]);
          }
        });

        ngrokProcess.on("error", (error) => {
          console.log("Ngrok process error:", error);
          if (!hasResolved) {
            hasResolved = true;
            reject(error);
          }
        });

        ngrokProcess.on("close", (code) => {
          console.log("Ngrok process closed with code:", code);
          if (!hasResolved) {
            hasResolved = true;
            reject(new Error(`Ngrok process exited with code ${code}`));
          }
        });

        // Increased timeout to 60 seconds
        setTimeout(() => {
          if (!hasResolved) {
            hasResolved = true;
            ngrokProcess.kill();
            console.log("Ngrok timeout - full output:", output);
            reject(new Error("Ngrok connection timeout after 60 seconds"));
          }
        }, 60000);
      });

      return NextResponse.json({ url: tunnelUrl, port: currentPort });
    } catch (error) {
      console.error("Error connecting to ngrok:", error);
      return NextResponse.json(
        {
          error: "Failed to connect to ngrok",
          details: error instanceof Error ? error.message : String(error),
        },
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
