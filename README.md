<p align="center">
  <a href="README.md">🇨🇳 中文</a> · <a href="README.en.md">🇬🇧 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.2.0-blue?style=flat-square" alt="Version 2.2.0">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/github/last-commit/qwert702/skill-engineering-audit?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/dimensions-6-ff69b4?style=flat-square" alt="6 Audit Dimensions">
</p>

---

# 工程和代码审计

适用于 **Claude Code** 的一站式工程审计 Skill，覆盖代码质量、安全、架构、性能、依赖和合规六个维度。

> 安装到 `~/.claude/skills/engineering-audit/` 后，在所有 Claude Code 会话中可通过 `/engineering-audit` 或自然语言触发。

---

## 为什么要用这个 Skill？

这不是又一个代码审查工具——它和你见过的所有审计工具都不一样。

### 🔥 核心优势

| # | 优势 | 说明 |
|---|------|------|
| **1** | **六维一体，一站覆盖** | 一份命令跑完质量、安全、架构、性能、依赖、合规六个维度，统一格式输出。不再需要在 SonarQube、Snyk、ESLint、OWASP ZAP 之间来回切换 |
| **2** | **不是变更审查，是全量体检** | Claude Code 内置的 `code-review` 只看当前 git diff，本技能扫描**整个代码库**——接手遗留系统、大版本升级前、定期巡检，这才是它的战场 |
| **3** | **安全审计不止看变更** | `security-review` 只看本次改动的安全影响，但大量安全问题是历史累积的。本技能按 **OWASP Top 10 逐项全量扫描**，把历史债务一并挖出 |
| **4** | **修复跟踪形成闭环** | 发现问题不难，难的是确保修了。内置修复跟踪模板，**从发现到关闭的完整状态流转**，支持多轮审计对比修复率趋势。Claude Code 生态里独此一家 |
| **5** | **维度可组合，深度可调节** | `--focus` 选维度、`--depth` 调深度。快速扫描 30 秒出结果、深度审计全面摸底、专项审计聚焦安全——**一份 skill 适配多种场景** |
| **6** | **深度模式并发分析** | `--depth deep` 时为每个维度启动独立 Claude 子代理并行分析。维度之间逻辑独立、互不重叠，并发收益远高于传统单线程审计 |

> **一句话定位**：`code-review` 是「每次提交的持续集成检查」，这个 skill 是「每月一次的代码全面体检」——维度更广、视角更高、输出更系统。

---

## 概览

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

## 🚀 高级特性

### 1. 增量审计 (`--incremental`)

只审计 git 历史中有变更的文件，而非全量扫描。

```bash
# 自上次审计以来的增量
/engineering-audit --incremental

# 自指定日期以来的变更
/engineering-audit --incremental --since 2025-06-01

# 自最后 N 次提交以来的变更
/engineering-audit --incremental --since HEAD~5
```

**适用场景**：每日快速检查、CI pipeline 集成、code-review 后的补充摸底。

---

### 2. CI 集成 (`--output-format json`)

输出标准 JSON 格式，可被任何 CI 工具解析。

```bash
/engineering-audit --depth quick --output-format json --output ./audit.json
```

**典型 CI 用法**：在 pipeline 中解析 health_score，当 critical 发现数 > 0 时阻断合入；上报健康分到 Grafana 仪表盘；自动对比上一轮审计结果，发现数增加时通知团队。

---

### 3. 自定义检查规则 (`--rules`)

通过 `.auditrules.yaml` 定义项目特有的审计规则。

```bash
/engineering-audit --rules .auditrules.yaml
```

**支持规则类型**：

- **模式匹配**：正则搜索指定模式（如禁止 `console.log`、硬编码密码）
- **度量阈值**：检查函数长度、圈复杂度等度量值是否超标
- **上下文感知**：排除特定上下文的匹配（如已有鉴权的路由不报未鉴权）

---

### 4. 审计历史与趋势 (`--history --trend`)

自动记录每次审计结果，支持趋势对比。

