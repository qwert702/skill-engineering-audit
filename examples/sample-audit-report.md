# 工程与安全审计报告

**目标路径**: `./test-fixture`
**审计日期**: 2025-07-03
**审计类型**: 全量（六维）
**审计深度**: standard
**审计耗时**: 47 秒

---

## 一、执行摘要

### 发现项总览

| 严重等级 | 数量 | 占比 |
|----------|------|------|
| 🔴 高危 | 2 | 13% |
| 🟠 中危 | 5 | 33% |
| 🟡 低危 | 6 | 40% |
| 🔵 信息 | 2 | 13% |
| **合计** | **15** | **100%** |

### 按维度分布

| 维度 | 高危 | 中危 | 低危 | 信息 | 合计 |
|------|------|------|------|------|------|
| 代码质量 | 0 | 2 | 4 | 1 | 7 |
| 安全 | 2 | 1 | 0 | 0 | 3 |
| 架构 | 0 | 1 | 1 | 0 | 2 |
| 性能 | 0 | 1 | 0 | 1 | 2 |
| 依赖 | 0 | 0 | 1 | 0 | 1 |
| 合规 | 0 | 0 | 0 | 0 | 0 |

### 总体评估

代码库整体健康度**偏低**（健康分：**52**），主要风险集中在安全领域（SQL 注入、硬编码密钥）和代码质量（大量重复代码、高复杂度函数）。建议优先处理高危项，然后系统性地降低中危项。

### 优先行动项

1. **🔴 SQL 注入风险** — `src/users.ts:45` 用户输入直接拼接 SQL 字符串
2. **🔴 硬编码密钥** — `src/config.ts:12` JWT Secret 硬编码在源码中
3. **🟠 N+1 查询** — `src/orders.ts:78` 循环内查询数据库

---

## 二、发现项清单

| # | 等级 | 维度 | 文件:行号 | 描述 | 建议 |
|---|------|------|-----------|------|------|
| 1 | 🔴 高危 | 安全 | `src/users.ts`:L45 | SQL 查询使用字符串拼接，可导致注入攻击 | 改用参数化查询 |
| 2 | 🔴 高危 | 安全 | `src/config.ts`:L12 | JWT Secret 硬编码在代码中 | 移至环境变量 |
| 3 | 🟠 中危 | 性能 | `src/orders.ts`:L78 | 循环内逐个查询数据库（N+1 模式） | 改用批量查询 |
| 4 | 🟠 中危 | 质量 | `src/utils.ts`:L20-60 | 圈复杂度 22，远超阈值 | 拆分为多个小函数 |
| 5 | 🟠 中危 | 质量 | `src/utils.ts`:L25-55 | 大段逻辑与 `src/helpers.ts`:L10-40 重复 | 抽取公共函数 |
| 6 | 🟠 中危 | 架构 | `src/api/users.ts`:L5 | Controller 层直接操作数据库 | 通过 Service 层访问 |
| 7 | 🟠 中危 | 安全 | `src/api/users.ts`:L22 | 缺少鉴权中间件 | 添加 authMiddleware |
| 8 | 🟡 低危 | 质量 | `src/app.ts`:L1 | 未使用的 import `fs` | 移除 |
| 9 | 🟡 低危 | 质量 | `src/utils.ts`:L89 | 空 catch 块 | 处理或重新抛出 |
| 10 | 🟡 低危 | 质量 | `src/orders.ts`:L15 | 魔术数字 `86400` 未命名 | 抽取为常量 |
| 11 | 🟡 低危 | 质量 | `src/helpers.ts`:L5 | 函数 `foo` 含义不明 | 改为描述性命名 |
| 12 | 🟡 低危 | 架构 | `src/services/order.ts`:L1 | 导入 `api/` 模块，造成循环依赖风险 | 抽取公共接口 |
| 13 | 🟡 低危 | 依赖 | `package.json` | 依赖 `lodash` 但未在代码中使用 | 移除 |
| 14 | 🔵 信息 | 性能 | `src/process.ts` | `JSON.parse` 在热路径中重复调用 | 考虑缓存结果 |
| 15 | 🔵 信息 | 质量 | `src/app.ts` | 存在 TODO 注释 `// TODO: add error handling` | 创建 Issue 跟踪 |

---

## 三、详细分析

### 发现项 #1: SQL 查询使用字符串拼接

| 字段 | 值 |
|------|-----|
| **严重等级** | 🔴 高危 |
| **类别** | 安全 - SQL 注入 |
| **位置** | `src/users.ts`:L45 |
| **参考编号** | AUDIT-001 |

#### 风险描述

`login()` 函数中用户输入的 `username` 和 `password` 未经转义直接拼接到 SQL 查询字符串中。攻击者可构造恶意输入（如 `' OR 1=1 --`）绕过认证或窃取数据。

```typescript
// ❌ 当前代码
const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
```

#### 复现路径

1. 输入用户名: `admin' --`
2. 输入任意密码
3. SQL 变为: `SELECT * FROM users WHERE username='admin' --' AND password='...'`
4. 返回 admin 用户数据，认证被绕过

#### 影响评估

- **影响范围**: 全部用户账户
- **触发条件**: 登录接口对外暴露
- **潜在损失**: 用户数据泄露、账户被盗用

