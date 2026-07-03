# 工程和代码审计 (Engineering & Code Audit)

适用于 **Claude Code** 的一站式工程审计 Skill，覆盖代码质量、安全、架构、性能、依赖和合规六个维度。

An all-in-one engineering audit **Skill for Claude Code**, covering six dimensions: **Code Quality, Security, Architecture, Performance, Dependencies, and Compliance**.

> 安装到 `~/.claude/skills/engineering-audit/` 后，在所有 Claude Code 会话中可通过 `/engineering-audit` 或自然语言触发。
>
> Once installed to `~/.claude/skills/engineering-audit/`, it can be triggered via `/engineering-audit` or natural language in any Claude Code session.

---

## 为什么要用这个 Skill？ / Why This Skill?

这不是又一个代码审查工具——它和你见过的所有审计工具都不一样。

This isn't just another code review tool — it's fundamentally different from every audit tool you've seen.

### 🔥 核心优势 / Key Differentiators

| # | 优势 (Advantage) | 说明 (Details) |
|---|-----------------|----------------|
| **1** | **六维一体，一站覆盖** | 一份命令跑完质量、安全、架构、性能、依赖、合规六个维度，统一格式输出。**不再需要在 SonarQube、Snyk、ESLint、OWASP ZAP 之间来回切换** |
| | _Six dimensions, one command_ | _One command runs audits across Quality, Security, Architecture, Performance, Dependencies, and Compliance — all in a unified format. **No more juggling SonarQube, Snyk, ESLint, and OWASP ZAP**_ |
| **2** | **不是变更审查，是全量体检** | Claude Code 内置的 `code-review` 只看当前 git diff，本技能扫描**整个代码库**——接手遗留系统、大版本升级前、定期巡检，这才是它的战场 |
| | _Whole-codebase health check, not just diffs_ | _Claude Code's built-in `code-review` only looks at the current git diff. This skill scans **the entire codebase** — the right tool for legacy system handover, pre-major-upgrade assessment, and regular health checks_ |
| **3** | **安全审计不止看变更** | `security-review` 只看本次改动的安全影响，但大量安全问题是历史累积的。本技能按 **OWASP Top 10 逐项全量扫描**，把历史债务一并挖出 |
| | _Security audit beyond changed files_ | _`security-review` only checks the security impact of changes you're making right now. But most security issues are cumulative. This skill performs a **full OWASP Top 10 sweep**, uncovering historical debt others miss_ |
| **4** | **修复跟踪形成闭环** | 发现问题不难，难的是确保修了。内置修复跟踪模板，**从发现到关闭的完整状态流转**，支持多轮审计对比修复率趋势。Claude Code 生态里独此一家 |
| | _Fix tracking closes the loop_ | _Finding issues is easy; ensuring they're fixed is hard. Built-in fix tracking templates for **end-to-end lifecycle from discovery to closure**, with trend analysis across audit rounds. **Unique in the Claude Code ecosystem**_ |
| **5** | **维度可组合，深度可调节** | `--focus` 选维度、`--depth` 调深度。快速扫描 30 秒出结果、深度审计全面摸底、专项审计聚焦安全——**一份 skill 适配多种场景** |
| | _Composable dimensions, adjustable depth_ | _`--focus` selects audit dimensions, `--depth` controls depth. Quick scan in 30 seconds, deep audit for full assessment, focused audit for specific concerns — **one skill for every scenario**_ |
| **6** | **深度模式并发分析** | `--depth deep` 时为每个维度启动独立 Claude 子代理并行分析。维度之间逻辑独立、互不重叠，**并发收益远高于传统单线程审计** |
| | _Concurrent deep analysis_ | _At `--depth deep`, each dimension runs as an independent Claude sub-agent in parallel. Dimensions are logically independent with zero overlap, delivering **far greater concurrency gains than traditional single-threaded audits**_ |

> 一句话定位：`code-review` 是「每次提交的持续集成检查」，这个 skill 是「每月一次的代码全面体检」——维度更广、视角更高、输出更系统。
>
> _In one sentence: `code-review` is "CI for every commit"; this skill is "your monthly full physical" — broader scope, higher perspective, more systematic output._

---

## 概览 / Overview

### 审计六维度 / Six Audit Dimensions

