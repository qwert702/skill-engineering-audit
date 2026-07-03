# Engineering Audit Skill — 一键安装脚本 (PowerShell / Windows)
# 用法: irm https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.ps1 | iex

$ErrorActionPreference = "Stop"
$Repo = "qwert702/skill-engineering-audit"
$Dest = "$env:USERPROFILE\.claude\skills\engineering-audit"

Write-Host "🔍 正在安装 engineering-audit skill..." -ForegroundColor Cyan

# 检测 git
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "❌ 需要安装 git: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# 确保目标目录的父目录存在
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\skills" | Out-Null

# 克隆或更新
if (Test-Path $Dest) {
    Write-Host "📦 检测到已有安装，正在更新..." -ForegroundColor Yellow
    Push-Location $Dest
    try {
        git pull --ff-only origin main 2>$null
        if (-not $?) { git pull --ff-only origin master 2>$null }
    } finally {
        Pop-Location
    }
} else {
    Write-Host "📦 正在克隆仓库..." -ForegroundColor Yellow
    git clone --depth 1 "https://github.com/$Repo.git" $Dest
}

Write-Host ""
Write-Host "✅ engineering-audit skill 安装成功！" -ForegroundColor Green
Write-Host "   安装路径: $Dest"
Write-Host ""
Write-Host "🚀 在 Claude Code 中使用:" -ForegroundColor Cyan
Write-Host "   /engineering-audit"
Write-Host ""
Write-Host "📖 查看帮助:" -ForegroundColor Cyan
Write-Host "   /engineering-audit --help"
