---
name: engineering-audit
description: |
  对代码库进行全面的工程和安全审计，涵盖代码质量、安全、架构、性能、依赖和合规六个维度。
  此技能适用于以下场景：
  - "对代码库进行全面审计" / "做一次工程审计" / "代码库健康检查"
  - "代码质量检查" / "代码异味检测"
  - "安全审计" / "安全检查" / "OWASP"
  - "架构审查" / "架构评审" / "重构前检查"
  - "性能分析" / "性能瓶颈分析"
  - "依赖检查" / "依赖安全审计"
  - "合规审计" / "审计报告"
  - 需要系统性了解代码库整体质量水平的场景
  - 代码审查发现的漏洞需要进行系统性分类和追踪的场景
  - 重构或大版本升级前需要评估现有代码质量的场景
version: 2.0.0
platforms: [macos, windows, linux]
context: fork
allowed-tools: Read, Glob, Grep, Bash
metadata:
  hermes:
    tags: [audit, security, code-quality, architecture, performance, compliance, engineering]
    category: engineering
    related_skills: [code-review, security-review, verify]
user-invocable: true
---

# 工程和代码审计

> **版本 2.0.0** — 新增增量审计、CI 集成、自定义规则、历史趋势

## 概述

本技能对目标代码库进行**系统性的多维度审计**，从代码质量、安全、架构、性能、依赖和合规六个维度全面评估代码健康状况。

> 此技能与现有的 `CLAUDE.md` 工程标准配合使用。`CLAUDE.md` 定义了"编码时的规范"，本技能定义了"如何审计已完成的内容"。

### 审计六个维度

| 维度 | 覆盖范围 |
|------|---------|
| 🔍 代码质量 | 死代码、重复代码、圈复杂度、命名约定、注释质量、类型安全、错误处理、资源泄漏 |
| 🔒 安全 | OWASP Top 10：注入、认证、敏感数据、XXE、越权、安全配置、XSS/CSRF、依赖漏洞 |
| 🏗 架构 | 分层违规、循环依赖、接口滥用、单一职责、抽象程度 |
| ⚡ 性能 | N+1 查询、内存泄漏、不必要分配、低效算法、缺失缓存 |
| 📦 依赖 | 过时版本、已知漏洞、废弃包、未使用依赖 |
| 📋 合规 | 许可合规、编码标准、日志标准、数据隐私 |

---

## 使用方式

```bash
# 完整审计（标准深度）
/engineering-audit

# 指定审计路径
/engineering-audit --path src/

# 指定焦点维度（只审计某一维度）
/engineering-audit --focus security

# 指定审计深度
/engineering-audit --depth quick          # 快速扫描，仅高风险项
/engineering-audit --depth standard       # 标准深度（默认）
/engineering-audit --depth deep           # 深度审计，含子代理并发分析

# 多焦点组合
/engineering-audit --focus security,quality

# ---- 新增功能 ----

# 增量审计（只审计上次审计后有变更的文件）
/engineering-audit --incremental
/engineering-audit --incremental --since 2025-06-01    # 自指定日期后的变更
/engineering-audit --incremental --since HEAD~5         # 近 5 次提交

# 输出为 JSON 格式（可被 CI 解析）
/engineering-audit --output-format json --output ./audit-report.json

# 使用自定义检查规则
/engineering-audit --rules .auditrules.yaml

# 查看审计历史趋势
/engineering-audit --history                         # 展示所有历史摘要
/engineering-audit --history --trend                  # 生成趋势分析报告
```

### 参数说明

