import { NextResponse } from "next/server";
import { spawn } from "child_process";

let ngrokUrl: string | null = null;
let ngrokProcess: any = null;

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

      // Start ngrok process in background
      console.log("Starting ngrok tunnel...");
      ngrokProcess = spawn(ngrokPath, ["http", currentPort], {
        stdio: "pipe",
        detached: false,
      });

      ngrokProcess.stdout?.on("data", (data: Buffer) => {
        console.log("Ngrok stdout:", data.toString());
      });

      ngrokProcess.stderr?.on("data", (data: Buffer) => {
        console.log("Ngrok stderr:", data.toString());
      });

      // Wait a bit for ngrok to start
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Query ngrok API for tunnel information
      console.log("Querying ngrok API...");
      const fetch = (await import("node-fetch")).default;
      const response = await fetch("http://localhost:4040/api/tunnels");

      if (!response.ok) {
        throw new Error(
          `Ngrok API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as any;
      console.log("Ngrok API response:", data);

      if (!data.tunnels || data.tunnels.length === 0) {
        throw new Error("No tunnels found in ngrok API response");
      }

      // Find the HTTPS tunnel
      const tunnel = data.tunnels.find((t: any) => t.proto === "https");
      if (!tunnel) {
        throw new Error("No HTTPS tunnel found");
      }

      ngrokUrl = tunnel.public_url;
      console.log("Found ngrok URL:", ngrokUrl);

      return NextResponse.json({ url: ngrokUrl, port: currentPort });
    } catch (error) {
      console.error("Error connecting to ngrok:", error);

      // Kill ngrok process if it was started
      if (ngrokProcess) {
        ngrokProcess.kill();
        ngrokProcess = null;
      }

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
