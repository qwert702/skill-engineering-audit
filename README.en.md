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

# Engineering & Code Audit

An all-in-one engineering audit **Skill for Claude Code**, covering six dimensions: **Code Quality, Security, Architecture, Performance, Dependencies, and Compliance**.

> Once installed to `~/.claude/skills/engineering-audit/`, it can be triggered via `/engineering-audit` or natural language in any Claude Code session.

---

## Why This Skill?

This isn't just another code review tool — it's fundamentally different from every audit tool you've seen.

### 🔥 Key Differentiators

| # | Advantage | Details |
|---|-----------|---------|
| **1** | **Six dimensions, one command** | One command runs audits across Quality, Security, Architecture, Performance, Dependencies, and Compliance — all in a unified format. **No more juggling SonarQube, Snyk, ESLint, and OWASP ZAP** |
| **2** | **Whole-codebase health check, not just diffs** | Claude Code's built-in `code-review` only looks at the current git diff. Your skill scans **the entire codebase** — the right tool for legacy system handover, pre-major-upgrade assessment, and regular health checks |
| **3** | **Security audit beyond changed files** | `security-review` only checks the security impact of changes you're making right now. But most security issues are cumulative. Your skill performs a **full OWASP Top 10 sweep**, uncovering historical debt others miss |
| **4** | **Fix tracking closes the loop** | Finding issues is easy; ensuring they're fixed is hard. Built-in fix tracking templates for **end-to-end lifecycle from discovery to closure**, with trend analysis across audit rounds. **Unique in the Claude Code ecosystem** |
| **5** | **Composable dimensions, adjustable depth** | `--focus` selects audit dimensions, `--depth` controls depth. Quick scan in 30 seconds, deep audit for full assessment, focused audit for specific concerns — **one skill for every scenario** |
| **6** | **Concurrent deep analysis** | At `--depth deep`, each dimension runs as an independent Claude sub-agent in parallel. Dimensions are logically independent with zero overlap, delivering **far greater concurrency gains than traditional single-threaded audits** |

> **In one sentence: `code-review` is "CI for every commit"; this skill is "your monthly full physical" — broader scope, higher perspective, more systematic output.**

---

## Overview

This skill performs **systematic multi-dimensional audits** on a target codebase. It fills the gap between Claude Code's built-in `code-review` (diff-only) and `security-review` (security-impact-only) by providing a **comprehensive, whole-codebase audit**.

### Six Audit Dimensions

| Dimension | Coverage |
|-----------|---------|
| 🔍 **Code Quality** | Dead code, duplication, cyclomatic complexity, naming conventions, comment quality, type safety, error handling, resource leaks |
| 🔒 **Security** | Full OWASP Top 10 (2021): Injection, Auth, Sensitive Data, XXE, Broken Access Control, Misconfiguration, XSS/CSRF, Dependency Vulnerabilities |
| 🏗 **Architecture** | Layering violations, circular dependencies, interface design, single responsibility, abstraction level, API consistency |
| ⚡ **Performance** | N+1 queries, memory leaks, unnecessary allocations, inefficient algorithms, caching opportunities |
| 📦 **Dependencies** | Outdated versions, known vulnerabilities, deprecated packages, unused dependencies |
| 📋 **Compliance** | License compliance, coding standards, log safety, data privacy, API versioning |

## 🚀 Advanced Features

### 1. Incremental Audit (`--incremental`)

Audit only files that have changed since a known point, not the entire codebase.

```bash
# Since the last audit
/engineering-audit --incremental

# Since a specific date
/engineering-audit --incremental --since 2025-06-01

# Since the last N commits
/engineering-audit --incremental --since HEAD~5
```

**Use cases**: Daily health checks, CI pipeline gating, quick follow-up after `code-review`.

### 2. CI Integration (`--output-format json`)

Outputs standard JSON that any CI tool can parse.

```bash
/engineering-audit --depth quick --output-format json --output ./audit.json
```

**Typical CI flow**: Block the pipeline when `critical > 0`; report `health_score` to a Grafana dashboard; auto-notify the team when finding count increases.

### 3. Custom Audit Rules (`--rules`)

Define project-specific audit rules via `.auditrules.yaml`.

```bash
/engineering-audit --rules .auditrules.yaml
```

**Rule types**:
- **Pattern matching**: Regex search for forbidden patterns (e.g. `console.log`, hardcoded secrets)
- **Metric thresholds**: Check function length, cyclomatic complexity against limits
- **Context-aware**: Exclude matches in specific contexts (e.g. routes already protected by auth middleware)

### 4. Audit History & Trends (`--history --trend`)

Every audit result is automatically recorded for trend comparison.

```bash
# List all historical records
/engineering-audit --history

# Generate trend analysis report
/engineering-audit --history --trend
```

**Outputs**: Finding count trend chart, severity distribution changes, fix rate stats, health score curve.
**Built-in health formula**: `100 - (critical×10 + high×5 + medium×2 + low×1)` — instant codebase health at a glance.

---

## Quick Start

### Installation

**One-line install:**

```bash
# Linux / macOS
curl -sfL https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.sh | sh

# Windows (PowerShell)
irm https://raw.githubusercontent.com/qwert702/skill-engineering-audit/main/install.ps1 | iex
```

**Manual install:**

