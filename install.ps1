# Engineering Audit Skill — 一键安装脚本 (PowerShell / Windows)
# 用法: irm https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.ps1 | iex
#
# 安全说明:
#   此脚本使用 HTTPS 克隆仓库，通过 git 的传输加密保证完整性。
#   如需额外验证，设置环境变量 $env:EXPECTED_COMMIT_SHA 为预期的 commit SHA。

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

# 检测 curl (用于后续 API 调用)
$curl = Get-Command curl -ErrorAction SilentlyContinue

# 校验模式：如果设置了环境变量
$ExpectedSha = $env:EXPECTED_COMMIT_SHA
if ($ExpectedSha) {
    Write-Host "🔐 校验模式启用，预期 commit SHA: $ExpectedSha" -ForegroundColor Yellow
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

# 如果启用了校验模式，检查当前 HEAD
if ($ExpectedSha) {
    Push-Location $Dest
    try {
        $CurrentSha = git rev-parse HEAD
        if ($CurrentSha -ne $ExpectedSha) {
            Write-Host "❌ 校验失败: 当前 commit $CurrentSha 与预期 $ExpectedSha 不匹配" -ForegroundColor Red
            Write-Host "   可能遭受中间人攻击或版本更新" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ 完整性校验通过 ($CurrentSha)" -ForegroundColor Green
    } finally {
        Pop-Location
    }
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
Write-Host ""
Write-Host "🔐 如需校验完整性（可选）:" -ForegroundColor Cyan
Write-Host "   1. 访问 https://github.com/$Repo/releases/latest 获取最新 commit SHA" -ForegroundColor Cyan
Write-Host "   2. 设置环境变量: `$env:EXPECTED_COMMIT_SHA = '<SHA>'" -ForegroundColor Cyan
Write-Host "   3. 重新运行安装脚本" -ForegroundColor Cyan
