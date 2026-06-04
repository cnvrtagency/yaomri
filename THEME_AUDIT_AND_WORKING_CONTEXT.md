# THEME_AUDIT_AND_WORKING_CONTEXT

## 1. Status of this document

This file is now a historical first-pass context note, not the primary operating guide.

Future sessions should not start here.

Start with:

1. `THEME_WORKING_GUIDE.md`
2. `THEME_CODEBASE_INDEX.md`
3. relevant files in `theme-audit-data/`
4. the task-specific audit doc

## 2. What this file is still useful for

Use this file only for lightweight background context:

- original theme identity and audit direction
- older first-pass observations
- broad caution that this is a shared-snippet, shared-asset Kalles/T4S theme

Do not treat this file as the source of truth for:

- current template/section relationships
- current snippet reference counts
- current asset load paths
- current selector routing

Those now live in the raw evidence files under `theme-audit-data/`.

## 3. Current source-of-truth docs

### Read-first guide

- `THEME_WORKING_GUIDE.md`

### Raw evidence and routing

- `THEME_CODEBASE_INDEX.md`
- `theme-audit-data/template-section-map.txt`
- `theme-audit-data/section-render-map.txt`
- `theme-audit-data/snippet-reference-counts.txt`
- `theme-audit-data/asset-load-map.txt`
- `theme-audit-data/key-selector-hits.txt`
- `theme-audit-data/js-keyword-file-map.txt`

### Topic-specific operating docs

- `THEME_STRUCTURE_AUDIT.md`
- `THEME_FRONTEND_SYSTEM_AUDIT.md`
- `THEME_HEADING_SYSTEM_AUDIT.md`
- `THEME_SNIPPET_AUDIT.md`
- `THEME_CSS_DESIGN_AUDIT.md`
- `THEME_JS_DEPENDENCY_AUDIT.md`

## 4. Stable repo context that still matters

- Theme: Ya Omri Shopify theme
- Base conventions: Kalles / T4S
- Risk profile: shared snippets and shared assets can make small edits global
- Common ownership pattern: templates choose sections, sections render shared snippets, assets and runtime are loaded globally

## 5. Practical use rule

If a future session opens this file first, it should immediately redirect to:

1. `THEME_WORKING_GUIDE.md`
2. `THEME_CODEBASE_INDEX.md`
3. the relevant `theme-audit-data/` file

Only use this document for historical orientation after the current evidence has been checked.
