# Repository Guidelines

## Project Structure & Module Organization
The Angular client lives in `src/app`, organized by feature folders such as `home`, `courses`, and `lessons`. Shared models and services sit in `src/app/models` and `src/app/services`, while reusable styles are grouped under `src/styles`. Runtime assets (icons, images) belong in `src/assets`. The lightweight Express API used for the course exercises is in `server`, with its own `server.tsconfig.json`. Update Angular configs in `angular.json` and TypeScript settings via `tsconfig*.json`; avoid editing generated files inside `.angular`.

## Build, Test, and Development Commands
- `npm start`: run `ng serve` for the Angular dev server with live reload.
- `npm run server`: launch the Express backend on the configured port (defaults to 9000). Start this when working with authenticated or data-backed flows.
- `npm run build`: produce an optimized production bundle in `dist/angular-signals-course`.
- `npm test`: execute Karma/Jasmine unit tests once; append `--watch=true` during feature work.
- `npm run lint`: run Angular ESLint rules defined in `eslint.config.js`.

## Coding Style & Naming Conventions
Follow the default Angular style: components, services, and pipes use `kebab-case` filenames (`lesson-detail.component.ts`) with matching PascalCase class names. Keep imports ordered by module path and prefer Angular signals over RxJS in new code when possible. The repo enforces 2-space indentation and single quotes in TypeScript via `.editorconfig`. Keep SCSS modular—co-locate styles with components and expose shared mixins in `src/styles`. Before committing, format HTML/SCSS/TS using the Angular CLI or your editor’s integration; avoid committing compiled artifacts.

## Testing Guidelines
Place unit tests alongside implementation files with a `.spec.ts` suffix (`course.component.spec.ts`). Use Jasmine’s `describe` blocks per component/service and keep selectors or DOM queries resilient to style changes. Run `npm test -- --code-coverage` to update coverage outputs; aim to maintain or improve existing coverage levels. For features that depend on the Express server, add integration mocks rather than relying on live endpoints.

## Commit & Pull Request Guidelines
Commits in this project use concise, imperative summaries (`Upgrade to Angular 20`, `Add lessons signal demo`). Scope changes narrowly and include follow-up commits for lint fixes instead of amending unrelated code. Pull requests should link the relevant issue or course module, describe UI or API impacts, and attach screenshots or GIFs when altering views. Mention required manual steps (e.g., running `npm run server`) so reviewers can reproduce changes quickly. Coordinate breaking changes to shared models with frontend and server maintainers before merging.
