import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET() {
  try {
    const ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;

    console.log("Testing ngrok auth...");
    console.log("Auth token exists:", !!process.env.NGROK_AUTH_TOKEN);
    console.log("Auth token length:", process.env.NGROK_AUTH_TOKEN?.length);

    if (!process.env.NGROK_AUTH_TOKEN) {
      return NextResponse.json(
        {
          error: "NGROK_AUTH_TOKEN not found in environment",
        },
        { status: 400 }
      );
    }

    // Test auth token
    const result = await new Promise<string>((resolve, reject) => {
      const authProcess = spawn(
        ngrokPath,
        ["authtoken", process.env.NGROK_AUTH_TOKEN!],
        {
          stdio: "pipe",
        }
      );

      let output = "";

      authProcess.stdout?.on("data", (data) => {
        output += data.toString();
        console.log("Auth stdout:", data.toString());
      });

      authProcess.stderr?.on("data", (data) => {
        output += data.toString();
        console.log("Auth stderr:", data.toString());
      });

      authProcess.on("close", (code) => {
        console.log("Auth process closed with code:", code);
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Auth failed with code ${code}: ${output}`));
        }
      });

      authProcess.on("error", (error) => {
        console.log("Auth process error:", error);
        reject(error);
      });

      setTimeout(() => {
        authProcess.kill();
        reject(new Error("Auth timeout"));
      }, 15000);
    });

    return NextResponse.json({
      success: true,
      message: "Auth token is valid",
      output: result.trim(),
    });
  } catch (error) {
    console.error("Ngrok auth test error:", error);
    return NextResponse.json(
      {
        error: "Ngrok auth failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
