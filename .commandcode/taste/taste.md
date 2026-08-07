# Taste

## Style & conventions
- When adding new content/sections to an existing project, match the project's existing styling and component conventions (explicitly requested: "sesuaikan dengan style yg digunakan project ini" when adding a Training & Certifications section that reused the existing ResumeCard + BlurFade patterns). Confidence: 0.9
- Prefers descriptions/content to be shown directly without interaction (no dropdown/expand-collapse) — explicitly requested "tidak perlu dropdown, langsung aja" for the Training & Certifications section, while keeping expandable behavior elsewhere (Work/Education). Confidence: 0.8

## Communication
- Communicates in Indonesian (Bahasa Indonesia) and expects responses in the same language. Confidence: 0.8

## Tooling & workflow
- The user runs a Next.js dev server (port 3000) and expects it to keep working; avoid running production builds (`npm run build`) while the dev server is active since it overwrites `.next` and breaks the running server — if a build was run, restart the dev server to restore it. Confidence: 0.7
