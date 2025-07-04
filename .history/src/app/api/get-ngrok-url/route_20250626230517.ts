import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface NgrokTunnel {
  name: string;
  proto: string;
  public_url: string;
}

interface NgrokResponse {
  tunnels: NgrokTunnel[];
}

let ngrokUrl: string | null = null;
let ngrokProcess: any = null;

export async function GET(request: Request) {
  try {
    // Check if we're running on Vercel production
    if (process.env.VERCEL_URL) {
      const productionUrl = `https://${process.env.VERCEL_URL}`;
      console.log(
        "Running on Vercel, returning production URL:",
        productionUrl
      );
      return NextResponse.json({
        url: productionUrl,
        environment: "production",
        source: "vercel",
      });
    }

    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode - attempting to use ngrok");

      // If we already have a URL, return it
      if (ngrokUrl) {
        return NextResponse.json({
          url: ngrokUrl,
          environment: "development",
          source: "ngrok",
        });
      }

      try {
        // Get the current port from the request URL
        const url = new URL(request.url);
        const currentPort = url.port || "3000";

        // Try to find ngrok in PATH first
        let ngrokPath = "ngrok";
        try {
          const { stdout } = await execAsync("where ngrok");
          ngrokPath = stdout.trim().split("\n")[0];
        } catch (error) {
          // If not found in PATH, try the default installation path
          ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;
        }

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

            let hasResolved = false;
            authProcess.stdout?.on("data", (data) => {
              console.log("Auth stdout:", data.toString());
              if (!hasResolved) {
                hasResolved = true;
                resolve(null);
              }
            });

            authProcess.stderr?.on("data", (data) => {
              console.log("Auth stderr:", data.toString());
            });

            authProcess.on("close", (code) => {
              console.log("Auth process closed with code:", code);
              if (!hasResolved) {
                hasResolved = true;
                if (code === 0) {
                  resolve(null);
                } else {
                  reject(new Error(`Auth failed with code ${code}`));
                }
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

        // Wait for ngrok to start and get URL
        let retries = 0;
        const maxRetries = 10;
        const retryDelay = 1000; // 1 second

        while (retries < maxRetries) {
          try {
            const fetch = (await import("node-fetch")).default;
            const response = await fetch("http://localhost:4040/api/tunnels");

            if (response.ok) {
              const data = (await response.json()) as NgrokResponse;
              console.log("Ngrok API response:", data);

              if (data.tunnels && data.tunnels.length > 0) {
                const tunnel = data.tunnels.find((t) => t.proto === "https");
                if (tunnel) {
                  ngrokUrl = tunnel.public_url;
                  console.log("Found ngrok URL:", ngrokUrl);
                  return NextResponse.json({
                    url: ngrokUrl,
                    port: currentPort,
                    environment: "development",
                    source: "ngrok",
                  });
                }
              }
            }
          } catch (error) {
            console.log(`Retry ${retries + 1}/${maxRetries} failed:`, error);
          }

          retries++;
          if (retries < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        throw new Error("Failed to get ngrok URL after multiple retries");
      } catch (error) {
        console.error("Error connecting to ngrok:", error);

        // Kill ngrok process if it was started
        if (ngrokProcess) {
          ngrokProcess.kill();
          ngrokProcess = null;
        }

        return NextResponse.json(
          {
            error: "Failed to connect to ngrok in development",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    }

    // Fallback: return localhost for other environments
    const fallbackUrl = "http://localhost:3000";
    console.log("Fallback to localhost:", fallbackUrl);
    return NextResponse.json({
      url: fallbackUrl,
      environment: "fallback",
      source: "localhost",
    });
  } catch (error) {
    console.error("Error in get-ngrok-url:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
