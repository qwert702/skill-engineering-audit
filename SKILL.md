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
version: 1.0.0
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
```

### 参数说明

| 参数 | 可选值 | 默认 | 说明 |
|------|--------|------|------|
| `--path` | 任意路径 | `.`（当前目录） | 审计目标路径 |
| `--focus` | `quality`,`security`,`architecture`,`performance`,`dependencies`,`compliance`,`all` | `all` | 审计焦点，逗号分隔 |
| `--depth` | `quick`,`standard`,`deep` | `standard` | 审计深度 |
| `--output` | 文件路径 | 终端输出 | 审计报告输出路径 |

---

## 审计工作流

遵循以下六个阶段执行审计：

### Phase 1: 范围定义

1. 解析用户参数（`--path`、`--focus`、`--depth`）
2. 确认审计目标路径存在且可读
3. 输出：审计计划（scope + focus list + depth）

### Phase 2: 数据收集

1. 使用 Glob/Grep 收集目标路径下的文件清单
2. 识别项目类型（package.json、pyproject.toml、Cargo.toml、go.mod 等）
3. 读取项目配置文件和构建脚本
4. 收集依赖清单
5. 输出：待审计文件清单 + 项目元数据

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

> `--depth deep` 模式下，对每个维度启动独立子代理并行分析，最后汇总结果。

### Phase 4: 发现分类

1. 合并各维度的发现项
2. 去重：相同位置和描述的发现项只保留一条
3. 引用 `references/severity-classification.md` 按严重等级分类
4. 为每个发现项分配唯一 ID（格式：`AUDIT-{序号}`）
5. 输出：结构化发现项集合

### Phase 5: 报告生成

参考 `templates/audit-report-template.md` 生成最终报告

报告结构：
1. **执行摘要** — 总览、总体评估、优先行动项
2. **发现项清单** — 表格形式（编号、等级、类别、位置、描述、建议）
3. **详细分析** — 每个发现项的完整分析
4. **审计范围说明** — 本次审计覆盖/未覆盖的范围

### Phase 6: (可选) 修复跟踪

当用户要求跟踪修复进度时：
1. 引用 `templates/fix-tracking-template.md`
2. 记录各发现项的修复状态（待修复/已修复/无需修复）
3. 支持增量重审（只审计标记为已修复的项）

---

## 严重等级分类

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

## 与相关技能的关系

| 技能 | 本技能 vs 它 |
|------|-------------|
| `code-review` | code-review 审查当前 diff，本技能做全量代码库审计 |
| `security-review` | security-review 关注变更的安全影响，本技能做完整安全态势评估 + 其他五个维度 |
| `review` | review 针对 GitHub PR 输出评论，本技能输出独立审计报告 |
| `verify` | verify 验证变更效果，本技能专注发现和分析，不验证修复 |
