---
description: Automated Code Compliance Audit for IELC-APPS
---

# [WORKFLOW] Code Compliance Review

This workflow performs a strict architectural audit against the [GEMINI.md](file:///c:/PROJECT/WEBSITE/IELC-APPS/GEMINI.md) project standards.

## 🧐 AUDIT CHECKLIST

### 1. Laravel Controller Thinness (Backend)
- [ ] Is the Controller handling ONLY HTTP requests?
- [ ] Are all data mutations (Create/Update/Delete) extracted to `app/Actions/`?
- [ ] Are simple data reads (count, where) handled correctly?

### 2. React Hook Separation (Frontend)
- [ ] Is complex UI logic extracted into a `Hooks/` folder?
- [ ] Are the JSX files focused only on presentation and rendering?
- [ ] Are modals extracted to a specific `Modals/` folder?

### 3. UI/UX & Tailwind Standards
- [ ] Is the typography following `text-sm` (body) / `text-xs` (labels)?
- [ ] Are layouts using `bg-gray-50` and `white cards` with subtle shadows?
- [ ] Is the `primary` color used for interactive elements?

### 4. Database & Safety
- [ ] Are all models wrapped in `Resources/`?
- [ ] Are queries properly scoped for multi-branch isolation?
- [ ] Are mass assignments restricted to `$fillable`?

## 🚀 EXECUTION
1. View the file to be audited.
2. Cross-reference with the [DATABASE_SCHEMA] and [ARCHITECTURE_RULES].
3. Provide a report with `render_diffs()` for required fixes.
