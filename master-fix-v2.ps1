# ============================================
# Munira App - Master Fix Script (v2)
# Fixes all known issues: API ES module, vercel.json, Tailwind
# ============================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "   Munira App - Master Fix Script" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    exit 1
}

# STEP 1: Remove wrong files
Write-Host "[1/10] Cleaning wrong files..." -ForegroundColor Cyan
if (Test-Path "vercel.json.txt") {
    Remove-Item "vercel.json.txt" -Force
    Write-Host "  Removed vercel.json.txt" -ForegroundColor Yellow
}
if (Test-Path "fix.ps1") { Remove-Item "fix.ps1" -Force }
if (Test-Path "fix2.ps1") { Remove-Item "fix2.ps1" -Force }

# STEP 2: Install Tailwind
Write-Host "[2/10] Installing Tailwind v3..." -ForegroundColor Cyan
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20 2>&1 | Out-Null

# STEP 3: tailwind.config.js
Write-Host "[3/10] Writing tailwind.config.js..." -ForegroundColor Cyan
$tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
'@
[System.IO.File]::WriteAllText("$PWD\tailwind.config.js", $tailwindConfig)

# STEP 4: postcss.config.js
Write-Host "[4/10] Writing postcss.config.js..." -ForegroundColor Cyan
$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
[System.IO.File]::WriteAllText("$PWD\postcss.config.js", $postcssConfig)

# STEP 5: src/index.css
Write-Host "[5/10] Writing src/index.css..." -ForegroundColor Cyan
$indexCss = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: "Tajawal", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
'@
if (-not (Test-Path "src")) { New-Item -ItemType Directory -Path "src" | Out-Null }
[System.IO.File]::WriteAllText("$PWD\src\index.css", $indexCss)

# STEP 6: src/main.jsx
Write-Host "[6/10] Writing src/main.jsx..." -ForegroundColor Cyan
$mainJsx = @'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
'@
[System.IO.File]::WriteAllText("$PWD\src\main.jsx", $mainJsx)

# STEP 7: index.html
Write-Host "[7/10] Writing index.html..." -ForegroundColor Cyan
$indexHtml = @'
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>Munira</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@
[System.IO.File]::WriteAllText("$PWD\index.html", $indexHtml)

# STEP 8: vercel.json
Write-Host "[8/10] Writing vercel.json..." -ForegroundColor Cyan
$vercelJson = @'
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
'@
[System.IO.File]::WriteAllText("$PWD\vercel.json", $vercelJson)

# STEP 9: api/chat.js as ES module
Write-Host "[9/10] Writing api/chat.js..." -ForegroundColor Cyan
if (-not (Test-Path "api")) { New-Item -ItemType Directory -Path "api" | Out-Null }

$chatJs = @'
import https from "https";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return res.status(500).json({
      error: { message: "GEMINI_API_KEY not set in Vercel environment variables" },
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const system = body.system || "";
    const messages = body.messages || [];

    if (!messages.length) {
      return res.status(400).json({ error: { message: "messages required" } });
    }

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const payload = JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const path =
      "/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    const options = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);

          if (parsed.error) {
            console.error("Gemini API error:", parsed.error);
            return res.status(parsed.error.code || 500).json({
              error: { message: parsed.error.message || "Gemini API error" },
            });
          }

          let text = "";
          if (
            parsed.candidates &&
            parsed.candidates[0] &&
            parsed.candidates[0].content &&
            parsed.candidates[0].content.parts
          ) {
            for (const part of parsed.candidates[0].content.parts) {
              if (part.text) text += part.text;
            }
          }

          if (!text) {
            console.error("Empty text. Full response:", JSON.stringify(parsed));
            return res.status(500).json({
              error: { message: "Empty response from Gemini" },
            });
          }

          res.status(200).json({
            content: [{ type: "text", text: text }],
          });
        } catch (e) {
          console.error("Parse error:", e.message, "Data:", data.substring(0, 500));
          res.status(500).json({
            error: { message: "Parse error: " + data.substring(0, 300) },
          });
        }
      });
    });

    apiReq.on("error", (err) => {
      console.error("Request error:", err);
      res.status(500).json({
        error: { message: "Request failed: " + err.message },
      });
    });

    apiReq.write(payload);
    apiReq.end();
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({
      error: { message: "Server error: " + err.message },
    });
  }
}
'@
[System.IO.File]::WriteAllText("$PWD\api\chat.js", $chatJs)

# STEP 10: Clean exposed keys
Write-Host "[10/10] Scanning for exposed API keys..." -ForegroundColor Cyan
Get-ChildItem -Recurse -Include *.jsx,*.js,*.ts,*.tsx,*.json,*.md -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match "AIza[0-9A-Za-z_-]{35}") {
            Write-Host "  Cleaning key from: $($_.Name)" -ForegroundColor Yellow
            $cleaned = $content -replace "AIza[0-9A-Za-z_-]{35}", ""
            [System.IO.File]::WriteAllText($_.FullName, $cleaned)
        }
    }

# Verify
Write-Host ""
Write-Host "Verifying files..." -ForegroundColor Cyan
$critical = @("package.json", "vercel.json", "tailwind.config.js", "postcss.config.js", "index.html", "src\App.jsx", "src\main.jsx", "src\index.css", "api\chat.js")
$allGood = $true
foreach ($f in $critical) {
    if (Test-Path $f) {
        Write-Host "  OK: $f" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $f" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host ""
    Write-Host "WARNING: Some files are missing!" -ForegroundColor Red
    Write-Host "Check src\App.jsx placement!" -ForegroundColor Red
}

# Commit and push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git add -A
git commit -m "Master fix: ES module API, Tailwind, vercel config"
git push origin main

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "   ALL DONE" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Magenta
Write-Host ""
Write-Host "  1. Create new API key at:" -ForegroundColor White
Write-Host "     https://aistudio.google.com/api-keys" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. In Vercel Settings, Environment Variables:" -ForegroundColor White
Write-Host "     Delete old GEMINI_API_KEY" -ForegroundColor White
Write-Host "     Add new one:" -ForegroundColor White
Write-Host "       Name:  GEMINI_API_KEY" -ForegroundColor Cyan
Write-Host "       Value: paste your new key" -ForegroundColor Cyan
Write-Host "       Check: Production, Preview, Development" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Deployments tab, click the 3 dots, Redeploy" -ForegroundColor White
Write-Host "     UNCHECK Use existing Build Cache" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Wait 1 minute, test the chat" -ForegroundColor White
Write-Host ""
