# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository summary
- Single Angular 20 application (no libraries). Package manager: npm (package-lock.json present). Node 22 LTS required.
- Frontend served with Angular CLI; unit tests via Karma/Jasmine; sample backend server (Express) started with ts-node for local development.

Prerequisites
- Node.js 22 LTS active
- NPM is used in this repo
- Optional: Angular CLI globally installed if invoking ng directly (npm scripts already include it)

Common commands
- Install dependencies (CI-safe)
  ```bash
  npm ci
  ```
  If you are iterating locally and don’t need a clean install:
  ```bash
  npm install
  ```

- Start the sample backend (Express via ts-node)
  ```bash
  npm run server
  ```
  This uses ts-node with server/server.tsconfig.json to run server/server.ts.

- Start the frontend (Angular dev server)
  ```bash
  npm start
  ```
  The app is available at http://localhost:4200.

- Build the frontend
  ```bash
  npm run build
  ```
  Useful variants:
  ```bash
  # Development build
  npm run build -- --configuration development

  # Production build (default configuration)
  npm run build -- --configuration production
  ```

- Continuous build (watch mode)
  ```bash
  npm run watch
  ```

- Unit tests (Karma + Jasmine)
  ```bash
  npm test
  ```
  Useful variants:
  ```bash
  # Single spec file (use relative glob or path)
  npx ng test --include src/app/path/to/your.component.spec.ts

  # Run once, headless
  npx ng test --watch=false --browsers=ChromeHeadless
  ```
  Note: You can also temporarily use fit/fdescribe in a spec to focus a single test/suite.

- Extract i18n messages (configured target exists)
  ```bash
  npx ng extract-i18n
  ```

- Linting
  No lint target/config is present in this repository at the time of writing.

High-level architecture
- Workspace
  - Single Angular application project: angular-signals-course (defined in angular.json)
  - Build system: @angular/build:application with development and production configurations
  - Serve target: @angular/build:dev-server (defaults to development)
  - Test target: @angular/build:karma with Jasmine/Karma (zone.js/testing polyfills)

- Application bootstrap (standalone API)
  - Standalone configuration in src/app/app.config.ts:
    - provideRouter(routes) with routes from src/app/app.routes.ts
    - provideAnimationsAsync()
    - provideHttpClient(withFetch())
  - No NgModule usage; the app leverages standalone components/providers

- Routing (src/app/app.routes.ts)
  - Key routes map directly to standalone components: HomeComponent ('/'), LoginComponent ('/login'), LessonsComponent ('/lessons'), LinkedSignalDemoComponent ('/shopping-cart'), ResourceDemoComponent ('/resource-demo')
  - Fallback '**' redirects to '/'

- UI and layout
  - Angular Material is used throughout (e.g., MatSidenav, MatToolbar, MatList, MatIcon)
  - Root component (src/app/app.component.ts) composes layout and imports feature widgets like LoadingIndicatorComponent and MessagesComponent

- TypeScript configuration
  - Strict compiler settings enabled (strict true, noImplicitReturns, etc.)
  - Target/module ES2022; moduleResolution set to bundler

- Testing
  - tsconfig.spec.json includes Jasmine types; tests discovered via src/**/*.spec.ts
  - Karma/Jasmine runner configured by the Angular CLI test builder

- Local backend
  - A small Express server is available for local development scenarios; started via npm run server using ts-node

Key files
- angular.json — project targets (build, serve, test), asset/style configuration, budgets
- package.json — npm scripts for start/build/watch/test/server and Angular/Material dependencies
- tsconfig*.json — strict TS settings (app and spec)
- src/app/app.config.ts — application-wide providers (router, animations, HTTP fetch)
- src/app/app.routes.ts — route definitions

Notes from README
- Use Node 22 (LTS)
- You can run the backend with npm run server and the frontend with npm start
