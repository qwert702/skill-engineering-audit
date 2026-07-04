# Engineering Audit Skill — 卸载脚本 (PowerShell / Windows)
# 用法: irm https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/uninstall.ps1 | iex

$Dest = "$env:USERPROFILE\.claude\skills\engineering-audit"

Write-Host "🔍 正在卸载 engineering-audit skill..." -ForegroundColor Cyan

if (-not (Test-Path $Dest)) {
    Write-Host "ℹ️  未检测到安装目录: $Dest" -ForegroundColor Yellow
    Write-Host "   可能已被卸载或从未安装。" -ForegroundColor Yellow
    exit 0
}

# 确认卸载
Write-Host "即将删除: $Dest" -ForegroundColor Red
$Confirm = Read-Host "是否继续？(y/N)"
if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "❌ 已取消卸载" -ForegroundColor Red
    exit 1
}

Remove-Item -Recurse -Force $Dest
Write-Host "✅ engineering-audit skill 已卸载" -ForegroundColor Green
Write-Host "   如果之前使用过此技能，请重启 Claude Code 会话以完全清除。" -ForegroundColor Yellow