| 维度 (Dimension) | 覆盖范围 (Coverage) |
|-----------------|---------------------|
| 🔍 **代码质量 (Code Quality)** | 死代码、重复代码、圈复杂度、命名约定、注释质量、类型安全、错误处理、资源泄漏 / _Dead code, duplication, cyclomatic complexity, naming conventions, comment quality, type safety, error handling, resource leaks_ |
| 🔒 **安全 (Security)** | OWASP Top 10 (2021) 全量覆盖：注入、认证、敏感数据、XXE、越权、安全配置、XSS/CSRF、依赖漏洞 / _Full OWASP Top 10 (2021): Injection, Auth, Sensitive Data, XXE, Broken Access Control, Misconfiguration, XSS/CSRF, Dependency Vulnerabilities_ |
| 🏗 **架构 (Architecture)** | 分层违规、循环依赖、接口设计、单一职责、抽象程度、API 一致性 / _Layering violations, circular dependencies, interface design, single responsibility, abstraction level, API consistency_ |
| ⚡ **性能 (Performance)** | N+1 查询、内存泄漏、不必要分配、低效算法、缓存机会 / _N+1 queries, memory leaks, unnecessary allocations, inefficient algorithms, caching opportunities_ |
| 📦 **依赖 (Dependencies)** | 过时版本、已知漏洞、废弃包、未使用依赖 / _Outdated versions, known vulnerabilities, deprecated packages, unused dependencies_ |
| 📋 **合规 (Compliance)** | 许可合规、编码标准、日志安全、数据隐私、API 版本化 / _License compliance, coding standards, log safety, data privacy, API versioning_ |

---

## 🚀 高级特性 / Advanced Features

### 1. 增量审计 / Incremental Audit (`--incremental`)

只审计 git 历史中有变更的文件，而非全量扫描。/ _Audit only files that have changed since a known point, not the entire codebase._

```bash
# 自上次审计以来的增量 / Since the last audit
/engineering-audit --incremental

# 自指定日期以来的变更 / Since a specific date
/engineering-audit --incremental --since 2025-06-01

# 自最后 N 次提交以来的变更 / Since the last N commits
/engineering-audit --incremental --since HEAD~5
```

**适用场景**：每日快速检查、CI pipeline 集成、code-review 后的补充摸底。
_**Use cases**: Daily health checks, CI pipeline gating, quick follow-up after `code-review`._

---

### 2. CI 集成 / CI Integration (`--output-format json`)

输出标准 JSON 格式，可被任何 CI 工具解析。/ _Outputs standard JSON that any CI tool can parse._

```bash
/engineering-audit --depth quick --output-format json --output ./audit.json
```

**典型 CI 用法**：在 pipeline 中解析 health_score，当 critical 发现数 > 0 时阻断合入；上报健康分到 Grafana 仪表盘；自动对比上一轮审计结果，发现数增加时通知团队。

_**Typical CI flow**: Block the pipeline when `critical > 0`; report `health_score` to a Grafana dashboard; auto-notify the team when finding count increases._

---

### 3. 自定义检查规则 / Custom Audit Rules (`--rules`)

通过 `.auditrules.yaml` 定义项目特有的审计规则。/ _Define project-specific audit rules via `.auditrules.yaml`._

```bash
/engineering-audit --rules .auditrules.yaml
```

**支持规则类型 / Rule types**：
- **模式匹配 / Pattern matching**：正则搜索指定模式（如禁止 `console.log`、硬编码密码）/ _Regex search for forbidden patterns (e.g. `console.log`, hardcoded secrets)_
- **度量阈值 / Metric thresholds**：检查函数长度、圈复杂度等度量值是否超标 / _Check function length, cyclomatic complexity against limits_
- **上下文感知 / Context-aware**：排除特定上下文的匹配（如已有鉴权的路由不报未鉴权）/ _Exclude matches in specific contexts (e.g. routes already protected by auth middleware)_

---

### 4. 审计历史与趋势 / Audit History & Trends (`--history --trend`)

自动记录每次审计结果，支持趋势对比。/ _Every audit result is automatically recorded for trend comparison._

```bash
# 查看历史记录列表 / List all historical records
/engineering-audit --history

# 生成趋势分析报告 / Generate trend analysis report
/engineering-audit --history --trend
```

**输出内容**：发现数量趋势图、严重等级分布变化、修复率统计、健康度评分曲线。
_**Outputs**: Finding count trend chart, severity distribution changes, fix rate stats, health score curve._

**内置健康度公式 / Built-in health formula**：`100 - (高危×10 + 中危×5 + 低危×2)`，一目了然。/ _`100 - (critical×10 + high×5 + medium×2)` — instant codebase health at a glance._