| 参数 | 可选值 | 默认 | 说明 |
|------|--------|------|------|
| `--path` | 任意路径 | `.`（当前目录） | 审计目标路径 |
| `--focus` | `quality`,`security`,`architecture`,`performance`,`dependencies`,`compliance`,`all` | `all` | 审计焦点，逗号分隔 |
| `--depth` | `quick`,`standard`,`deep` | `standard` | 审计深度 |
| `--output` | 文件路径 | 终端输出 | 审计报告输出路径 |
| `--output-format` | `markdown`,`json` | `markdown` | 报告输出格式 |
| `--incremental` | 无值 | 关闭 | 增量模式，仅审计 git 历史中有变更的文件 |
| `--since` | git 引用/日期 | — | 与 `--incremental` 配合，指定增量起点 |
| `--rules` | 文件路径 | — | 自定义检查规则文件路径 |
| `--history` | 无值 | 关闭 | 查看审计历史记录 |
| `--trend` | 无值 | 关闭 | 与 `--history` 配合，生成趋势分析 |

---

## 审计工作流

遵循以下六个阶段执行审计：

### Phase 1: 范围定义

1. 解析用户参数（`--path`、`--focus`、`--depth`、`--incremental` 等）
2. 确认审计目标路径存在且可读
3. 检查是否需查看历史/趋势（`--history`），如是则跳转到历史分析流程
4. 检查是否加载自定义规则（`--rules`），如是则读取规则文件
5. 输出：审计计划（scope + focus list + depth + mode）

### Phase 2: 数据收集

1. 使用 Glob/Grep 收集目标路径下的文件清单
2. **增量模式**（`--incremental`）：
   1. 检查是否 git 仓库，否则报错并回退到全量模式
   2. 如指定 `--since`：解析为 git 引用（日期、commit hash、`HEAD~N`）
   3. 如未指定 `--since`：读取 `.audit-history.yaml` 中上次审计的 commit hash
   4. 无历史记录：回退到全量模式并提示
   5. 运行 `git diff --name-only <since> HEAD` 获取变更文件列表
   6. 过滤出仍存在于工作树的文件
   7. 只审计这些文件，并在报告中标注"增量模式"
3. 识别项目类型（package.json、pyproject.toml、Cargo.toml、go.mod 等）
4. 读取项目配置文件和构建脚本
5. 收集依赖清单
6. 输出：待审计文件清单 + 项目元数据

### Phase 3: 并发分析

根据 `--focus` 选定的维度，对每个维度进行系统分析：

#### 3.1 代码质量审计
- 引用 `references/code-quality-checklist.md` 逐项检查
- 使用 Glob/Grep 扫描死代码和模式
- 评估圈复杂度、命名一致性、注释覆盖率

#### 3.2 安全审计
- 引用 `references/audit-dimensions.md` 的安全部分
- 按 OWASP Top 10 类别系统排查
- 检查配置、认证、授权、输入验证等

#### 3.3 架构审计
- 检测分层违规（跨层引用）
- 检测循环依赖
- 评估模块边界和职责划分

#### 3.4 性能审计
- 扫描循环中的数据库查询（N+1 模式）
- 检测内存泄漏模式
- 识别低效算法

#### 3.5 依赖审计
- 检查 package.json / Cargo.toml 等依赖文件
- 查找过时版本和已知漏洞
- 识别未使用依赖

#### 3.6 合规审计
- 检查许可声明
- 检查日志脱敏标准
- 检查数据隐私相关代码

#### 3.7 自定义规则检查（如果指定了 `--rules`）

如果用户通过 `--rules` 指定了自定义规则文件，在所有内置维度分析完成后执行：

1. 读取 `.auditrules.yaml`（或指定路径）中的规则定义
2. 逐条执行自定义检查规则
3. 每条规则的检查结果作为"自定义"维度的发现项纳入报告
4. 发现项的严重等级和分类按规则文件中的定义为准

> `--depth deep` 模式下，对每个维度启动独立子代理并行分析，最后汇总结果。

### Phase 4: 发现分类

1. 合并各维度的发现项
2. 去重：相同位置和描述的发现项只保留一条
3. 引用 `references/severity-classification.md` 按严重等级分类
4. 为每个发现项分配唯一 ID（格式：`AUDIT-{序号}`）
5. 输出：结构化发现项集合

### Phase 5: 报告生成

参考 `templates/audit-report-template.md` 生成最终报告。

