# 工程与安全审计报告

**目标路径**: `{target_path}`
**审计日期**: {audit_date}
**审计类型**: {audit_dimensions}
**审计深度**: {depth}
**审计耗时**: {duration}

---

## 一、执行摘要

### 发现项总览

| 严重等级 | 数量 | 占比 |
|----------|------|------|
| 🔴 高危 | {critical_count} | {critical_pct}% |
| 🟠 中危 | {high_count} | {high_pct}% |
| 🟡 低危 | {medium_count} | {medium_pct}% |
| 🔵 信息 | {info_count} | {info_pct}% |
| **合计** | **{total_count}** | **100%** |

### 按维度分布

| 维度 | 高危 | 中危 | 低危 | 信息 | 合计 |
|------|------|------|------|------|------|
| 代码质量 | - | - | - | - | - |
| 安全 | - | - | - | - | - |
| 架构 | - | - | - | - | - |
| 性能 | - | - | - | - | - |
| 依赖 | - | - | - | - | - |
| 合规 | - | - | - | - | - |

### 审计范围

{scope_description}

### 总体评估

{overall_assessment}

### 优先行动项

> 按严重等级排序，高危优先。标记为 🔴 的需要 24 小时内响应。

1. **{priority_1_title}** — {priority_1_brief} ({priority_1_location})
2. **{priority_2_title}** — {priority_2_brief} ({priority_2_location})
3. **{priority_3_title}** — {priority_3_brief} ({priority_3_location})

---

## 二、发现项清单

| # | 等级 | 维度 | 文件:行号 | 描述 | 建议 |
|---|------|------|-----------|------|------|
| {id_1} | 🔴 高危 | {dim_1} | `{file_1}`:L{line_1} | {desc_1} | {advice_1} |
| {id_2} | 🟠 中危 | {dim_2} | `{file_2}`:L{line_2} | {desc_2} | {advice_2} |
| {id_3} | 🟡 低危 | {dim_3} | `{file_3}`:L{line_3} | {desc_3} | {advice_3} |

---

## 三、详细分析

{foreach findings as finding}

### 发现项 #{finding.id}: {finding.title}

| 字段 | 值 |
|------|-----|
| **严重等级** | {finding.severity_icon} {finding.severity} |
| **类别** | {finding.dimension} - {finding.subcategory} |
| **位置** | `{finding.file_path}`:L{finding.line_number} |
| **参考编号** | AUDIT-{finding.id} |

#### 风险描述

{finding.detailed_description}

#### 复现路径

{finding.reproduction_steps}

#### 影响评估

- **影响范围**: {finding.impact_scope}
- **触发条件**: {finding.trigger_condition}
- **潜在损失**: {finding.potential_loss}

#### 修复建议

{finding.recommendation}

#### 验证方法

{finding.verification_steps}

#### 参考

- {finding.reference_links}

---

{end}

## 四、审计范围说明

### 覆盖范围

{covered_areas}

### 未覆盖范围

{not_covered_areas}

### 局限性

{limitations}

---

## 五、修复优先级建议

| 优先级 | 编号 | 理由 | 建议完成时间 |
|--------|------|------|-------------|
| P0 | AUDIT-{id} | {p0_reason} | {p0_deadline} |
| P1 | AUDIT-{id} | {p1_reason} | {p1_deadline} |
| P2 | AUDIT-{id} | {p2_reason} | {p2_deadline} |

---

*本报告由 Claude Code Engineering Audit Skill 自动生成*
*下次建议审计日期: {next_audit_date}*