---

## 快速开始 / Quick Start

### 安装 / Installation

```bash
# 克隆仓库 / Clone the repository
git clone git@github.com:qwert702/skill-engineering-audit.git ~/.claude/skills/engineering-audit
```

或直接下载压缩包解压到 `~/.claude/skills/engineering-audit/` 目录。
_Or download the archive and extract it to `~/.claude/skills/engineering-audit/`._

### 基础使用 / Basic Usage

```bash
# 标准深度全量审计（六维）/ Full audit at standard depth (all 6 dimensions)
/engineering-audit

# 专项审计：仅安全维度 / Focused audit: security only
/engineering-audit --focus security

# 多维度组合 / Multi-dimension combination
/engineering-audit --focus quality,architecture

# 深度审计（子代理并发分析）/ Deep audit (parallel sub-agent analysis)
/engineering-audit --depth deep

# 限定审计路径 / Scope to specific path
/engineering-audit --path src/api/

# 输出到文件 / Output to file
/engineering-audit --output ./audit-report.md
```

### 参数说明 / Parameters

| 参数 (Flag) | 可选值 (Values) | 默认 (Default) | 说明 (Description) |
|-------------|-----------------|----------------|--------------------|
| `--path` | 任意路径 / Any path | `.`（当前目录 / current dir） | 审计目标路径 / _Target path to audit_ |
| `--focus` | `quality` / `security` / `architecture` / `performance` / `dependencies` / `compliance` / `all` | `all` | 审计焦点维度，逗号分隔 / _Audit focus dimension(s), comma-separated_ |
| `--depth` | `quick` / `standard` / `deep` | `standard` | 审计深度 / _Audit depth_ |
| `--output` | 文件路径 / File path | 终端输出 / Terminal output | 审计报告输出路径 / _Output audit report to file_ |
| `--output-format` | `markdown` / `json` | `markdown` | 报告输出格式 / _Report output format_ |
| `--incremental` | 无值 / Flag | 关闭 / Off | 增量模式，仅审计 git 历史中有变更的文件 / _Incremental mode: only audit files changed in git history_ |
| `--since` | git 引用/日期 / Git ref/date | — | 与 `--incremental` 配合，指定增量起点 / _Used with `--incremental` to specify the starting point_ |
| `--rules` | 文件路径 / File path | — | 自定义检查规则文件路径 / _Custom audit rules file path_ |
| `--history` | 无值 / Flag | 关闭 / Off | 查看审计历史记录 / _View audit history records_ |
| `--trend` | 无值 / Flag | 关闭 / Off | 与 `--history` 配合，生成趋势分析 / _Used with `--history` to generate trend analysis_ |

---

## 工作流程 / Workflow

```
Phase 1: 范围定义 / Scope Definition
  解析参数 → 确定路径 / 焦点维度 / 深度
  Parse arguments → Determine path / focus / depth
  → 输出: 审计计划 / Output: Audit plan

Phase 2: 数据收集 / Data Collection
  Glob 扫描文件 → 识别项目类型 → 读取配置和依赖
  Glob file scan → Identify project type → Read configs & dependencies
  → 输出: 文件清单 + 项目元数据 / Output: File list + project metadata

Phase 3: 并发分析 / Concurrent Analysis
  对每个选中维度启动并行分析
  Parallel analysis per selected dimension
  → 输出: 各维度发现项列表 / Output: Dimension-specific findings

Phase 4: 汇总 & 分类 / Aggregation & Classification
  合并 → 去重 → 按严重等级分类
  Merge → Deduplicate → Classify by severity
  → 输出: 结构化发现项集合 / Output: Structured findings collection

Phase 5: 报告生成 / Report Generation
  填充模板 → 生成 Markdown / JSON 报告
  Fill template → Generate Markdown / JSON report
  → 输出: 完整审计报告 / Output: Complete audit report
```

> `--depth deep` 模式下，Phase 3 会为每个维度启动独立的 Claude 子代理并行执行，大幅提升大规模代码库的审计效率。
>
> _In `--depth deep` mode, Phase 3 launches independent Claude sub-agents for each dimension, running them concurrently for large codebases._

---

## 严重等级分类 / Severity Classification