根据 `--output-format` 选择输出格式：
- `markdown`（默认）：使用 templates/audit-report-template.md 生成 Markdown 报告
- `json`：使用 JSON 结构输出，便于 CI 工具解析（结构定义见后文）

报告结构：
1. **执行摘要** — 总览、总体评估、优先行动项
2. **发现项清单** — 表格形式（编号、等级、类别、位置、描述、建议）
3. **详细分析** — 每个发现项的完整分析
4. **审计范围说明** — 本次审计覆盖/未覆盖的范围

**记录审计历史**（如果未使用 `--history` 模式）：
1. 在审计报告输出完成后，追加记录到 `.audit-history.yaml`
2. 记录内容：审计日期、commit hash、审计维度、各等级发现数、增量/全量模式
3. 如果 `.audit-history.yaml` 不存在则创建，存在则追加
4. 在报告中附上本次审计的相对排名（与历史记录对比）

### Phase 6: (可选) 修复跟踪

当用户要求跟踪修复进度时：
1. 引用 `templates/fix-tracking-template.md`
2. 记录各发现项的修复状态（待修复/已修复/无需修复）
3. 支持增量重审（只审计标记为已修复的项）

---

## 历史与趋势分析

当用户指定 `--history` 时，不执行新的审计，而是分析已有的 `.audit-history.yaml` 记录：

### 基础历史查看

```bash
/engineering-audit --history
```

输出内容：
1. 历史审计记录列表（表格：日期、commit、维度、发现数、增量/全量、耗时）
2. 每条记录的详细摘要链接

### 趋势分析

```bash
/engineering-audit --history --trend
```

生成趋势报告，包含：

#### 发现数量趋势
```
    发现数
     ↑
  12 │  █
  10 │  █ █
   8 │  █ █ █
   6 │  █ █ █ █
   4 │  █ █ █ █ █
   0 └─────────────────→ 审计轮次
      1   2   3   4   5
```

#### 严重等级分布趋势
- 高危发现数的变化曲线（上升/下降趋势）
- 中危发现数的变化曲线
- 整体修复率

#### 修复率统计
- 各轮次审计后修复的百分比
- 仍然未修复的发现项数量
- 新增发现项 vs 已关闭发现项的趋势

#### 健康度评分
计算一个简易健康度指标（每次审计后输出）：
- 基础分 100
- 每个高危 -10 分
- 每个中危 -5 分
- 每个低危 -2 分
- 增量模式的分数按比例修正（覆盖文件少不等于更健康）

输出趋势表格：
| 轮次 | 日期 | 发现总数 | 高危 | 中危 | 低危 | 信息 | 健康分 | 增量/全量 |
|------|------|---------|------|------|------|------|--------|----------|
| 1 | 2025-06-01 | 23 | 3 | 8 | 7 | 5 | 46 | 全量 |
| 2 | 2025-06-15 | 18 | 2 | 5 | 6 | 5 | 60 | 增量 |
| 3 | 2025-07-01 | 12 | 1 | 3 | 4 | 4 | 75 | 增量 |

---

## JSON 输出格式

当 `--output-format json` 时，输出标准 JSON 结构：

```json
{
  "meta": {
    "version": "2.0.0",
    "timestamp": "2025-07-03T10:30:00Z",
    "duration_seconds": 45,
    "mode": "full" | "incremental",
    "incremental_since": null | "<git-ref>"
  },
  "scope": {
    "path": "src/",
    "focus": ["quality", "security"],
    "depth": "standard",
    "files_audited": 128,
    "total_files": 156
  },
  "summary": {
    "total_findings": 15,
    "by_severity": {
      "critical": 2,
      "high": 4,
      "medium": 6,
      "info": 3
    },
    "by_dimension": {
      "quality": 5,
      "security": 7,
      "architecture": 1,
      "performance": 2,
      "dependencies": 0,
      "compliance": 0
    },
    "health_score": 58
  },
  "findings": [
    {
      "id": "AUDIT-001",
      "severity": "critical",
      "dimension": "security",
      "subcategory": "sql-injection",
      "title": "SQL 查询使用字符串拼接",
      "description": "...",
      "file": "src/api/users.ts",
      "line": 45,
      "recommendation": "使用参数化查询",
      "verification": "运行静态分析检查 SQL 拼接模式",
      "custom_rule": null
    }
  ],
  "history": {
    "previous_findings": 23,
    "previous_health_score": 46,
    "change": {
      "findings_delta": -8,
      "health_score_delta": 12
    }
  }
}
```

