# 更新说明

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
