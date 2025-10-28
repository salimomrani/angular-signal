# Angular Signals Course - Project Tree

## 📁 Project Structure

```
angular-signals-course/
├── 📁 .angular/                          # Angular CLI cache
├── 📁 .git/                             # Git repository data
├── 📁 .idea/                            # IntelliJ/WebStorm IDE settings
│   ├── .gitignore
│   ├── angular-signals-course.iml
│   ├── copilot.data.migration.agent.xml
│   ├── copilot.data.migration.ask.xml
│   ├── copilot.data.migration.ask2agent.xml
│   ├── copilot.data.migration.edit.xml
│   ├── material_theme_project_new.xml
│   ├── modules.xml
│   ├── vcs.xml
│   └── workspace.xml
├── 📁 .vscode/                          # VS Code settings
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── 📁 node_modules/                     # Dependencies (excluded from git)
├── 📁 server/                           # Backend server code
│   ├── create-course.route.ts
│   ├── db-data.ts
│   ├── delete-course.route.ts
│   ├── get-courses.route.ts
│   ├── login.route.ts
│   ├── save-course.route.ts
│   ├── save-lesson.route.ts
│   ├── search-lessons.route.ts
│   ├── server.ts
│   └── server.tsconfig.json
├── 📁 src/                              # Source code
│   ├── 📁 app/                          # Angular application
│   │   ├── 📁 course/                   # Course component
│   │   │   ├── course.component.html
│   │   │   ├── course.component.scss
│   │   │   └── course.component.ts
│   │   ├── 📁 course-category-combobox/ # Category selector
│   │   │   ├── course-category-combobox.component.html
│   │   │   ├── course-category-combobox.component.scss
│   │   │   └── course-category-combobox.component.ts
│   │   ├── 📁 courses-card-list/        # Course cards display
│   │   │   ├── courses-card-list.component.html
│   │   │   ├── courses-card-list.component.scss
│   │   │   └── courses-card-list.component.ts
│   │   ├── 📁 edit-course-dialog/       # Course editing dialog
│   │   │   ├── edit-course-dialog.component.html
│   │   │   ├── edit-course-dialog.component.scss
│   │   │   ├── edit-course-dialog.component.ts
│   │   │   └── edit-course-dialog.data.model.ts
│   │   ├── 📁 home/                     # Home page component
│   │   │   ├── home.component.html
│   │   │   ├── home.component.scss
│   │   │   └── home.component.ts
│   │   ├── 📁 lessons/                  # Lessons components
│   │   │   ├── 📁 lesson-detail/        # Lesson detail view
│   │   │   │   ├── lesson-detail.component.html
│   │   │   │   ├── lesson-detail.component.scss
│   │   │   │   └── lesson-detail.component.ts
│   │   │   ├── lessons.component.html
│   │   │   ├── lessons.component.scss
│   │   │   └── lessons.component.ts
│   │   ├── 📁 linked-signal/            # Linked signals demo
│   │   │   ├── linked-signal-demo.component.html
│   │   │   ├── linked-signal-demo.component.scss
│   │   │   └── linked-signal-demo.component.ts
│   │   ├── 📁 loading/                  # Loading components
│   │   │   ├── loading.component.html
│   │   │   ├── loading.component.scss
│   │   │   ├── loading.component.ts
│   │   │   ├── loading.service.ts
│   │   │   └── skip-loading.component.ts
│   │   ├── 📁 login/                    # Authentication
│   │   │   ├── login.component.html
│   │   │   ├── login.component.scss
│   │   │   └── login.component.ts
│   │   ├── 📁 messages/                 # Message system
│   │   │   ├── messages.component.html
│   │   │   ├── messages.component.scss
│   │   │   ├── messages.component.ts
│   │   │   └── messages.service.ts
│   │   ├── 📁 models/                   # Data models
│   │   │   ├── course-category.model.ts
│   │   │   ├── course.model.ts
│   │   │   ├── get-courses.response.ts
│   │   │   ├── get-lessons.response.ts
│   │   │   ├── lesson.model.ts
│   │   │   ├── message.model.ts
│   │   │   └── user.model.ts
│   │   ├── 📁 resource-demo/            # Resource API demo
│   │   │   ├── resource-demo.component.html
│   │   │   ├── resource-demo.component.scss
│   │   │   └── resource-demo.component.ts
│   │   ├── 📁 services/                 # Angular services
│   │   │   ├── auth.service.ts
│   │   │   ├── courses-fetch.service.ts
│   │   │   ├── courses.service.ts
│   │   │   └── lessons.service.ts
│   │   ├── app.component.html           # Main app template
│   │   ├── app.component.scss          # Main app styles
│   │   ├── app.component.ts            # Main app component
│   │   ├── app.config.ts               # App configuration
│   │   └── app.routes.ts               # Routing configuration
│   ├── 📁 assets/                       # Static assets
│   │   ├── 📁 icons/                    # SVG icons
│   │   │   ├── close.svg
│   │   │   └── delete.svg
│   │   └── .gitkeep
│   ├── 📁 environments/                 # Environment configs
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── 📁 styles/                       # Global styles
│   │   ├── _button.scss
│   │   ├── _forms.scss
│   │   └── _table.scss
│   ├── favicon.ico                      # Site favicon
│   ├── index.html                      # Main HTML file
│   ├── main.ts                         # Application bootstrap
│   └── styles.scss                     # Global SCSS styles
├── .editorconfig                        # Editor configuration
├── .gitignore                          # Git ignore rules
├── README.md                           # Project documentation
├── angular.json                        # Angular workspace config
├── package-lock.json                   # Locked dependencies
├── package.json                        # Project dependencies
├── tsconfig.app.json                   # App TypeScript config
├── tsconfig.json                       # Main TypeScript config
└── tsconfig.spec.json                  # Test TypeScript config
```

## 🌿 Git Branches

### Local Branches
- `1-start` - Starting point of the course
- `1-start-test` - **Current branch** ⭐ (Test version of starting point)
- `main` - Main branch

### Remote Branches
- `origin/main` - Main remote branch
- `origin/1-start` - Course starting point
- `origin/angular-18` - Angular 18 version
- `origin/angular-19-prep` - Angular 19 preparation
- `origin/recordings-1` - Course recordings (part 1)
- `origin/recordings-ng19` - Angular 19 recordings

## 📊 Project Overview

This is an **Angular Signals Course** project that demonstrates:

- 🎯 **Angular Signals** - Modern reactive programming
- 🎓 **Course Management** - Create, edit, and manage courses
- 📚 **Lesson System** - Detailed lesson components
- 🔐 **Authentication** - Login system
- 💬 **Messaging** - Real-time message handling
- 🎨 **Modern UI** - SCSS styling with component architecture
- 🚀 **Full-Stack** - Frontend + Backend server
- 🔧 **Development Tools** - VS Code + IntelliJ support

## 🛠️ Key Technologies

- **Angular** (Latest version with Signals)
- **TypeScript**
- **SCSS**
- **Node.js** (Backend server)
- **Git** (Version control)

---
*Generated on: 2025-09-25 14:19:37*