此 JSON 结构可直接被 CI 脚本解析，用于：
- 当 `critical > 0` 时让 CI pipeline 失败
- 将健康分上报到监控仪表盘
- 与上一轮审计对比，自动通知修复率下降

---

## 自定义检查规则

用户可以创建 `.auditrules.yaml` 文件，定义项目特有的检查规则。在审计时通过 `--rules` 指定：

```bash
/engineering-audit --rules .auditrules.yaml
```

### 规则文件格式

```yaml
# .auditrules.yaml - 自定义审计规则
version: "1.0"
rules:
  - id: "CUSTOM-001"
    title: "禁止使用 console.log"
    description: "生产代码中不允许出现 console.log，应使用项目日志框架"
    severity: medium          # critical | high | medium | info
    dimension: quality
    match:
      pattern: "console\\.(log|debug|warn|error)\\("
      include: "src/**/*.ts"  # 搜索范围 glob
      exclude: "src/**/*.test.ts"  # 排除范围 glob
    remediation: "替换为 logger.info / logger.warn / logger.error"
    verification: "grep -r 'console\\.' src/ 确认无输出"

  - id: "CUSTOM-002"
    title: "API 路由必须加鉴权中间件"
    description: "所有 /api/ 下新增的路由必须使用 authMiddleware"
    severity: critical
    dimension: security
    match:
      pattern: "router\\.(get|post|put|delete)\\(\\s*['\"]/"
      include: "src/routes/**/*.ts"
      # 排除已有鉴权的路由
      not_after:
        pattern: "\\.use\\(authMiddleware\\)"
        within_lines: 5
    remediation: "在路由定义后添加 .use(authMiddleware)"

  - id: "CUSTOM-003"
    title: "禁止硬编码敏感配置"
    description: "密码、密钥、Token 必须从环境变量读取"
    severity: critical
    dimension: security
    match:
      patterns:
        - "password\\s*[=:]\\s*['\"][^'\"]+['\"]"
        - "apiKey\\s*[=:]\\s*['\"][^'\"]+['\"]"
        - "secret\\s*[=:]\\s*['\"][^'\"]+['\"]"
      include: "src/**/*.ts"
    remediation: "替换为 process.env.VARIABLE_NAME"

  - id: "CUSTOM-004"
    title: "函数长度限制"
    description: "函数不应超过 60 行，超过应考虑拆分"
    severity: medium
    dimension: quality
    check_type: "metric"
    metric:
      type: "function_length"
      threshold: 60
      include: "src/**/*.ts"
    remediation: "将大函数按单一职责拆分为多个小函数"

  - id: "CUSTOM-005"
    title: "TODO 标记不可合入生产"
    description: "生产代码中不允许存在 TODO、FIXME、HACK 标记"
    severity: low
    dimension: quality
    match:
      pattern: "(TODO|FIXME|HACK|XXX)\\s*:"
      include: "src/**/*.ts"
      exclude: "**/*.md"
    remediation: "完成待办项或创建 Issue 跟踪"
```

### 规则字段说明

