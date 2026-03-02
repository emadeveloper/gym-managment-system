---
name: build-project-best-practices
description: Build, audit, and improve software projects using practical engineering best practices. Use when Codex needs to structure or upgrade a project, add missing quality safeguards, tighten architecture, improve frontend/backend conventions, or implement features while preserving maintainability in React, Vite, Spring Boot, or similar fullstack codebases.
---

# Build Project Best Practices

## Overview

Audit the current project before changing code. Prioritize the highest-value improvements that reduce risk, clarify structure, and keep delivery incremental.

## Core Workflow

1. Inspect the project layout, package manifests, build scripts, and existing conventions before proposing changes.
2. Identify the minimum set of improvements that materially improve quality: architecture, validation, testing, environment handling, error handling, linting, and deployment readiness.
3. Prefer incremental edits over broad rewrites. Preserve existing patterns unless they are clearly harmful or inconsistent.
4. Implement the highest-value changes first, then verify with the narrowest reliable command: lint, build, unit tests, or integration tests.
5. Report what changed, what was verified, and what remains unverified.

## Decision Rules

- Match the repo's current stack and style before introducing new libraries.
- Keep dependencies minimal. Add a package only when it removes repeated complexity or closes a real gap.
- Strengthen interfaces first: typed DTOs, explicit validation, stable API boundaries, and predictable error handling.
- Prefer configuration that is explicit, environment-safe, and easy to run locally.
- Avoid "best practice" changes that create churn without improving correctness, observability, or maintainability.

## Frontend Guidance

- Keep React components small and single-purpose.
- Separate data fetching, presentation, and routing concerns.
- Centralize API access and error normalization instead of scattering raw HTTP calls.
- Use consistent loading, empty, and error states for async UI.
- Keep forms validated close to the boundary where user input enters the system.
- Verify production readiness with the frontend build, not only local dev mode.

## Backend Guidance

- Keep controllers thin and move business rules into application or domain services.
- Validate requests at the API boundary and map failures to consistent error responses.
- Isolate persistence details behind repository or adapter boundaries.
- Keep security, configuration, and environment secrets explicit and reviewable.
- Add tests for the business rule or contract touched by each non-trivial change.

## Verification

- Run the smallest relevant verification command after each meaningful change.
- Prefer existing scripts first. If none exist, use the native toolchain command for the touched service.
- Treat unverified areas as open risk and state them explicitly.

## Reference

Use [references/checklist.md](./references/checklist.md) as the implementation checklist when deciding what to improve first.
