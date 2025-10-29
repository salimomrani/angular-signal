# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Modern Angular With Signals Course** repository, demonstrating Angular 20's signals-based reactive state management. The codebase is a learning resource that showcases modern Angular patterns with NgRx Signals and standalone components.

**Important**: This repository has two branches:

- `main`: Contains the final, complete implementation (end state of the course)
- `1-start`: Contains the starting point for the course (work-in-progress branch)

**Required Node Version**: Node 22 (LTS)

## Development Commands

prefere to use type over interface where possible

### Running the Application

The application requires **both** frontend and backend servers to be running:

```bash
# Terminal 1: Start the backend REST API server (runs on port 9001)
npm run server

# Terminal 2: Start the Angular development server (runs on port 4200)
npm start
# or
ng serve
```

Access the application at http://localhost:4200

### Build, Test, and Lint

```bash
# Build the application for production
npm run build

# Watch mode for development builds
npm run watch

# Run all tests (uses Karma + Jasmine)
npm test
# or
ng test

# Lint the codebase (ESLint with Angular rules)
npm run lint
# or
ng lint
```

### Single Test Execution

To run a single test file, modify the test file to use `fdescribe` or `fit` instead of `describe` or `it`, then run:

```bash
ng test --include='**/your-file.spec.ts'
```

## Architecture

### State Management with NgRx Signals

This codebase demonstrates **signal stores** using `@ngrx/signals`, which is the modern alternative to traditional NgRx store patterns:

- **Signal Stores**: Defined using `signalStore()` from `@ngrx/signals` (see `src/app/services/course.store.ts`)
  - `withState()`: Define state shape
  - `withComputed()`: Computed signals (derived state)
  - `withMethods()`: Actions and state mutations via `patchState()`
  - `withHooks()`: Lifecycle hooks (e.g., `onInit`)
  - `rxMethod()`: Reactive methods that handle async operations with RxJS operators
  - withProps() : to inject dependencies like services

Example pattern from `course.store.ts`:

```typescript
export const courseStore = signalStore(
  withState(initialState),
  withComputed(({ courses }) => ({
    beginnersCourses: computed(() => courses().filter(course => course.category === "BEGINNER")),
    advancedCourses: computed(() => courses().filter(course => course.category === "ADVANCED"))
  })),
  withProps(() => ({
    courseService: inject(CoursesService)
  })),
  withMethods(({ courseService, ...store }) => {
    const loadCourses = rxMethod<void>(
      pipe(
        switchMap(() =>
          courseService.getCourse$().pipe(
            tap((courses) => patchState(store, { courses }))
          )
        )
      )
    );

    const updateCourse = rxMethod<{ courseId: string; changes: Partial<Course> }>(
      pipe(
        switchMap(({ courseId, changes }) =>
          courseService.updateCourse$(courseId, changes).pipe(
            tap((updatedCourse) => {
              const courses = store.courses().map(course =>
                course.id === courseId ? updatedCourse : course
              );
              patchState(store, { courses });
            })
          )
        )
      )
    );

    return { loadCourses, updateCourse };
  }),
  withHooks({
    onInit({ loadCourses }) {
      loadCourses();
    }
  })
);
```

**Key Patterns**:

- Signal stores are provided at the **component level** via `providers: [courseStore]`
- Components inject signal stores and access computed signals directly
- State mutations always use `patchState()` - never mutate state directly
- Async operations use `rxMethod()` with RxJS operators

### Component Architecture

- **Standalone Components**: All components use standalone: true (implicit in Angular 20)
- **Component Structure**:
  - Template-driven with `.html` files
  - Styles use SCSS (`.scss` files)
  - No component selector prefix (prefix: "" in angular.json)

### Services

Two types of services exist in the codebase:

1. **Traditional Services** (`src/app/services/*.service.ts`):

- HTTP communication services (e.g., `CoursesService`, `LessonsService`)
- Injectable with `providedIn: 'root'`

2. **Signal-based Services** (`src/app/loading/loading.service.ts`, `src/app/messages/messages.service.ts`):

- Use Angular signals for reactive state
- Lighter weight alternative to signal stores for simple state

### Backend REST API

The backend (`server/server.ts`) is an Express.js server that:

- Runs on port **9001** (hardcoded)
- Provides mock REST API endpoints for courses and lessons
- Uses TypeScript with `ts-node` for execution
- Routes are modularized in `server/*-*.route.ts` files

**Available API Endpoints**:

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a course
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/search-lessons` - Search lessons
- `PUT /api/lessons/:id` - Update lesson
- `POST /api/login` - User login

### Routing

Routes are defined in `src/app/app.routes.ts` using functional route configuration:

- Standalone component routes (no modules)
- Route-level state providers using `provideState()` from NgRx

### Application Configuration

- **App Config** (`src/app/app.config.ts`): Uses `ApplicationConfig` with providers:
  - `provideRouter(routes)` - Routing
  - `provideHttpClient(withFetch())` - HTTP with fetch API
  - `provideStore()` - NgRx store (for compatibility with signal stores)
  - `provideStoreDevtools()` - Redux DevTools integration

- **Environment Configuration** (`src/environments/`):
  - `environment.ts` - Production config
  - `environment.development.ts` - Development config
  - File replacement configured in `angular.json` for development builds
  - **Note**: Current `apiUrl` is set to `http://localhost:3333` but backend runs on port 9001

## Code Style and Linting

- **ESLint Configuration**: Uses `eslint.config.js` with:
  - TypeScript ESLint rules
  - Angular-specific linting rules
  - Template accessibility rules for HTML files
  - Directive selector prefix: `app` (camelCase)

- **Inline Templates**: ESLint processes inline templates with `angular.processInlineTemplates`

## Angular Material

The project uses **Angular Material 20** for UI components:

- Material tabs, dialogs, and form components
- Animations enabled via `provideAnimationsAsync()`

## Testing

- **Framework**: Karma + Jasmine
- **Configuration**: Tests configured in `tsconfig.spec.json`
- **Test Files**: Located alongside source files as `*.spec.ts`
- **Note**: The codebase appears to be primarily for learning, so test coverage may be minimal

## Important Notes

1. **Signals-First Approach**: This codebase demonstrates modern Angular with signals as the primary reactivity mechanism
2. **No NgModules**: Pure standalone component architecture
3. **NgRx Signals vs Traditional NgRx**: Uses `@ngrx/signals` (signal stores) not traditional actions/reducers
4. **Port Configuration**: Verify backend port matches environment config (currently mismatched: env says 3333, server uses 9001)
5. **Branch Awareness**: Check which branch you're on - `1-start` is the learning branch, `main` is the final state
