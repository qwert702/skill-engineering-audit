#!/bin/sh
# Engineering Audit Skill — 卸载脚本 (Linux/macOS)
# 用法: curl -sfL https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/uninstall.sh | sh

DEST="${HOME}/.claude/skills/engineering-audit"

echo "🔍 正在卸载 engineering-audit skill..."

if [ ! -d "$DEST" ]; then
  echo "ℹ️  未检测到安装目录: $DEST"
  echo "   可能已被卸载或从未安装。"
  exit 0
fi

# 确认卸载
echo "即将删除: $DEST"
echo "是否继续？(y/N): "
read -r CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "❌ 已取消卸载"
  exit 1
fi

rm -rf "$DEST"
echo "✅ engineering-audit skill 已卸载"
echo "   如果之前使用过此技能，请重启 Claude Code 会话以完全清除。"