| 字段 | 必须 | 类型 | 说明 |
|------|------|------|------|
| `id` | 是 | 字符串 | 规则唯一标识，`CUSTOM-` 开头 |
| `title` | 是 | 字符串 | 规则标题 |
| `description` | 是 | 字符串 | 规则详细说明 |
| `severity` | 是 | 枚举 | critical/high/medium/info |
| `dimension` | 是 | 枚举 | quality/security/architecture/performance/dependencies/compliance |
| `match.pattern` | 否 | 字符串 | 正则匹配模式（单模式） |
| `match.patterns` | 否 | 字符串列表 | 正则匹配模式（多模式，任一匹配即触发） |
| `match.include` | 否 | glob | 搜索范围 |
| `match.exclude` | 否 | glob | 排除范围 |
| `match.not_after` | 否 | 对象 | 排除匹配后 N 行内存在另一模式的命中 |
| `check_type` | 否 | 枚举 | `pattern`（默认）/`metric`（度量值） |
| `metric` | 否 | 对象 | 度量规则定义（type + threshold） |
| `remediation` | 是 | 字符串 | 修复建议 |
| `verification` | 否 | 字符串 | 验证方法 |

### 规则默认路径

如未指定 `--rules`，默认尝试查找以下路径：
1. `./.auditrules.yaml`
2. `./.audit/.auditrules.yaml`
3. 都不存在则仅使用内置规则

引用 `references/severity-classification.md` 确定等级：

| 等级 | 判定标准 | 响应时限 |
|------|---------|---------|
| 🔴 高危 | 直接影响安全性或核心功能，可能导致数据泄露、服务不可用、权限绕过 | 24小时内 |
| 🟠 中危 | 显著影响代码质量或可用性，可能导致性能退化、维护困难、部分功能异常 | 1周内 |
| 🟡 低危 | 轻微违反最佳实践或编码规范，不影响功能正确性 | 1月内 |
| 🔵 信息 | 观察性发现，无直接风险，供参考或未来改进 | 酌情 |

---

## 报告格式

审计报告必须使用 `templates/audit-report-template.md` 结构。输出为格式化的 Markdown，确保：

1. 所有发现项引用精确的文件路径和行号
2. 严重等级使用红色/橙色/黄色/蓝色标点标识
3. 每个高危/中危发现项必须包含：
   - 风险描述（具体输入或场景如何触发）
   - 影响评估
   - 修复建议
   - 验证方法
4. 优先行动项按严重等级排序，不可超过 5 项

---

## 最佳实践

- **定期审计**：建议每月做一次 standard 深度全量审计，每周做一次 quick 扫描
- **重构前审计**：大版本升级或大规模重构前，必须做一次 deep 深度审计
- **增量审计**：在 code-review 发现问题后，用本技能做一次全量摸排以确认影响范围
- **关注趋势**：跟踪每次审计的发现项数量和等级分布，评估代码库健康趋势
- **低危也值得修**：低危项累积会显著降低代码可维护性，建议在常规开发中逐步清理

### 增量审计最佳实践

- **配合 code-review**：`code-review` 发现问题后，立即用 `--incremental --since HEAD~1` 确认本次变更是否引入相关问题
- **每日审计**：设置每日定时任务运行 `--incremental`，尽早发现新增问题
- **版本发布前**：运行一次全量审计 + 对比增量趋势，确保版本健康度达标

### CI 集成最佳实践

- **阻塞合入**：在 CI pipeline 中运行 `--depth quick --output-format json --output audit.json`，当 `critical > 0` 时阻断合入
- **可视化**：将 JSON 输出的 health_score 上报到监控仪表盘（如 Grafana），追踪趋势
- **Slack 通知**：CI 脚本解析 JSON，当 `findings_delta > 0`（发现数增加）时自动通知团队

### 趋势分析最佳实践

- **门槛基线**：设置健康分阈值（如低于 60 分进入警戒），触发自动通知
- **回归捕捉**：如果某轮健康分突然下降超过 10 分，自动触发一次深度审计
- **季度回顾**：每季度查看趋势报告，评估工程改进措施的有效性

## 与相关技能的关系

| 技能 | 本技能 vs 它 |
|------|-------------|
| `code-review` | code-review 审查当前 diff，本技能做全量代码库审计 |
| `security-review` | security-review 关注变更的安全影响，本技能做完整安全态势评估 + 其他五个维度 |
| `review` | review 针对 GitHub PR 输出评论，本技能输出独立审计报告 |
| `verify` | verify 验证变更效果，本技能专注发现和分析，不验证修复 |
