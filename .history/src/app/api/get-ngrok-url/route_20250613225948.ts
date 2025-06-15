import { NextResponse } from "next/server";
import { spawn } from "child_process";

let ngrokUrl: string | null = null;

export async function GET() {
  try {
    // If we already have a URL, return it
    if (ngrokUrl) {
      return NextResponse.json({ url: ngrokUrl });
    }

    try {
      // Full path to ngrok executable
      const ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;
      
      // Set auth token first
      if (process.env.NGROK_AUTH_TOKEN) {
        await new Promise((resolve, reject) => {
          const authProcess = spawn(ngrokPath, ['authtoken', process.env.NGROK_AUTH_TOKEN!], {
            stdio: 'pipe'
          });
          
          authProcess.on('close', (code) => {
            if (code === 0) {
              resolve(null);
            } else {
              reject(new Error(`Auth failed with code ${code}`));
            }
          });
        });
      }

      // Start ngrok tunnel
      const url = await new Promise<string>((resolve, reject) => {
        const ngrokProcess = spawn(ngrokPath, ['http', '3000', '--log=stdout'], {
          stdio: 'pipe'
        });

        let output = '';
        
        ngrokProcess.stdout?.on('data', (data) => {
          output += data.toString();
          
          // Look for the tunnel URL in the output
          const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok-free\.app/);
          if (urlMatch) {
            ngrokUrl = urlMatch[0];
            resolve(urlMatch[0]);
          }
        });

        ngrokProcess.on('error', (error) => {
          reject(error);
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          ngrokProcess.kill();
          reject(new Error('Ngrok connection timeout'));
        }, 30000);
      });

      return NextResponse.json({ url });

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