#### 修复建议

```typescript
// ✅ 修复方案：使用参数化查询
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.execute(query, [username, password]);
```

#### 验证方法

1. 尝试输入 `' OR 1=1 --` 进行登录
2. 确认不再返回未授权数据
3. 运行静态分析工具确认无其他拼接模式

---

### 发现项 #2: JWT Secret 硬编码

| 字段 | 值 |
|------|-----|
| **严重等级** | 🔴 高危 |
| **类别** | 安全 - 敏感数据泄露 |
| **位置** | `src/config.ts`:L12 |
| **参考编号** | AUDIT-002 |

#### 风险描述

JWT 签名密钥 `my-secret-key-12345` 直接写在源码中。任何能访问代码库的人（包括内部员工、第三方供应商）都可以签发任意用户的 Token。

#### 影响评估

- **影响范围**: 整个认证体系
- **触发条件**: 密钥泄露
- **潜在损失**: 任意用户身份冒充、权限提升

#### 修复建议

```typescript
// ✅ 修复方案：从环境变量读取
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置');
}
```

#### 验证方法

1. 检查代码中不再包含密钥字符串
2. 确认环境变量已正确配置
3. 验证使用新密钥签发的 Token 仍可正常工作

---

### 发现项 #3: N+1 查询

| 字段 | 值 |
|------|-----|
| **严重等级** | 🟠 中危 |
| **类别** | 性能 - N+1 查询 |
| **位置** | `src/orders.ts`:L78 |
| **参考编号** | AUDIT-003 |

#### 风险描述

获取用户列表后，在 for 循环中逐个查询每个用户的订单，产生 N+1 次数据库查询（1 次查用户 + N 次查订单），随着用户数增长会导致严重性能问题。

```typescript
// ❌ 当前代码
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  const orders = await db.query(`SELECT * FROM orders WHERE user_id = ${user.id}`);
}
```

#### 影响评估

- **影响范围**: 100 个用户 → 101 次查询
- **触发条件**: 任何调用此函数的位置
- **潜在损失**: 页面加载缓慢、数据库连接池耗尽

#### 修复建议

```typescript
// ✅ 修复方案：使用 JOIN 或 IN 查询一次获取
const users = await db.query('SELECT * FROM users');
const userIds = users.map(u => u.id);
const orders = await db.query('SELECT * FROM orders WHERE user_id IN (?)', [userIds]);
```

#### 验证方法

1. 使用数据库查询日志或 ORM 的调试模式
2. 确认优化后只有 2 次数据库查询
3. 在 1000+ 用户规模下测试响应时间

---

### 发现项 #4: 圈复杂度 22

| 字段 | 值 |
|------|-----|
| **严重等级** | 🟠 中危 |
| **类别** | 代码质量 - 圈复杂度 |
| **位置** | `src/utils.ts`:L20-60 |
| **参考编号** | AUDIT-004 |

#### 风险描述

`processOrder` 函数包含 7 个 if-else 分支、2 个 switch-case 和 2 层嵌套循环，圈复杂度高达 22（阈值 10），极难测试和维护。

#### 影响评估

- **影响范围**: 单个函数，但被多处调用
- **潜在损失**: 修改时容易引入回归 Bug、测试覆盖率难以达标

#### 修复建议

按职责拆分为 3-4 个小函数：
1. `validateOrder(order)` — 校验逻辑
2. `calculateTotal(items)` — 计算逻辑
3. `updateInventory(items)` — 库存更新
4. `sendNotification(user, order)` — 通知逻辑

---

## 四、审计范围说明

### 覆盖范围

- `src/` 目录下全部 12 个 TypeScript 文件
- 项目配置文件（package.json、tsconfig.json）
- 共计 2,847 行代码

### 未覆盖范围

- `node_modules/`（第三方依赖）
- `test/` 目录（测试代码单独审计）
- `docs/` 目录（文档）

### 局限性

- 本次审计基于静态分析，未执行代码
- 部分性能问题（如真实内存泄漏）需要 profiling 工具辅助确认
- 依赖漏洞需要运行 `npm audit` 等工具获取最新 CVE 数据

---

## 五、修复优先级建议

| 优先级 | 编号 | 理由 | 建议完成时间 |
|--------|------|------|-------------|
| P0 | AUDIT-001 | SQL 注入可直接导致数据泄露 | 24小时内 |
| P0 | AUDIT-002 | 密钥泄露可导致认证体系被攻破 | 24小时内 |
| P1 | AUDIT-003 | N+1 查询在高负载下会引发生产事故 | 1周内 |
| P1 | AUDIT-004 | 高复杂度函数是 Bug 的主要来源 | 1周内 |
| P1 | AUDIT-005 | 代码重复增加维护成本 | 1周内 |
| P2 | AUDIT-008 | 未使用的 import 不影响功能 | 1月内 |
| P2 | AUDIT-009 | 空 catch 可能隐藏错误 | 1月内 |

---

*本报告由 Claude Code Engineering Audit Skill (v2.0.0) 自动生成*
*健康度评分: 52/100 — 需要关注*
*下次建议审计日期: 2025-08-03*
