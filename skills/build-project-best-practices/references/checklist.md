# Project Improvement Checklist

## Triage

- Confirm the runtime, package manager, and build commands for each app.
- Read the existing structure before introducing new folders or abstractions.
- Prefer one clear improvement path over a broad refactor.

## Architecture

- Separate transport, business logic, and persistence concerns.
- Remove duplicated logic before adding abstractions.
- Keep module boundaries obvious from the directory layout.

## Configuration

- Keep environment-specific values in config files or environment variables.
- Avoid hardcoded secrets, ports, URLs, and credentials.
- Ensure example env files document the required variables.

## Frontend

- Ensure there is a production build command and it passes.
- Keep API calls centralized.
- Add explicit states for loading, empty results, and failures.
- Keep reusable UI logic out of route files when it starts to repeat.

## Backend

- Validate inbound request payloads.
- Return stable error shapes for client-visible failures.
- Keep controllers focused on orchestration.
- Cover changed use cases with automated tests where possible.

## Quality Gates

- Run linting if configured.
- Run the build for the affected app.
- Run tests for the affected app or module.
- Document any skipped verification and why.