```bash
# Clone the repository
git clone git@github.com:qwert702/skill-engineering-audit.git ~/.claude/skills/engineering-audit
```

### Basic Usage

```bash
# Full audit at standard depth (all 6 dimensions)
/engineering-audit

# Focused audit: security only
/engineering-audit --focus security

# Multi-dimension combination
/engineering-audit --focus quality,architecture

# Deep audit (parallel sub-agent analysis)
/engineering-audit --depth deep

# Scope to specific path
/engineering-audit --path src/api/

# Output to file
/engineering-audit --output ./audit-report.md
```

### See It in Action

Curious what the audit report looks like? Check out the **[sample audit report](./examples/sample-audit-report.md)**.

Want to test it yourself? The bundled **[test-fixture](./test-fixture/)** directory contains intentionally flawed code with 15 issues (SQL injection, hardcoded secrets, N+1 queries, etc.). Run an audit to verify:

```bash
# Run from the test-fixture directory
/engineering-audit --depth standard
```

### Parameters

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--path` | Any path | `.` (current dir) | Target path to audit |
| `--focus` | `quality` / `security` / `architecture` / `performance` / `dependencies` / `compliance` / `all` | `all` | Audit focus dimension(s), comma-separated |
| `--depth` | `quick` / `standard` / `deep` | `standard` | Audit depth |
| `--output` | File path | Terminal output | Output audit report to file |
| `--output-format` | `markdown` / `json` | `markdown` | Report output format |
| `--incremental` | Flag | Off | Incremental mode: only audit files changed in git history |
| `--since` | Git ref / date | — | Used with `--incremental` to specify the starting point |
| `--rules` | File path | — | Custom audit rules file path |
| `--history` | Flag | Off | View audit history records |
| `--trend` | Flag | Off | Used with `--history` to generate trend analysis |

---

## Workflow

```
Phase 1: Scope Definition
  Parse arguments → Determine path / focus / depth
  → Output: Audit plan

Phase 2: Data Collection
  Glob file scan → Identify project type → Read configs & dependencies
  → Output: File list + project metadata

Phase 3: Concurrent Analysis
  Parallel analysis per selected dimension
  → Output: Dimension-specific findings

Phase 4: Aggregation & Classification
  Merge → Deduplicate → Classify by severity
  → Output: Structured findings collection

Phase 5: Report Generation
  Fill template → Generate Markdown report
  → Output: Complete audit report
```

> In `--depth deep` mode, Phase 3 launches independent Claude sub-agents for each dimension, running them concurrently for large codebases.

---

## Severity Classification

| Level | Criteria | Response Time |
|-------|----------|---------------|
| 🔴 **Critical** | Direct security exploit or core functionality failure — data breach, RCE, privilege escalation | Within 24h |
| 🟠 **High** | Significant quality or availability impact — performance degradation, high maintenance burden | Within 1 week |
| 🟡 **Medium** | Minor best-practice violation — doesn't affect correctness | Within 1 month |
| 🔵 **Low** | Observation only, no direct risk | As needed |
| ⚪ **Info** | Informational only, does not constitute a risk | No response needed |

---

## Report Output

The audit report is generated as structured Markdown containing:

1. **Executive Summary** — Finding overview, overall assessment, top 5 priority actions
2. **Finding List** — Table: ID, severity, dimension, file:line, description, recommendation
3. **Detailed Analysis** — Full analysis per finding (risk description, reproduction steps, impact assessment, fix suggestion, verification steps)
4. **Scope Notes** — Covered / not-covered areas, limitations
5. **Fix Priority** — P0/P1/P2 tiers with suggested deadlines

**Fix tracking** is also supported for ongoing follow-up:

```
Discovered → Pending → In Progress → PR → Verified → Closed
```

---

## Relationship to Built-in Skills

| Built-in Skill | Role | This Skill |
|---------------|------|------------|
| `code-review` | Bug-hunt on the current diff | **Whole-codebase** multi-dimensional audit |
| `security-review` | Security impact of changes | **Full security posture assessment** + 5 other dimensions |
| `review` | Comment on GitHub PRs | **Standalone audit report**, not PR context |
| `verify` | Verify one change works | **Focus on discovery & analysis**, not fix verification |

---

## Best Practices

- **Regular cadence**: Monthly full audit (standard depth) + weekly quick scan
- **Before refactoring**: Run a deep audit before major version upgrades or large-scale refactoring
- **Incremental audit**: After `code-review` finds issues, run this skill to assess full impact scope
- **Track trends**: Monitor finding counts and severity distribution across audits to gauge codebase health

---

## Directory Structure

```
└── engineering-audit/
    ├── SKILL.md                       # Main skill definition (v2.1.0)
    ├── CHANGELOG.md                   # Release notes
    ├── .audit-history.yaml            # Audit history records
    ├── references/
    │   ├── audit-dimensions.md        # Six-dimension audit reference
    │   ├── code-quality-checklist.md  # Code quality checklist
    │   └── severity-classification.md # Severity classification guide
    ├── templates/
    │   ├── audit-report-template.md   # Audit report template
    │   └── fix-tracking-template.md   # Fix tracking template
    ├── examples/
    │   └── sample-audit-report.md     # Sample audit report
    ├── test-fixture/                  # Test fixture with intentionally flawed code
    ├── install.sh                     # Linux/macOS install script
    └── install.ps1                    # Windows install script
```

---

## License

MIT
