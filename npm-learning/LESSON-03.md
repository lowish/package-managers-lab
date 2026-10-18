Lesson 3: Dependency Trees, Transitive Dependencies, and Conflicts
Goal
Understand how npm handles dependencies that depend on other packages, and what can happen when different packages require different versions of the same dependency.
By the end of this lesson, you should be able to:
- Distinguish direct dependencies from transitive dependencies.
- Read a dependency tree using npm commands.
- Understand the purpose of peer dependencies.
- Recognize common dependency-version conflicts.
- Use npm's inspection commands to investigate dependency problems.
1. Direct vs. transitive dependencies
A direct dependency is a package your project declares in its own package.json.
A transitive dependency is a package required by one of your dependencies, or by another package further down the dependency tree.
Example:
your-project
└── package-a                 (direct dependency)
    └── package-b             (transitive dependency)
        └── package-c         (transitive dependency)
If your project installs package-a, npm may also need to install package-b and package-c. You might never import those packages directly, but they can still be necessary for package-a to work.
Try it
In your npm-learning/ directory, run:
npm ls --depth=0
npm ls
- npm ls --depth=0 shows the project's top-level dependencies.
- npm ls shows more of the dependency tree.
If you are using Vite, you will already see a number of packages. That is normal: development tools often depend on other packages.
Record one example of a direct dependency and one of its transitive dependencies in your notes.
Note: The exact tree depends on your project's current dependencies and versions.

2. Inspect why a package is installed
Run:
npm explain dayjs
npm explain prettier
These commands explain why npm installed each package and how it relates to your dependency tree. If you have not installed one of these packages, npm may report that it cannot find it; use a package that appears in npm ls.
You can also inspect a particular package's dependency tree:
npm ls <package-name>
Replace <package-name> with a real package name from your project.
Think about it
1. Which packages did you install directly?
2. Which packages were installed because another package needs them?
3. Why might removing a direct dependency also remove packages underneath it?
3. Understand peer dependencies
A peer dependency tells a package that it expects another package to be provided by the surrounding project or environment.
For example, a React component library may expect your application to provide a compatible version of React instead of installing a completely separate React runtime for the library.
Conceptually:
your React application
├── react
└── component-library
    └── peer dependency: react
Peer dependencies help libraries declare which host package or version range they are designed to work with.
They are not the same as ordinary dependencies. npm versions 7 and later generally try to install peer dependencies automatically, and incompatible peer requirements can lead to warnings or installation errors.
Inspect package metadata
Try:
npm view eslint-plugin-react peerDependencies
npm view react-dom peerDependencies
Look at the returned version ranges. They describe which versions of the peer package are supported. Metadata can change over time, so use the output from your own command.
4. Understand version conflicts
Imagine your project uses two packages:
your-project
├── package-a → requires library-x ^1.0.0
└── package-b → requires library-x ^2.0.0
Those version ranges do not overlap. npm may install separate compatible versions in different places in the dependency tree if the package layout and dependency constraints allow it.
However, not every conflict can be resolved automatically. Peer dependency constraints, incompatible APIs, or other requirements can cause warnings or errors.
Important distinction:
- Different versions do not automatically mean an error.
- An incompatible requirement can cause a conflict.
- A successful install does not guarantee that all packages behave correctly together at runtime.
Do not deliberately break your main project to test this. First inspect the dependencies you already have.
5. Learn the troubleshooting commands
Use these when investigating a dependency issue:
npm ls
npm ls <package-name>
npm explain <package-name>
npm view <package-name> dependencies
npm view <package-name> peerDependencies
npm outdated
What they help you discover:
Command	Purpose
npm ls	Shows the installed dependency tree and may flag invalid or missing dependencies
npm ls <package-name>	Shows where a particular package appears in the tree
npm explain <package-name>	Explains why a package is installed
npm view <package-name> dependencies	Shows a package's declared regular dependencies in registry metadata
npm view <package-name> peerDependencies	Shows its declared peer dependency requirements
npm outdated	Lists installed dependencies with newer versions available under the reported version information


Replace <package-name> with the real package name, without angle brackets.
6. Your hands-on task
Complete these steps in npm-learning/:
1. Run npm ls --depth=0 and note your direct dependencies.
2. Run npm ls and choose one dependency that has its own dependencies.
3. Run npm explain <package-name> for that package.
4. Run npm view <package-name> dependencies to inspect its published dependency metadata.
5. If a package lists peer dependencies, run npm view <package-name> peerDependencies and interpret the version ranges.
6. Do not install or uninstall anything just to force a conflict. Use the existing dependency tree to learn how npm reports relationships.
If a command returns an error, save the exact message; interpreting real error output is part of the exercise.
7. Notes and questions
Fill in these answers after your experiment:
- One direct dependency I found:
- One transitive dependency I found:
- How I found the relationship:
- What npm explain showed:
- One peer dependency and its version range (if found):
- What I learned about version conflicts:
- Anything confusing or an error I encountered:
Completion checklist
- [ ] I can explain direct vs. transitive dependencies.
- [ ] I can read at least part of npm ls output.
- [ ] I know how to investigate a package with npm explain.
- [ ] I understand what peer dependencies communicate.
- [ ] I know that different package versions are not always a conflict.