# ============================================
# Munira App - Full Fix Script v2
# Fixes Tailwind, vercel.json, App.jsx, and deploys
# ============================================

Write-Host ""
Write-Host "Munira App - Full Fix v2" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Magenta
Write-Host ""

# ---- Step 0: Remove wrong vercel.json.txt ----
if (Test-Path "vercel.json.txt") {
    Write-Host "[0] Removing wrong vercel.json.txt..." -ForegroundColor Yellow
    Remove-Item "vercel.json.txt" -Force
}

# ---- Step 1: Make sure Tailwind is installed ----
Write-Host "[1/9] Installing Tailwind v3..." -ForegroundColor Cyan
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20

# ---- Step 2: Create tailwind.config.js ----
Write-Host "[2/9] Writing tailwind.config.js..." -ForegroundColor Cyan
$tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
'@
[System.IO.File]::WriteAllText("$PWD\tailwind.config.js", $tailwindConfig)

# ---- Step 3: Create postcss.config.js ----
Write-Host "[3/9] Writing postcss.config.js..." -ForegroundColor Cyan
$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
[System.IO.File]::WriteAllText("$PWD\postcss.config.js", $postcssConfig)

# ---- Step 4: Create src/index.css ----
Write-Host "[4/9] Writing src/index.css..." -ForegroundColor Cyan
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
[System.IO.File]::WriteAllText("$PWD\src\index.css", $indexCss)

# ---- Step 5: Fix src/main.jsx ----
Write-Host "[5/9] Writing src/main.jsx..." -ForegroundColor Cyan
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

# ---- Step 6: Fix index.html ----
Write-Host "[6/9] Writing index.html..." -ForegroundColor Cyan
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

# ---- Step 7: Create proper vercel.json (no .txt) ----
Write-Host "[7/9] Writing vercel.json (no .txt this time!)..." -ForegroundColor Cyan
$vercelJson = @'
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
'@
[System.IO.File]::WriteAllText("$PWD\vercel.json", $vercelJson)

# ---- Step 8: Make sure api/chat.js exists ----
Write-Host "[8/9] Checking api/chat.js..." -ForegroundColor Cyan
if (-not (Test-Path "api\chat.js")) {
    Write-Host "  WARNING: api/chat.js is MISSING. Please copy it manually." -ForegroundColor Red
    Write-Host "  Make sure the file is at: $PWD\api\chat.js" -ForegroundColor Red
} else {
    Write-Host "  api/chat.js found!" -ForegroundColor Green
}

# ---- Step 9: Check App.jsx exists ----
Write-Host "[9/9] Checking src/App.jsx..." -ForegroundColor Cyan
if (-not (Test-Path "src\App.jsx")) {
    Write-Host "  WARNING: src/App.jsx is MISSING. Please copy it manually." -ForegroundColor Red
} else {
    $content = Get-Content "src\App.jsx" -Raw
    if ($content -match "DEFAULT_API_KEY") {
        Write-Host "  WARNING: Your App.jsx still has the OLD version with API key modal!" -ForegroundColor Red
        Write-Host "  You need to replace src\App.jsx with the NEW version I sent." -ForegroundColor Red
    } else {
        Write-Host "  App.jsx looks like the new version!" -ForegroundColor Green
    }
}

# ---- Clean any API keys from files ----
Write-Host ""
Write-Host "Scanning for exposed API keys..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include *.jsx,*.js,*.ts,*.tsx,*.json,*.md | 
    Where-Object { $_.FullName -notmatch "node_modules" } | 
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match "AIza[0-9A-Za-z_-]{35}") {
            Write-Host "  Cleaning key from: $($_.Name)" -ForegroundColor Yellow
            $cleaned = $content -replace "AIza[0-9A-Za-z_-]{35}", ""
            [System.IO.File]::WriteAllText($_.FullName, $cleaned)
        }
    }

# ---- Push to GitHub ----
Write-Host ""
Write-Host "Pushing everything to GitHub..." -ForegroundColor Cyan
git add -A
git commit -m "Complete fix: Tailwind + proper vercel.json + clean structure"
git push origin main

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "DONE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS (very important):" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. Go to vercel.com -> your project -> Settings -> Environment Variables" -ForegroundColor White
Write-Host "   Make sure GEMINI_API_KEY is set with your new key" -ForegroundColor White
Write-Host ""
Write-Host "2. Go to Deployments -> click ... on latest -> Redeploy" -ForegroundColor White
Write-Host ""
Write-Host "3. Wait 1 minute, then open munira-delta.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "Test locally FIRST with:  npm run dev" -ForegroundColor Magenta
Write-Host ""
