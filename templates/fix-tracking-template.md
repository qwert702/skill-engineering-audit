# 修复跟踪模板

用于记录和管理审计发现项的修复进度。每次审计开始时，如果没有现成的跟踪记录，创建一个新的。

---

## 修复跟踪总表

**审计 ID**: AUDIT-{session_id}
**审计日期**: {audit_date}
**最新更新**: {last_updated}

### 汇总

| 状态 | 数量 |
|------|------|
| ✅ 已修复 | {fixed_count} |
| 🔄 修复中 | {in_progress_count} |
| ⏳ 待修复 | {pending_count} |
| ❌ 无需修复 / 已关闭 | {closed_count} |
| **合计** | **{total_count}** |

---

## 发现项跟踪明细

### AUDIT-{id}: {title}

| 字段 | 值 |
|------|-----|
| **严重等级** | {severity} |
| **位置** | `{file_path}`:L{line_start}{if line_end}-{line_end}{end} |
| **发现日期** | {discovered_date} |
| **预期修复截止** | {deadline} |

#### 状态

当前状态: **{status_icon} {status}**

| 时间 | 操作 | 备注 |
|------|------|------|
| {date_1} | 发现 | 初始审计发现 |
| {date_2} | 指定修复人 | {assignee} |
| {date_3} | 开始修复 | {note} |
| {date_4} | 提交修复 | PR #{pr_number} |
| {date_5} | 验证修复 | {verification_result} |
| {date_6} | 关闭 | {closure_note} |

#### 修复方案

```diff
// 修复前的代码
- {before_code}

// 修复后的代码
+ {after_code}
```

#### 验证结果

- **验证日期**: {verification_date}
- **验证方法**: {verification_method}
- **结果**: {verification_result}
- **备注**: {verification_notes}

---

## 汇总报告

### 严重等级分布（按状态）

| 等级 | 已修复 | 修复中 | 待修复 | 已关闭 | 合计 |
|------|--------|--------|--------|--------|------|
| 🔴 严重 | {c_fixed} | {c_ip} | {c_pending} | {c_closed} | {c_total} |
| 🟠 高危 | {h_fixed} | {h_ip} | {h_pending} | {h_closed} | {h_total} |
| 🟡 中危 | {m_fixed} | {m_ip} | {m_pending} | {m_closed} | {m_total} |
| 🔵 低危 | {l_fixed} | {l_ip} | {l_pending} | {l_closed} | {l_total} |
| ⚪ 信息 | {i_fixed} | {i_ip} | {i_pending} | {i_closed} | {i_total} |

### 待办事项（按截止日期排序）

| 优先级 | 编号 | 等级 | 描述 | 截止日期 |
|--------|------|------|------|---------|
| P0 | AUDIT-{id} | 🔴 | {brief_desc} | {deadline} |
| P1 | AUDIT-{id} | 🟠 | {brief_desc} | {deadline} |

### 修复趋势

| 审计轮次 | 日期 | 发现数 | 已修复 | 修复率 |
|----------|------|--------|--------|--------|
| 第 1 次 | {date} | {found} | {fixed} | {rate}% |
| 第 2 次 | {date} | {found} | {fixed} | {rate}% |

---

## 操作指南

### 跟踪记录更新规范

| 操作 | 更新内容 |
|------|---------|
| 指定修复人 | 记录 assignee 和预期完成日期 |
| 开始修复 | 记录开始日期和负责人 |
| 提交 PR | 记录 PR 编号和链接 |
| 验证修复 | 记录验证方法、日期和结果 |
| 关闭 | 记录关闭原因（已修复/无需修复/无法复现） |
| 重审发现 | 记录新的审计结果和状态变更 |

### 状态流转

```
发现 → 待修复 → 修复中 → 已修复（待验证）→ 已验证（已关闭）
                     ↓
                 无需修复 → 已关闭
                     ↓
                 无法复现 → 已关闭
                     ↓
                 重复发现 → 已关闭（关联到主发现项 AUDIT-{id}）
```
