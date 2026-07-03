# Engineering & Code Audit

An all-in-one engineering audit **Skill for Claude Code**, covering six dimensions: **Code Quality, Security, Architecture, Performance, Dependencies, and Compliance**.

> Once installed to `~/.claude/skills/engineering-audit/`, it can be triggered via `/engineering-audit` or natural language in any Claude Code session.

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

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone git@github.com:qwert702/skill-engineering-audit.git ~/.claude/skills/engineering-audit
```

Or download the archive and extract it to `~/.claude/skills/engineering-audit/`.

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

### Parameters

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--path` | Any path | `.` (current dir) | Target path to audit |
| `--focus` | `quality` / `security` / `architecture` / `performance` / `dependencies` / `compliance` / `all` | `all` | Audit focus dimension(s), comma-separated |
| `--depth` | `quick` / `standard` / `deep` | `standard` | Audit depth |
| `--output` | File path | Terminal output | Output audit report to file |

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
| 🔴 **Critical** | Direct security impact or core functionality failure — data breach, service outage, privilege escalation | Within 24h |
| 🟠 **High** | Significant quality or availability impact — performance degradation, maintenance burden | Within 1 week |
| 🟡 **Medium** | Minor best-practice violation — doesn't affect correctness | Within 1 month |
| 🔵 **Info** | Observation only, no direct risk | As needed |

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
    ├── SKILL.md                       # Main skill definition
    ├── references/
    │   ├── audit-dimensions.md        # Six-dimension audit reference
    │   ├── code-quality-checklist.md  # Code quality checklist
    │   └── severity-classification.md # Severity classification guide
    └── templates/
        ├── audit-report-template.md   # Audit report template
        └── fix-tracking-template.md   # Fix tracking template
```

---

## License

MIT
