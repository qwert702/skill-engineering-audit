# 更新说明

## 2.1.0 — 2026-07-03

### 🔧 修复 test-fixture 全量发现项（25 项全部修复）

#### 🔴 高危安全漏洞修复 (4)

| # | 漏洞 | 文件 | 修复方式 |
|---|------|------|---------|
| AUDIT-001 | SQL 注入 | `test-fixture/src/users.ts:13` | 改用参数化查询 `?` 占位符 |
| AUDIT-002 | JWT Secret 硬编码 | `test-fixture/src/config.ts:4` | 移入 `getJwtSecret()` 从环境变量读取 |
| AUDIT-003 | 数据库密码硬编码 | `test-fixture/src/config.ts:10` | 移入 `getDbConfig()` 从环境变量读取 |
| AUDIT-004 | URL 参数注入 | `orders.ts:37`、`helpers.ts:5` 等 4 处 | 使用 `URLSearchParams` 安全构造 |

#### 🟠 中危修复 (6)

| # | 问题 | 修复方式 |
|---|------|---------|
| AUDIT-005 | N+1 查询 | 改为批量 `IN` 查询 |
| AUDIT-006 | 圈复杂度 22 | 拆分为 4 个职责单一的函数（各 < 5） |
| AUDIT-007 | 重复 API 调用 | 抽取通用 `fetchFromApi<T>()` 函数 |
| AUDIT-008 | 潜在循环依赖 | `orders.ts` 从 `../config` 改为 `./config` |
| AUDIT-009 | JWT 过期 7 天 | Access Token 改为 15 分钟，新增 Refresh Token 机制 |
| AUDIT-010 | 未使用 lodash 依赖 | 从 `package.json` 移除 |

#### 🟡 低危修复 (12)

| # | 问题 | 修复方式 |
|---|------|---------|
| AUDIT-011 | 未使用 `http` 导入 | 移除 |
| AUDIT-012 | 未使用 `fs` 导入 | 移除 |
| AUDIT-013 | 未使用导出 `UNUSED_CONSTANT` | 移除 |
| AUDIT-014 | 魔术数字 `86400` | 抽取为 `REQUEST_TIMEOUT_MS` 常量 |
| AUDIT-015 | 魔术数字 `0.1` `0.05` `0.02` | 抽取为 `DISCOUNT_RATES` 常量 |
| AUDIT-016 | 函数名 `foo` 无意义 | 改为 `identity<T>()` 描述性名称 |
| AUDIT-017 | `processData` 缺少类型标注 | 添加泛型和数组类型 |
| AUDIT-018 | 空 catch (utils.ts:73) | 记录错误日志 |
| AUDIT-019 | 空 catch (config.ts:24) | 记录错误并重新抛出 |
| AUDIT-020 | HACK/FIXME 遗留标记 | 替换为可扩展汇率映射表 |
| AUDIT-021 | TODO 无 Issue 跟踪 | 实现全局错误处理中间件 |
| AUDIT-022 | JSON.parse + JSON.stringify | 替换为 `structuredClone` |

#### 🔵 信息优化 (3)

| # | 问题 | 优化方式 |
|---|------|---------|
| AUDIT-023 | `calculateRefund` 重复折扣逻辑 | 独立函数化 |
| AUDIT-024 | 硬编码汇率 | 改为可扩展映射表 + 明确错误提示 |
| AUDIT-025 | mysql2 间接依赖 | 保留但添加注释说明使用场景 |

### 🛡️ 基础设施改进

- **CI**: 新增 `security-audit` 和 `shellcheck` job，集成 `npm audit` 定时扫描
- **安装脚本**: `install.sh` 和 `install.ps1` 增加提交哈希校验模式（`--verify <SHA>`）
- **审计历史**: 创建 `.audit-history.yaml` 初始示例，展示完整记录格式
- **package.json**: 移除未使用的 `lodash` 和 `@types/lodash`，新增 `lint`/`check`/`audit-deps` 脚本

---

## 2.2.0 — 2026-07-04

### 🎯 项目全面分析与修复

#### 📋 版本与文档一致性修复
- 修复 README 和 README.en 版本徽章 v2.0.0 → v2.1.0
- 更新 README 目录结构，补充缺失的 install 脚本、test-fixture、examples 等
- 修复 SKILL.md JSON schema 示例版本号 v2.0.0 → v2.1.0
- 同步 test-fixture/package.json 版本号到 v2.1.0

#### 🏷️ 严重等级命名对齐行业标准
- 重新映射等级：严重(Critical)、高危(High)、中危(Medium)、低危(Low)、信息(Info)
- 更新 `references/severity-classification.md` 章节标题
- 全量更新模板变量、JSON schema、健康分公式中的等级名称
- 健康分公式新增低危扣分（-1/个）和信息扣分说明
- 补充增量模式健康分修正公式定义

#### 🔧 工作流健壮性增强
- 细化增量审计错误处理：非 git 仓库、无效 --since、YAML 解析失败、reflog 超出等边界
- JSON 行号字段改为 `line_start`/`line_end` 支持多行范围
- JSON schema 补充 `by_severity_delta` 细粒度对比字段
- 统一模板中的行号字段名为 `line_start`

