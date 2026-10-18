Lesson 8 — Real-World Package Maintenance Workflow

Goal

Learn how to inspect dependencies, review available updates, update packages safely, understand lockfile changes, and validate dependency changes before committing them to Git.

This lesson is command-line and code focused. No UI is required.

1. What is package maintenance?

Package maintenance is the process of keeping a project's dependencies reliable, compatible, and reasonably up to date.

In a real-world project, you should not blindly update every package. You need to understand what is installed, what updates are available, whether an update introduces breaking changes, and how to verify that the application still works.

For example:

npm-backend-practice/
├── package.json
├── package-lock.json
├── node_modules/
├── src/
│   └── index.js
└── .gitignore

package.json declares dependencies and acceptable version ranges.

package-lock.json records resolved dependency versions and installation metadata.

node_modules/ contains installed packages.

.gitignore prevents generated dependencies and sensitive files from being committed.

src/ contains application code that depends on installed packages.

A reliable maintenance workflow helps prevent unexpected dependency changes from breaking an application or causing inconsistencies between development and deployment environments.

2. Create a package maintenance practice project

Keep your existing npm lessons intact. Create this practice project alongside your other npm practice projects, at the root of package-managers-lab.

From Git Bash:

cd /d/package-managers-lab
mkdir npm-maintenance-practice
cd npm-maintenance-practice
npm init -y

Install a package:

npm install dayjs

Create the source folder:

mkdir src

Your structure will eventually be:

npm-maintenance-practice/
├── node_modules/
├── src/
│   └── index.js
├── .gitignore
├── package.json
└── package-lock.json

This is a separate practice project, so you can experiment with package updates without changing the existing projects in npm-learning.

3. Configure the practice project

Open package.json and replace or merge its contents with:

{
  "name": "npm-maintenance-practice",
  "version": "1.0.0",
  "private": true,
  "description": "Practice project for npm package maintenance",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "check": "npm ls"
  },
  "dependencies": {
    "dayjs": "^1.11.0"
  }
}

Important:

"private": true prevents accidentally publishing this practice project to the npm registry.

"scripts" defines commands that can be run through npm.

"dependencies" declares the package your application needs.

"^1.11.0" is an example of a version range, not an instruction to force a downgrade to that version.

Important: After installing Day.js, inspect your actual package.json. If you replace its contents with the example above, ensure the declared range accepts the installed version. Keep package-lock.json consistent with package.json by running npm install from the project root after making the change.

4. Create the application

Create src/index.js:

const dayjs = require("dayjs");

function getCurrentDate() {
  return dayjs().format("MMMM D, YYYY");
}

function main() {
  console.log("npm Maintenance Practice");
  console.log("Current date:", getCurrentDate());
}

main();

Run the application:

npm start

Expected output will resemble:

npm Maintenance Practice
Current date: October 19, 2026

The date depends on when you run the program.

This small application gives you a working baseline. When you update a dependency, you can verify that the application continues to run.

5. Inspect installed and outdated dependencies

Before updating anything, inspect the dependency tree.

Run these commands from the project root:

npm ls
npm ls dayjs
npm outdated
npm audit

Understand each command:

npm ls displays the installed dependency tree.

npm ls dayjs shows the installed Day.js dependency and its version.

npm outdated reports installed packages for which newer versions are available.

npm audit checks dependencies against known vulnerability advisories.

The output of npm outdated includes several useful columns:

Column

Meaning

Current

The version currently installed

Wanted

The newest version that satisfies the declared version range

Latest

The version tagged as latest in the registry

For example, if the declared range is ^1.11.0, Wanted may be a newer compatible 1.x version, while Latest may be a 2.x version.

Do not assume that Latest is always the safest version to install. Major releases may introduce breaking changes.

npm audit may report no vulnerabilities or identify issues requiring investigation. Review the affected packages and advisory details rather than assuming every reported issue is automatically exploitable.

6. Update dependencies safely

npm provides several ways to change installed dependencies.

A. Update within declared version ranges

npm update

This updates dependencies within their declared version ranges where newer compatible versions are available. It may also update package-lock.json.

B. Install a specific version

npm install dayjs@1.11.13

This requests a specific Day.js version and updates the dependency declaration and lockfile as appropriate.

The version is an example. Check the versions available to your project before using it, and ensure the requested version satisfies your project's requirements.

C. Check the result

npm ls dayjs
npm outdated
npm start

These commands help you inspect the installed version, identify remaining updates, and verify the application.

Important practices:

Update one dependency or one related group at a time when practical.

Review release notes before major-version upgrades.

Check whether your application uses APIs that have changed.

Run tests after making changes.

Avoid using npm update as a substitute for reviewing dependency changes.

7. Review package.json and package-lock.json changes

Before experimenting with Git, create a .gitignore file:

node_modules/
.env
.env.*
!.env.example

Only commit .env.example when it contains placeholders rather than real credentials or secrets.

If your project is not yet a Git repository, initialize it:

git init
git add .
git commit -m "chore: initialize npm maintenance practice"

After making a dependency change, inspect the files:

git status
git diff -- package.json package-lock.json

Review the changes carefully.

Look for:

Changes to declared dependency version ranges.

Changes to resolved package versions.

Added or removed transitive dependencies.

Unexpected modifications to unrelated packages.

Changes to scripts or project metadata that were not part of the intended task.

The lockfile may change even when you did not directly edit it. For example, installing a package can change the resolved dependency tree.

Do not manually edit the lockfile to force a particular version. Use npm commands to make dependency changes and regenerate the lockfile appropriately.

8. Understand npm install versus npm ci

These commands serve different purposes.

Command

Purpose

npm install

Installs dependencies and can update the lockfile when necessary.

npm update

Updates dependencies within their declared version ranges where possible.

npm ci

Performs a clean installation from a compatible lockfile.

npm audit

Checks dependencies against known security advisories.

npm outdated

Shows packages with newer available versions.

Practice a clean installation

First, make sure the project has a valid package.json and package-lock.json.

Run:

npm ci
npm start
npm ls

npm ci removes the existing node_modules directory before installing dependencies from the lockfile.

Important:

A compatible lockfile must already exist.

The lockfile must agree with the dependency declarations in package.json.

If the manifests are incompatible, npm ci fails rather than updating them to resolve the mismatch.

npm ci does not update package.json or package-lock.json to fix that mismatch.

If the command fails, investigate the error. If you intentionally changed the dependency declarations, run npm install to update the lockfile before retrying the clean installation.

A clean installation is useful because it checks whether the project's committed dependency manifests are sufficient to reconstruct its installed dependencies.

9. Add a test and validate the application

A successful application run is useful, but a real-world project should also have tests.

Create src/index.test.js:

const test = require("node:test");
const assert = require("node:assert/strict");
const dayjs = require("dayjs");

test("formats a date using the expected format", () => {
  const date = dayjs("2026-10-19");

  assert.equal(
    date.format("MMMM D, YYYY"),
    "October 19, 2026"
  );
});

Update the scripts section of package.json:

"scripts": {
  "start": "node src/index.js",
  "test": "node --test",
  "check": "npm ls"
}

Run the test:

npm test

Expected result: the test passes.

The test uses a fixed date so its expected output does not change from day to day.

After changing package.json, run:

npm install
npm ci
npm test
npm start

The first command ensures the lockfile reflects the current dependency declarations. The remaining commands validate a clean installation, tests, and application execution.

10. Apply the workflow to CI/CD

In a real-world project, GitHub Actions or another CI system can run checks when code is pushed or a pull request is opened.

A typical validation sequence is:

npm ci
npm test
npm run check

For a frontend or full-stack application, you may also have:

npm run lint
npm run build

The additional commands work only if those scripts are defined in your package.json.

A common team workflow is:

Inspect outdated or vulnerable dependencies.

Create a branch for the maintenance change.

Update selected dependencies.

Review package.json and package-lock.json.

Run a clean install and project tests.

Commit the changes.

Open a pull request for review.

Let CI validate the changes before merging.

This workflow helps teammates review exactly what changed and gives automated checks an opportunity to catch regressions.

11. Git and lockfile practice

Inspect the repository:

git status
git diff
git diff -- package.json package-lock.json

Commit only after reviewing the intended changes.

For example:

git add package.json package-lock.json src .gitignore
git commit -m "chore: practice npm dependency maintenance"
git push

If you are working on a feature branch, push that branch instead of assuming you should push directly to the default branch.

Normally, commit:

package.json

package-lock.json

Application source files

Tests

Relevant project configuration

Normally, do not commit:

node_modules/

Actual .env secrets

Generated files that the project can recreate

A committed lockfile is important because it records the resolved dependency tree used by the project. Avoid maintaining separate competing lockfiles for the same npm project root.

12. Your tasks

Complete these tasks independently:

Run npm ls, npm outdated, and npm audit. Explain what each command reports.

Identify the difference between Current, Wanted, and Latest in npm outdated.

Update a dependency and inspect the changes to package.json and package-lock.json.

Run the application before and after the update.

Run npm ci and explain why it removes the existing node_modules directory.

Modify a dependency declaration in a controlled experiment and observe what happens when the lockfile becomes incompatible. Restore consistency using npm commands.

Add and run the date-formatting test.

Explain why a major-version update needs more careful review than a compatible patch update.

Explain why package-lock.json should normally be committed to Git.

Describe how CI/CD uses clean installations and automated tests to validate dependency changes.