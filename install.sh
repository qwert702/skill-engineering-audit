#!/bin/sh
# Engineering Audit Skill — 一键安装脚本 (Linux/macOS)
# 用法: curl -sfL https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.sh | sh
#
# 安全说明:
#   此脚本使用 HTTPS 克隆仓库，通过 git 的传输加密保证完整性。
#   如需额外的完整性校验，请使用 `--verify` 参数指定预期 commit SHA。

set -e

REPO="qwert702/skill-engineering-audit"
RELEASE_URL="https://api.github.com/repos/${REPO}/releases/latest"
DEST="${HOME}/.claude/skills/engineering-audit"

echo "🔍 正在安装 engineering-audit skill..."

# 检查依赖
for cmd in git curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "❌ 需要安装 $cmd: https://git-scm.com/"
    exit 1
  fi
done

# 校验模式：--verify 需提供预期的提交 SHA
if [ "$1" = "--verify" ] && [ -n "$2" ]; then
  EXPECTED_SHA="$2"
  echo "🔐 校验模式启用，预期 commit SHA: ${EXPECTED_SHA}"
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

# 如果启用了校验模式，检查当前 HEAD
if [ -n "$EXPECTED_SHA" ]; then
  cd "$DEST"
  CURRENT_SHA=$(git rev-parse HEAD)
  if [ "$CURRENT_SHA" != "$EXPECTED_SHA" ]; then
    echo "❌ 校验失败: 当前 commit ${CURRENT_SHA} 与预期 ${EXPECTED_SHA} 不匹配"
    echo "   可能遭受中间人攻击或版本更新"
    exit 1
  fi
  echo "✅ 完整性校验通过 (${CURRENT_SHA})"
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
echo ""
echo "🔐 如需校验完整性（可选）:"
echo "   1. 访问 https://github.com/${REPO}/releases/latest 获取最新 commit SHA"
echo "   2. 运行: curl -sfL https://raw.githubusercontent.com/${REPO}/main/install.sh | sh -s -- --verify <SHA>"
