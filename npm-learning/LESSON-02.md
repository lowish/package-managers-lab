Lesson 2: Dependency Management and Versioning
Goal
Learn how npm records, resolves, and installs package dependencies.
By the end of this lesson, you should be able to:
- Explain dependencies vs. devDependencies.
- Understand semantic version ranges such as ^1.11.0.
- Explain the roles of package.json and package-lock.json.
- Inspect installed and available package versions.
- Describe the difference between npm install and npm ci.
1. Inspect your installed package
From your npm-learning/ folder, run:
npm ls dayjs
npm explain dayjs
npm ls dayjs shows the installed version and its position in the dependency tree. npm explain dayjs explains why npm installed it.
If dayjs is not installed in this folder, install it first:
npm install dayjs
2. Compare dependencies and development dependencies
Install Prettier as a development tool:
npm install -D prettier
Open package.json. You should see dayjs under dependencies and prettier under devDependencies.
- dependencies are packages your application uses at runtime.
- devDependencies are packages used for development tasks, such as formatting, testing, type-checking, or building.
The distinction depends on how a package is used in your project. A build tool may be required to build the application but not needed by the running application after a production build is created.
3. Understand semantic versioning
Run:
npm view dayjs version
npm view dayjs versions
Then inspect the Day.js version range in package.json.
A typical version has three parts:
MAJOR.MINOR.PATCH
  1  . 11 .  0
- MAJOR: changes that may break compatibility.
- MINOR: new functionality that is intended to be backward-compatible.
- PATCH: backward-compatible fixes.
For a version range such as ^1.11.0, the caret generally permits compatible updates that do not change the major version, so versions from 1.11.0 up to (but not including) 2.0.0 may satisfy the range. The exact result depends on published versions and npm's resolution rules.
Common range examples:
Range	General meaning
^1.11.0	Allows compatible updates within major version 1
~1.11.0	Allows patch updates within minor version 1.11
1.11.0	Exact version range


For 0.x versions, caret behavior is more restrictive because minor versions can represent breaking changes before version 1.0.0. Prerelease versions also have special matching rules.
4. Understand package.json and package-lock.json
- package.json declares dependency names and acceptable version ranges.
- package-lock.json records the resolved dependency tree, including specific package versions and integrity information, so installs can be reproduced more consistently.
The lockfile does not replace package.json; both files have different jobs.
Inspect the files before and after an install. Notice that npm may update the lockfile when dependencies or their resolution change.
5. Compare npm install and npm ci
Run:
npm install
npm ci
npm install installs dependencies and can update the lockfile when necessary.
npm ci is designed for clean, repeatable installs in automation and CI environments. It requires a lockfile that agrees with package.json, removes the existing node_modules directory, and installs from the lockfile without rewriting it.
Caution: npm ci deletes node_modules before installing. Stop running development servers first, and do not use it if you have uncommitted manual changes inside node_modules that you need to preserve.
A shared lockfile helps teammates and CI install a consistent dependency tree, reducing “works on my machine” differences. It does not guarantee that every runtime behavior is identical across operating systems or environments.
6. Check for outdated dependencies
Run:
npm outdated
This reports installed packages for which newer versions are available under the version information npm checks. Do not update everything automatically just because an update is available; check release notes and compatibility first.
7. Hands-on task
In npm-learning/:
1. Run npm ls dayjs.
2. Install Prettier as a development dependency.
3. Identify the dependencies and devDependencies sections in package.json.
4. Inspect the Day.js version range.
5. Run npm view dayjs version.
6. Compare the roles of package.json and package-lock.json.
7. Run npm install, then inspect whether files changed.
8. Stop any development server and run npm ci.
9. Run npm ls --depth=0 to confirm the top-level packages are installed.
Do not worry if the lockfile does not change after a command; npm only needs to change it when the dependency resolution or lockfile metadata needs updating.
8. Document your findings
Write your answers here or keep them in your own LESSON-02.md:
- One package in dependencies:
- One package in devDependencies:
- What ^ means for the version I inspected:
- What package.json records:
- What package-lock.json records:
- Difference between npm install and npm ci:
- Why a team should commit its lockfile:
- Any unexpected output or error:
Completion checklist
- [ ] I can distinguish runtime dependencies from development dependencies.
- [ ] I understand the basics of semantic version ranges.
- [ ] I can explain why npm uses a lockfile.
- [ ] I know the difference between npm install and npm ci.
- [ ] I inspected my project's actual dependency state.