#### 🛡️ CI/CD 加固
- 新增 TypeScript 编译检查（`tsc --noEmit`）
- 修复 npm audit 策略：移除 `continue-on-error`，高危漏洞阻断 pipeline
- 添加 Markdown 链接检查（mlc_config.json）
- 新增独立 JSON Schema 验证文件 `templates/audit-report-schema.json`

#### 📦 安装脚本改进
- 修正 install.sh 中"GPG 校验"为"提交哈希校验"（更准确）
- 新增 `uninstall.sh` 和 `uninstall.ps1` 卸载脚本

---

## 2.0.0 — 2025-07-03

### 🚀 新增特性

#### 增量审计 (`--incremental` / `--since`)
- 新增 `--incremental` 参数，只审计 git 历史中有变更的文件
- 支持三种增量起点：自上次审计、自指定日期（`--since 2025-06-01`）、自近 N 次提交（`--since HEAD~5`）
- 自动识别 git 仓库；无历史记录时回退至全量模式
- 增量结果在报告中标注，便于与全量审计区分

#### CI 集成 (`--output-format json`)
- 新增 `--output-format json` 参数，输出标准 JSON 结构
- JSON 结构：`meta → scope → summary → findings → history`
- 含 `health_score` 健康度评分和 `change.delta` 历史对比
- 可直接被 CI pipeline 解析，用于阻断合入或上报监控

#### 自定义检查规则 (`--rules`)
- 新增 `--rules` 参数，支持用户定义 `.auditrules.yaml` 规则文件
- 三种规则类型：**模式匹配**（正则搜索）、**度量阈值**（函数长度/圈复杂度）、**上下文感知**（排除特定上下文）
- 规则文件含完整字段：id、title、severity、dimension、match、remediation、verification
- 默认查找路径：`./.auditrules.yaml` → `./.audit/.auditrules.yaml`

#### 审计历史与趋势 (`--history` / `--trend`)
- 每次审计自动记录到 `.audit-history.yaml`
- `--history`：列出所有历史审计记录
- `--history --trend`：生成趋势分析报告
- 趋势报告包含：发现数量趋势图、严重等级分布变化、修复率统计、健康度评分曲线
- 健康度公式：`100 - (高危×10 + 中危×5 + 低危×2)`

### 📝 文档
- README 新增"四大高级特性"章节，中英文同步
- SKILL.md 工作流全新改写，增量/规则/历史/JSON 融入各阶段
- SKILL.md 新增"历史与趋势分析"独立章节
- SKILL.md 新增 JSON 输出格式规范文档
- SKILL.md 新增 `.auditrules.yaml` 完整格式说明
- SKILL.md 新增增量审计、CI 集成、趋势分析最佳实践

### ⚙️ 内部变更
- 新增参数解析：`--output-format`、`--incremental`、`--since`、`--rules`、`--history`、`--trend`
- 版本号从 `1.0.0` 升至 `2.0.0`
- 所有工作流阶段集成新特性的处理逻辑

---

## 1.0.0 — 2025-07-03

### 初始版本

#### 核心功能

- 六维审计：**代码质量**、**安全**、**架构**、**性能**、**依赖**、**合规**
- 完整的六阶段工作流：范围定义 → 数据收集 → 并发分析 → 发现分类 → 报告生成 → 修复跟踪

#### 审计能力

| 维度 | 覆盖范围 |
|------|---------|
| 🔍 代码质量 | 死代码、重复代码、圈复杂度、命名约定、注释质量、类型安全、错误处理、资源泄漏 |
| 🔒 安全 | OWASP Top 10 (2021) 全量覆盖：注入、认证、敏感数据、XXE、越权、安全配置、XSS/CSRF、依赖漏洞 |
| 🏗 架构 | 分层违规、循环依赖、接口设计、单一职责、抽象程度、API 一致性 |
| ⚡ 性能 | N+1 查询、内存泄漏、不必要分配、低效算法、缓存机会 |
| 📦 依赖 | 过时版本、已知漏洞、废弃包、未使用依赖 |
| 📋 合规 | 许可合规、编码标准、日志安全、数据隐私、API 版本化 |

#### 使用方式

- 支持参数：`--path`、`--focus`、`--depth`、`--output`
- 三种深度模式：`quick` / `standard` / `deep`
- `--depth deep` 模式下子代理并发分析

#### 参考文件

- `references/audit-dimensions.md` — 六维审计总纲，每个维度 10+ 个检查子项
- `references/code-quality-checklist.md` — 代码质量详细检查清单
- `references/severity-classification.md` — 四等级分类（高危/中危/低危/信息）+ 特殊情况处理规则

#### 模板

- `templates/audit-report-template.md` — 完整的审计报告模板，含执行摘要、发现项清单、详细分析
- `templates/fix-tracking-template.md` — 修复跟踪模板，含状态流转和趋势统计
