# ============================================
# Munira App - Auto Fix Script
# Run this in the munira-app folder to fix everything
# ============================================

Write-Host ""
Write-Host "Munira App Auto-Fix Starting..." -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta
Write-Host ""

# ---- Step 1: Install Tailwind ----
Write-Host "[1/7] Installing Tailwind CSS v3..." -ForegroundColor Cyan
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20
if ($LASTEXITCODE -ne 0) { Write-Host "Failed to install Tailwind" -ForegroundColor Red; exit 1 }

# ---- Step 2: Create tailwind.config.js ----
Write-Host "[2/7] Creating tailwind.config.js..." -ForegroundColor Cyan
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
Set-Content -Path "tailwind.config.js" -Value $tailwindConfig -Encoding UTF8

# ---- Step 3: Create postcss.config.js ----
Write-Host "[3/7] Creating postcss.config.js..." -ForegroundColor Cyan
$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
Set-Content -Path "postcss.config.js" -Value $postcssConfig -Encoding UTF8

# ---- Step 4: Create src/index.css ----
Write-Host "[4/7] Creating src/index.css..." -ForegroundColor Cyan
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
Set-Content -Path "src\index.css" -Value $indexCss -Encoding UTF8

# ---- Step 5: Fix src/main.jsx to import index.css ----
Write-Host "[5/7] Fixing src/main.jsx..." -ForegroundColor Cyan
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
Set-Content -Path "src\main.jsx" -Value $mainJsx -Encoding UTF8

# ---- Step 6: Fix index.html (add Arabic font + RTL) ----
Write-Host "[6/7] Fixing index.html..." -ForegroundColor Cyan
$indexHtml = @'
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <title>منيرا 💖</title>
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
Set-Content -Path "index.html" -Value $indexHtml -Encoding UTF8

# ---- Step 7: Push to GitHub ----
Write-Host "[7/7] Pushing to GitHub..." -ForegroundColor Cyan

# Clean API keys from any tracked files before commit
Get-ChildItem -Recurse -Include *.jsx,*.js,*.ts,*.tsx,*.json,*.md -Exclude node_modules | ForEach-Object {
    if ($_.FullName -notmatch "node_modules") {
        $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match "AIza[0-9A-Za-z_-]{35}") {
            Write-Host "  Cleaning API key from: $($_.Name)" -ForegroundColor Yellow
            $cleaned = $content -replace "AIza[0-9A-Za-z_-]{35}", ""
            Set-Content -Path $_.FullName -Value $cleaned -Encoding UTF8 -NoNewline
        }
    }
}

git add .
git commit -m "Fix: Install Tailwind v3 + configure properly"
git push origin main

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "ALL DONE! " -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "What happens next:" -ForegroundColor White
Write-Host "  1. Vercel detects the push in ~10 seconds" -ForegroundColor White
Write-Host "  2. It rebuilds your app (about 1 minute)" -ForegroundColor White
Write-Host "  3. Open munira-delta.vercel.app" -ForegroundColor White
Write-Host "  4. Click the key icon to paste your NEW Gemini API key" -ForegroundColor White
Write-Host ""
Write-Host "Test locally right now with: npm run dev" -ForegroundColor Magenta
Write-Host ""
