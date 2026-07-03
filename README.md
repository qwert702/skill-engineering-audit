# 工程和代码审计 (Engineering & Code Audit)

适用于 **Claude Code** 的一站式工程审计 Skill，覆盖代码质量、安全、架构、性能、依赖和合规六个维度。

> 安装到 `~/.claude/skills/engineering-audit/` 后，在所有 Claude Code 会话中可通过 `/engineering-audit` 或自然语言触发。

---

## 概览

该 Skill 对目标代码库进行**系统性的多维度审计**，填补了 Claude Code 内置 `code-review`（仅审查当前 diff）与 `security-review`（仅关注安全影响）的空白——它针对的是**全量代码库的综合性审计**。

### 审计六维度

| 维度 | 覆盖范围 |
|------|---------|
| 🔍 **代码质量** | 死代码、重复代码、圈复杂度、命名约定、注释质量、类型安全、错误处理、资源泄漏 |
| 🔒 **安全** | OWASP Top 10 (2021) 全量覆盖：注入、认证、敏感数据、XXE、越权、安全配置、XSS/CSRF、依赖漏洞 |
| 🏗 **架构** | 分层违规、循环依赖、接口设计、单一职责、抽象程度、API 一致性 |
| ⚡ **性能** | N+1 查询、内存泄漏、不必要分配、低效算法、缓存机会 |
| 📦 **依赖** | 过时版本、已知漏洞、废弃包、未使用依赖 |
| 📋 **合规** | 许可合规、编码标准、日志安全、数据隐私、API 版本化 |

---

## 快速开始

### 安装

```bash
# 克隆仓库
git clone git@github.com:qwert702/skill-engineering-audit.git ~/.claude/skills/engineering-audit
```

或直接下载压缩包解压到 `~/.claude/skills/engineering-audit/` 目录。

### 基础使用

```bash
# 标准深度全量审计（六维）
/engineering-audit

# 专项审计：仅安全维度
/engineering-audit --focus security

# 多维度组合
/engineering-audit --focus quality,architecture

# 深度审计（子代理并发分析）
/engineering-audit --depth deep

# 限定审计路径
/engineering-audit --path src/api/

# 输出到文件
/engineering-audit --output ./audit-report.md
```

### 参数说明

| 参数 | 可选值 | 默认 | 说明 |
|------|--------|------|------|
| `--path` | 任意路径 | `.`（当前目录） | 审计目标路径 |
| `--focus` | `quality` / `security` / `architecture` / `performance` / `dependencies` / `compliance` / `all` | `all` | 审计焦点维度，逗号分隔 |
| `--depth` | `quick` / `standard` / `deep` | `standard` | 审计深度 |
| `--output` | 文件路径 | 终端输出 | 审计报告输出路径 |

---

## 工作流程

```
Phase 1: 范围定义
  解析参数 → 确定路径 / 焦点维度 / 深度
  → 输出: 审计计划

Phase 2: 数据收集
  Glob 扫描文件 → 识别项目类型 → 读取配置和依赖
  → 输出: 文件清单 + 项目元数据

Phase 3: 并发分析
  对每个选中维度启动并行分析
  → 输出: 各维度发现项列表

Phase 4: 汇总 & 分类
  合并 → 去重 → 按严重等级分类
  → 输出: 结构化发现项集合

Phase 5: 报告生成
  填充模板 → 生成 Markdown 报告
  → 输出: 完整审计报告
```

> `--depth deep` 模式下，Phase 3 会为每个维度启动独立的 Claude 子代理并行执行，大幅提升大规模代码库的审计效率。

---

## 严重等级分类

| 等级 | 判定标准 | 响应时限 |
|------|---------|---------|
| 🔴 **高危** | 直接影响安全性或核心功能，可能导致数据泄露、服务不可用、权限绕过 | 24小时内 |
| 🟠 **中危** | 显著影响代码质量或可用性，可能导致性能退化、维护困难 | 1周内 |
| 🟡 **低危** | 轻微违反最佳实践或编码规范，不影响功能正确性 | 1月内 |
| 🔵 **信息** | 观察性发现，无直接风险，供参考 | 酌情 |

---

## 报告输出

审计报告采用结构化 Markdown 格式，包含：

1. **执行摘要** — 发现项总览、总体评估、优先行动项（前 5）
2. **发现项清单** — 表格：编号、等级、维度、文件:行号、描述、建议
3. **详细分析** — 每个发现项的完整分析（风险描述、复现路径、影响评估、修复建议、验证方法）
4. **审计范围说明** — 覆盖/未覆盖范围、局限性
5. **修复优先级建议** — P0/P1/P2 分级，含建议完成时间

同时支持**修复跟踪**，可持续追踪发现项的修复进度：

```
发现 → 待修复 → 修复中 → PR → 验证 → 关闭
```

---

## 与内置技能的关系

| 内置技能 | 定位 | 本技能 |
|---------|------|--------|
| `code-review` | 审查当前 diff 的 Bug | **全量代码库**的多维度审计 |
| `security-review` | 变更的安全影响 | **完整安全态势评估** + 其他五个维度 |
| `review` | GitHub PR 评论 | **独立审计报告**，非 PR 上下文 |
| `verify` | 验证某变更的效果 | **专注发现和分析**，不验证修复 |

---

## 最佳实践

- **定期审计**：每月一次标准深度全量审计 + 每周一次快速扫描
- **重构前**：大版本升级或大规模重构前，必须做深度审计
- **增量审计**：code-review 发现问题后，用本技能全量摸排确认影响范围
- **关注趋势**：跟踪历次审计的发现数量与等级分布，评估代码库健康趋势

---

## 目录结构

```
└── engineering-audit/
    ├── SKILL.md                       # 主技能定义
    ├── references/
    │   ├── audit-dimensions.md        # 六维审计总纲
    │   ├── code-quality-checklist.md  # 代码质量检查清单
    │   └── severity-classification.md # 严重等级分类指南
    └── templates/
        ├── audit-report-template.md   # 审计报告模板
        └── fix-tracking-template.md   # 修复跟踪模板
```

---

## 许可

MIT
