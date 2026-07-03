#!/bin/sh
# Engineering Audit Skill — 一键安装脚本 (Linux/macOS)
# 用法: curl -sfL https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.sh | sh

set -e

REPO="qwert702/skill-engineering-audit"
DEST="${HOME}/.claude/skills/engineering-audit"

echo "🔍 正在安装 engineering-audit skill..."

# 检查依赖
if ! command -v git >/dev/null 2>&1; then
  echo "❌ 需要安装 git: https://git-scm.com/"
  exit 1
fi

# 确保目标目录的父目录存在
mkdir -p "${HOME}/.claude/skills"

# 克隆或更新
if [ -d "$DEST" ]; then
  echo "📦 检测到已有安装，正在更新..."
  cd "$DEST" && git pull --ff-only origin main 2>/dev/null || git pull --ff-only origin master 2>/dev/null || true
else
  echo "📦 正在克隆仓库..."
  git clone --depth 1 "https://github.com/${REPO}.git" "$DEST"
fi

echo ""
echo "✅ engineering-audit skill 安装成功！"
echo "   安装路径: $DEST"
echo ""
echo "🚀 在 Claude Code 中使用:"
echo "   /engineering-audit"
echo ""
echo "📖 查看帮助:"
echo "   /engineering-audit --help"