```bash
# 查看历史记录列表
/engineering-audit --history

# 生成趋势分析报告
/engineering-audit --history --trend
```

**输出内容**：发现数量趋势图、严重等级分布变化、修复率统计、健康度评分曲线。
**内置健康度公式**：`100 - (高危×10 + 中危×5 + 低危×2)`，一目了然。

---

## 快速开始

### 安装

**一行命令安装：**

```bash
# Linux / macOS
curl -sfL https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.sh | sh

# Windows (PowerShell)
irm https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.ps1 | iex
```

**手动安装：**

```bash
# 克隆仓库
git clone git@github.com:qwert702/skill-engineering-audit.git ~/.claude/skills/engineering-audit
```

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

### 效果预览

想看看审计报告长什么样？查看 **[示例审计报告](./examples/sample-audit-report.md)**。

想亲手测试？仓库自带的 **[test-fixture](./test-fixture/)** 目录包含故意植入的 15 个问题（SQL 注入、硬编码密钥、N+1 查询等），可直接运行审计验证效果：

```bash
# 在 test-fixture 目录下执行
/engineering-audit --depth standard
```

### 参数说明

| 参数 | 可选值 | 默认 | 说明 |
|------|--------|------|------|
| `--path` | 任意路径 | `.`（当前目录） | 审计目标路径 |
| `--focus` | `quality` / `security` / `architecture` / `performance` / `dependencies` / `compliance` / `all` | `all` | 审计焦点维度，逗号分隔 |
| `--depth` | `quick` / `standard` / `deep` | `standard` | 审计深度 |
| `--output` | 文件路径 | 终端输出 | 审计报告输出路径 |
| `--output-format` | `markdown` / `json` | `markdown` | 报告输出格式 |
| `--incremental` | 无值 | 关闭 | 增量模式，仅审计 git 历史中有变更的文件 |
| `--since` | git 引用/日期 | — | 与 `--incremental` 配合，指定增量起点 |
| `--rules` | 文件路径 | — | 自定义检查规则文件路径 |
| `--history` | 无值 | 关闭 | 查看审计历史记录 |
| `--trend` | 无值 | 关闭 | 与 `--history` 配合，生成趋势分析 |

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
  填充模板 → 生成 Markdown / JSON 报告
  → 输出: 完整审计报告
```

> `--depth deep` 模式下，Phase 3 会为每个维度启动独立的 Claude 子代理并行执行，大幅提升大规模代码库的审计效率。

---

## 严重等级分类

| 等级 | 判定标准 | 响应时限 |
|------|---------|---------|
| 🔴 **严重** | 直接影响安全性或核心功能，可能导致数据泄露、服务不可用、权限绕过 | 24小时内 |
| 🟠 **高危** | 显著影响代码质量或可用性，可能导致性能退化、维护困难 | 1周内 |
| 🟡 **中危** | 轻微违反最佳实践或编码规范，不影响功能正确性 | 1月内 |
| 🔵 **低危** | 观察性发现，无直接风险，供参考 | 酌情 |
| ⚪ **信息** | 纯信息提示，不构成风险 | 无需响应 |

---

## 报告输出

审计报告采用结构化格式，包含：

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
    ├── SKILL.md                       # 主技能定义（v2.1.0）
    ├── CHANGELOG.md                   # 更新说明
    ├── .audit-history.yaml            # 审计历史记录
    ├── references/
    │   ├── audit-dimensions.md        # 六维审计总纲
    │   ├── code-quality-checklist.md  # 代码质量检查清单
    │   └── severity-classification.md # 严重等级分类指南
    ├── templates/
    │   ├── audit-report-template.md   # 审计报告模板
    │   └── fix-tracking-template.md   # 修复跟踪模板
    ├── examples/
    │   └── sample-audit-report.md     # 示例审计报告
    ├── test-fixture/                  # 测试夹具（含故意植入问题的代码）
    ├── install.sh                     # Linux/macOS 安装脚本
    └── install.ps1                    # Windows 安装脚本
```

---

## 许可

MIT
