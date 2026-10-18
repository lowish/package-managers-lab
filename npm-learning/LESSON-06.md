Lesson 6: Package Updates, Security Audits, and Maintenance
Goal
Learn how to maintain dependencies safely instead of blindly upgrading everything.
By the end of this lesson, you should be able to:
- Find outdated dependencies.
- Understand the difference between checking, updating, and installing packages.
- Read an npm audit report at a basic level.
- Investigate a package before upgrading it.
- Review dependency changes through Git.
1. Start in the correct project
Use your existing npm-learning/ folder:
cd /d/package-managers-lab/npm-learning
Check the current state:
npm ls --depth=0
npm outdated
npm outdated compares installed packages with newer versions available according to your version ranges and registry metadata. It does not automatically update your packages.
If no packages are outdated, that is fine. The output depends on your current dependencies and published releases.
2. Understand the update commands
Command	What it does
npm outdated	Reports packages with newer versions available
npm update	Updates packages within the version ranges allowed by package.json, updating the lockfile as needed
npm install <package>@<version>	Installs or requests a specific version and updates dependency metadata
npm audit	Checks the dependency tree against known vulnerability advisories
npm audit fix	Attempts compatible dependency updates that address reported vulnerabilities
npm ls	Shows installed dependencies and can report invalid or missing packages


Do not update packages simply because newer versions exist. Review what would change and whether the new version is compatible with your project.
Run npm outdated. Choose one listed package, if any, and record its current, wanted, and latest versions. If the command produces no rows, record that instead.
3. Inspect a package before updating it
For a package you are considering updating, inspect its metadata:
npm view <package-name> version
npm view <package-name> engines
npm view <package-name> peerDependencies
Replace <package-name> with an actual dependency in your project.
These commands can tell you:
- The latest published version.
- Which Node.js or npm versions the package declares it supports.
- Which peer packages or version ranges it expects.
Read the package's changelog or release notes before a significant upgrade. Major versions may introduce breaking changes even when installation succeeds.
4. Run a security audit
Run:
npm audit
The report may list vulnerabilities in direct or transitive dependencies. It can include severity, affected version ranges, suggested remediation, and the dependency path.
Keep these distinctions in mind:
- A vulnerability report is a reason to investigate, not proof that your application is exploitable in every situation.
- A transitive dependency may be introduced by a package you installed directly.
- A package can be vulnerable even if your own code never imports it directly.
- A clean audit does not guarantee that your application is completely secure.
If npm reports vulnerabilities, inspect the package names and dependency paths. Check the suggested remediation and relevant release notes.
5. Understand npm audit fix
After reviewing the report, you may try:
npm audit fix
This attempts to resolve vulnerabilities using updates that fit the dependency constraints npm can adjust. It may not resolve every issue.
Avoid starting with:
npm audit fix --force
The --force option can permit changes outside your declared version ranges, including potentially breaking major-version updates. Do not use it as a routine fix. Investigate the issue and decide on a deliberate upgrade instead.
After any update, run your project's relevant checks. In the backend practice project, for example:
npm run typecheck
Also run available tests and build scripts.
6. Review changes with Git
Dependency updates can change package.json and package-lock.json.
Before and after an update, inspect:
git status
git diff -- package.json package-lock.json
If the folder is not inside a Git repository, these commands will not show a useful diff. In that case, inspect the files manually or use the repository you already track.
Review whether:
- Direct dependency versions changed.
- The lockfile changed many transitive packages.
- A major version was introduced.
- The application still starts and behaves correctly.
A lockfile change is not automatically bad; it is a change you should understand and review.
7. Hands-on task
In npm-learning/:
1. Run npm outdated and record its output.
2. Pick one dependency and inspect its engines and peerDependencies metadata.
3. Run npm audit and record the result, even if no vulnerabilities are reported.
4. Do not run npm audit fix --force.
5. If you choose to update a dependency, preserve your current work first, make one deliberate update, and inspect the changes.
6. Run the project's relevant checks after any update.
7. Use git diff if the project is tracked by Git.
You do not need to force an outdated package or vulnerability to appear. Learning to inspect a clean report is part of the exercise.
8. Document your findings
Record these answers in this file or create LESSON-06-NOTES.md:
- What npm outdated reported:
- Package I inspected:
- What its engines field means:
- What its peer dependencies mean (if any):
- What npm audit reported:
- Whether I changed any dependencies:
- How I verified the project afterward:
- One thing I learned about safe updates: