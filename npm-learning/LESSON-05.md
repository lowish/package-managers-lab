Lesson 5: npm Scripts, Environment Variables, and Configuration
Goal
Understand how npm scripts run project tools and how environment variables let an application use configuration without hardcoding it in source code.
In this lesson, you will add useful scripts to the backend practice project from Lesson 4. If you have not completed that lesson, you can still follow the npm script examples in your npm-learning/ project.
By the end, you should be able to:
- Read and add npm scripts in package.json.
- Run scripts using npm run.
- Understand how environment variables provide configuration.
- Use a configurable port for a backend server.
- Keep local secrets out of Git.
- Understand why development and production configuration differ.
1. Understand npm scripts
Open the package.json in your backend practice project. You should already have scripts similar to:
"scripts": {
  "dev": "tsx watch src/server.ts",
  "start": "tsx src/server.ts",
  "typecheck": "tsc --noEmit"
}
An npm script is a named command. When you run it, npm executes the command associated with that name.
For example:
npm run dev
npm run typecheck
For the special start script, you can use:
npm start
For most other custom scripts, use npm run <script-name>.
List the scripts configured in the current package:
npm run
Task
1. Run npm run.
2. Identify which script starts the server.
3. Identify which script checks TypeScript types.
4. Run npm run typecheck and note the result.
2. Add a useful script
Add a check script to your existing scripts object:
"check": "npm run typecheck"
Do not replace the entire package.json; add the entry alongside the scripts that are already there.
Now run:
npm run check
This script delegates to the type-check script. In larger projects, scripts commonly compose commands for linting, testing, building, and other repeatable tasks.
Avoid defining a script that calls itself, directly or indirectly, because that creates a loop.
3. Understand environment variables
An environment variable is a value supplied to a process from its environment. Applications commonly use environment variables for configuration such as:
- The port a server listens on.
- The database connection string.
- An API key.
- A logging level.
- A feature flag.
In the Lesson 4 server, this line reads a port from the environment and uses 3000 as a fallback:
const port = Number(process.env.PORT) || 3000;
The application does not need a different source-code edit for every environment. It can receive a different PORT value when it starts.
For a more robust application, validate configuration explicitly: Number(...) || 3000 also falls back for values such as "0" and non-numeric strings. Configuration validation is a useful later improvement.
Try a different port
Stop the development server with Ctrl+C.
In Git Bash on Windows, run:
PORT=4000 npm run dev
Then open a second terminal and test:
curl http://localhost:4000/health
If your shell does not support that assignment syntax, use the environment-variable syntax for your shell. In Windows Command Prompt, for example:
set PORT=4000
npm run dev
The variable set this way applies to that Command Prompt session. Restart the server without the variable to use the default port again.
4. Use a local .env file (optional extension)
Node.js and tools differ in how they load .env files. A .env file is not automatically loaded by every Node.js program just because it exists.
For this TypeScript practice server, you can use the dotenv package:
npm install dotenv
Create a .env file in the backend project root:
PORT=4000
At the very top of src/server.ts, before reading process.env, add:
import "dotenv/config";
Restart the server and test the health endpoint on port 4000.
Do not commit .env files containing secrets. Add .env to .gitignore. If your project does not yet have a .gitignore, create one and include:
node_modules/
dist/
.env
It is safe to commit a .env.example file containing placeholder values, such as:
PORT=3000
DATABASE_URL=replace-with-your-local-database-url
Do not put real passwords, tokens, or API keys in .env.example.
Important: environment variables are configuration, not a secure vault. Keep secrets out of source code, Git history, logs, screenshots, and client-side frontend bundles. Any secret included in browser-delivered code should be considered public.
5. Inspect what changed
Run:
npm ls dotenv
npm explain dotenv
Inspect package.json and package-lock.json. Because dotenv is imported by the application at runtime, it is installed as a regular dependency in this setup.
Also inspect .gitignore and confirm that .env is listed.
6. Why this matters in real systems
A common workflow looks like this:
Developer runs npm run dev
          ↓
npm executes the configured command
          ↓
The application reads environment configuration
          ↓
The server starts with the configured port
In CI or production, a deployment platform or process manager can provide the environment variables. You should not assume that a developer's local .env file exists on the production server.
The same application code can then run in different environments with different configuration values.
7. Hands-on task
1. Run npm run and inspect the available scripts.
2. Run npm run typecheck.
3. Add and run the check script.
4. Start the server on port 4000 using an environment variable.
5. Test the /health endpoint on the new port.
6. Optionally install dotenv, create .env, and load it.
7. Ensure .env is listed in .gitignore.
8. Run npm ls dotenv and npm explain dotenv if you completed the optional extension.
If a command fails, save the exact error and investigate it rather than reinstalling packages at random.