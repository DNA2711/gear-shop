import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET() {
  try {
    const ngrokPath = `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`;

    console.log("Testing ngrok executable...");

    // Test if ngrok executable exists and works
    const result = await new Promise<string>((resolve, reject) => {
      const testProcess = spawn(ngrokPath, ["version"], {
        stdio: "pipe",
      });

      let output = "";

      testProcess.stdout?.on("data", (data) => {
        output += data.toString();
        console.log("Version stdout:", data.toString());
      });

      testProcess.stderr?.on("data", (data) => {
        output += data.toString();
        console.log("Version stderr:", data.toString());
      });

      testProcess.on("close", (code) => {
        console.log("Version process closed with code:", code);
        if (code === 0) {
          resolve(output);
        } else {
          reject(
            new Error(`Version check failed with code ${code}: ${output}`)
          );
        }
      });

      testProcess.on("error", (error) => {
        console.log("Version process error:", error);
        reject(error);
      });

      setTimeout(() => {
        testProcess.kill();
        reject(new Error("Version check timeout"));
      }, 10000);
    });

    return NextResponse.json({
      success: true,
      version: result.trim(),
      ngrokPath,
      message: "Ngrok executable is working",
    });
  } catch (error) {
    console.error("Ngrok test error:", error);
    return NextResponse.json(
      {
        error: "Ngrok test failed",
        details: error instanceof Error ? error.message : String(error),
        ngrokPath: `C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\\ngrok.exe`,
      },
      { status: 500 }
    );
  }
}
