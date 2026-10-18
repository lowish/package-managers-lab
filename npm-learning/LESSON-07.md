Lesson 7 — npm Workspaces and Monorepos
Goal
Learn how npm Workspaces manage multiple related packages inside one Git repository, and how a package in the repository can depend on another local package.
This lesson is command-line and code focused. No UI is required.
1. What is a monorepo?
A monorepo is one Git repository that contains multiple related projects or packages.
For example:
company-platform/
├── package.json
├── package-lock.json
├── apps/
│   └── api/
│       └── package.json
└── packages/
    └── shared-utils/
        └── package.json
- apps/api is an application.
- packages/shared-utils is reusable code.
- The root package file configures npm Workspaces.
- The root lockfile records dependency resolution for the workspace.
A monorepo is not automatically better than separate repositories. It is useful when projects share code or benefit from coordinated tooling and changes.
2. Create a workspace practice repository
Keep your existing npm-learning lessons intact. Create this practice project alongside npm-backend-practice, at the root of package-managers-lab.
From Git Bash:
cd /d/package-managers-lab
mkdir npm-workspaces-practice
cd npm-workspaces-practice
npm init -y
Create the folders:
mkdir -p apps/api/src packages/shared-utils
Your structure will eventually be:
npm-workspaces-practice/
├── package.json
├── package-lock.json
├── apps/
│   └── api/
│       ├── package.json
│       └── src/
│           └── index.js
└── packages/
    └── shared-utils/
        ├── package.json
        └── index.js
3. Configure the root workspace
Open the root package.json. Replace or merge its contents with:
{
  "name": "npm-workspaces-practice",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "api": "npm run start --workspace=@practice/api",
    "test:utils": "npm run test --workspace=@practice/shared-utils"
  }
}
Important:
- "private": true prevents accidentally publishing this root package to the npm registry.
- "workspaces" tells npm which local folders are packages it should manage.
- apps/* and packages/* are folder patterns.
- The root is the place where you run workspace-wide npm commands.
4. Create the shared package
Create packages/shared-utils/package.json:
{
  "name": "@practice/shared-utils",
  "version": "1.0.0",
  "description": "Shared utility functions for workspace practice",
  "main": "index.js",
  "scripts": {
    "test": "node --test"
  }
}
Create packages/shared-utils/index.js:
function normalizeTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}

module.exports = { normalizeTitle };
This package exports a reusable function. The API can import it instead of duplicating the same logic.
5. Create the API workspace
Create apps/api/package.json:
{
  "name": "@practice/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "@practice/shared-utils": "1.0.0"
  }
}
Create apps/api/src/index.js:
const { normalizeTitle } = require("@practice/shared-utils");

const input = "   Learning    npm workspaces   ";
console.log(normalizeTitle(input));
The API declares @practice/shared-utils as a dependency. Because it is a workspace package, npm can link it locally when it installs the workspace dependencies.
6. Install and inspect
Run these commands from the root npm-workspaces-practice directory:
npm install
npm ls --workspace=@practice/api
npm ls --workspace=@practice/shared-utils
npm run api
Expected output from npm run api:
Learning npm workspaces
Inspect the root node_modules directory and the root package-lock.json. npm commonly links workspace packages into node_modules so that packages can resolve them by their declared names. The exact physical layout can vary with dependency structure and npm version.
7. Add a test to the shared package
Create packages/shared-utils/index.test.js:
const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeTitle } = require("./index.js");

test("trims leading/trailing spaces and collapses repeated spaces", () => {
  assert.equal(normalizeTitle("  npm   workspaces  "), "npm workspaces");
});
Run the test from the root:
npm run test:utils
Or directly target the package:
npm test --workspace=@practice/shared-utils
Both commands run the test script defined by the shared package. The root script is a convenient alias; the direct command demonstrates npm's workspace selector.
8. Understand the important commands
Command	Purpose
npm install	Installs dependencies for the workspace project from the root
npm ls --workspaces	Lists packages recognized as workspaces
npm ls --workspace=@practice/api	Inspects dependencies for one workspace
npm run start --workspace=@practice/api	Runs a script in one workspace
npm test --workspace=@practice/shared-utils	Runs the shared package's test script
npm install dayjs --workspace=@practice/api	Adds a dependency to the selected workspace
npm install -D prettier -w	Adds a development dependency to the root package
npm run test --workspaces	Runs the test script in workspaces that define it


Use npm help workspaces or the official npm Workspaces documentation if a command behaves differently in your installed npm version.
9. Why local workspace dependencies matter
Without workspaces, you might publish shared-utils or manage it through a separate repository and package installation workflow.
With workspaces, the API can declare the local package by its package name and version. npm manages the local relationship during installation. This is useful for shared validation, formatting, types, logging, and other code used by multiple applications.
Do not assume that every workspace must be published. Many monorepos contain private applications and internal-only packages.
10. Git and lockfile practice
From the root:
git status
git diff -- package.json package-lock.json
If this practice folder is inside your existing Git repository, Git can track it as part of the same repository. Commit only after reviewing the files and confirming no secrets or generated clutter were added.
A root package-lock.json is important because it records the resolved dependency tree for reproducible installs. Avoid creating separate conflicting lockfiles for the same npm workspace root.
11. Your tasks
1. Run npm ls --workspaces and identify both local packages.
2. Run npm run api and explain how the API resolves @practice/shared-utils.
3. Run the shared utility test.
4. Add dayjs to @practice/api using a workspace-targeted install command.
5. Inspect which package.json changed and how the root lockfile changed.
6. Explain why private: true is used in the root package.
7. Explain one benefit and one trade-off of a monorepo compared with separate repositories.