| 等级 (Level) | 判定标准 (Criteria) | 响应时限 (Response Time) |
|-------------|--------------------|--------------------------|
| 🔴 **高危 / Critical** | 直接影响安全性或核心功能，可能导致数据泄露、服务不可用、权限绕过 / _Direct security impact or core functionality failure — data breach, service outage, privilege escalation_ | 24小时内 / Within 24h |
| 🟠 **中危 / High** | 显著影响代码质量或可用性，可能导致性能退化、维护困难 / _Significant quality or availability impact — performance degradation, maintenance burden_ | 1周内 / Within 1 week |
| 🟡 **低危 / Medium** | 轻微违反最佳实践或编码规范，不影响功能正确性 / _Minor best-practice violation — doesn't affect correctness_ | 1月内 / Within 1 month |
| 🔵 **信息 / Info** | 观察性发现，无直接风险，供参考 / _Observation only, no direct risk_ | 酌情 / As needed |

---

## 报告输出 / Report Output

审计报告采用结构化格式，包含：/ _The audit report is generated as structured output containing:_

1. **执行摘要 / Executive Summary** — 发现项总览、总体评估、优先行动项（前 5）/ _Finding overview, overall assessment, top 5 priority actions_
2. **发现项清单 / Finding List** — 表格：编号、等级、维度、文件:行号、描述、建议 / _Table: ID, severity, dimension, file:line, description, recommendation_
3. **详细分析 / Detailed Analysis** — 每个发现项的完整分析（风险描述、复现路径、影响评估、修复建议、验证方法）/ _Full analysis per finding (risk description, reproduction steps, impact assessment, fix suggestion, verification steps)_
4. **审计范围说明 / Scope Notes** — 覆盖/未覆盖范围、局限性 / _Covered / not-covered areas, limitations_
5. **修复优先级建议 / Fix Priority** — P0/P1/P2 分级，含建议完成时间 / _P0/P1/P2 tiers with suggested deadlines_

同时支持**修复跟踪**，可持续追踪发现项的修复进度：/ _**Fix tracking** is also supported for ongoing follow-up:_

```
发现 (Discovered) → 待修复 (Pending) → 修复中 (In Progress) → PR → 验证 (Verified) → 关闭 (Closed)
```

---

## 与内置技能的关系 / Relationship to Built-in Skills

| 内置技能 (Built-in Skill) | 定位 (Role) | 本技能 (This Skill) |
|--------------------------|-------------|---------------------|
| `code-review` | 审查当前 diff 的 Bug / _Bug-hunt on the current diff_ | **全量代码库**的多维度审计 / _**Whole-codebase** multi-dimensional audit_ |
| `security-review` | 变更的安全影响 / _Security impact of changes_ | **完整安全态势评估** + 其他五个维度 / _**Full security posture assessment** + 5 other dimensions_ |
| `review` | GitHub PR 评论 / _Comment on GitHub PRs_ | **独立审计报告**，非 PR 上下文 / _**Standalone audit report**, not PR context_ |
| `verify` | 验证某变更的效果 / _Verify one change works_ | **专注发现和分析**，不验证修复 / _**Focus on discovery & analysis**, not fix verification_ |

---

## 最佳实践 / Best Practices

- **定期审计 / Regular cadence**：每月一次标准深度全量审计 + 每周一次快速扫描 / _Monthly full audit (standard depth) + weekly quick scan_
- **重构前 / Before refactoring**：大版本升级或大规模重构前，必须做深度审计 / _Run a deep audit before major version upgrades or large-scale refactoring_
- **增量审计 / Incremental audit**：code-review 发现问题后，用本技能全量摸排确认影响范围 / _After `code-review` finds issues, run this skill to assess full impact scope_
- **关注趋势 / Track trends**：跟踪历次审计的发现数量与等级分布，评估代码库健康趋势 / _Monitor finding counts and severity distribution across audits to gauge codebase health_

---

## 目录结构 / Directory Structure

```
└── engineering-audit/
    ├── SKILL.md                       # 主技能定义 / Main skill definition (v2.0.0)
    ├── CHANGELOG.md                   # 更新说明 / Release notes
    ├── references/
    │   ├── audit-dimensions.md        # 六维审计总纲 / Six-dimension audit reference
    │   ├── code-quality-checklist.md  # 代码质量检查清单 / Code quality checklist
    │   └── severity-classification.md # 严重等级分类指南 / Severity classification guide
    └── templates/
        ├── audit-report-template.md   # 审计报告模板 / Audit report template
        └── fix-tracking-template.md   # 修复跟踪模板 / Fix tracking template
```

---

## 许可 / License

MIT
