Lesson 4: Using Packages in a Real Backend System
Goal
Move beyond installing packages and learn how they work together inside a small backend API.
In this lesson, you will create a separate practice API using:
- Express — handles HTTP requests and responses.
- Zod — validates incoming data against a schema.
- Day.js — formats dates.
- Node.js — runs the server-side JavaScript.
- npm — installs and manages the packages.
This is a learning exercise, not a production-ready service. It intentionally leaves out a database, authentication, and deployment so you can focus on package integration.
1. Create a separate backend practice folder
Keep this experiment separate from your existing Vite app.
From the root of package-managers-lab, run:
mkdir npm-backend-practice
cd npm-backend-practice
npm init -y
This creates a new package.json. It describes this practice project independently from npm-learning.
Install the runtime packages:
npm install express zod dayjs
Install TypeScript and development tooling:
npm install -D typescript tsx @types/node @types/express
Why two install commands?
- express, zod, and dayjs are used by the API at runtime, so they belong in dependencies.
- typescript, tsx, and the type declaration packages are development tools, so they belong in devDependencies for this setup.
tsx lets you run TypeScript during development without setting up a separate compile step. For production, projects commonly compile TypeScript or use another deliberate deployment strategy.
2. Create the project files
Create this structure:
npm-backend-practice/
├── src/
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
Create tsconfig.json:
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
In package.json, add these scripts under the existing "scripts" property. Keep the dependencies npm already added; do not replace the whole file with this snippet.
"scripts": {
  "dev": "tsx watch src/server.ts",
  "start": "tsx src/server.ts",
  "typecheck": "tsc --noEmit"
}
For this lesson, start runs through tsx to keep the setup simple. A production deployment should use an intentional build/run workflow.
3. Write the API
Create src/server.ts:
import express from "express";
import { z } from "zod";
import dayjs from "dayjs";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  dueDate: z.string().date().optional(),
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: dayjs().toISOString(),
  });
});

app.post("/tasks", (req, res) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid task data",
      details: result.error.issues,
    });
  }

  const task = {
    id: 1,
    title: result.data.title,
    dueDate: result.data.dueDate ?? null,
    createdAt: dayjs().toISOString(),
  };

  return res.status(201).json({ task });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
What each package does
- Express: express(), app.use(), app.get(), app.post(), and app.listen() provide the HTTP server and route handling.
- Zod: z.object() defines the accepted request shape; safeParse() checks incoming data without throwing a validation exception for ordinary invalid input.
- Day.js: dayjs().toISOString() produces a timestamp string.
- TypeScript and its tooling: help catch type errors and run the server during development.
- npm: records the dependencies and their resolved versions.
The task is only returned in the response; it is not saved to a database. The fixed ID is for demonstrating package integration, not a real ID strategy.
4. Run and inspect the API
Start the server:
npm run dev
You should see a message that the API is listening on port 3000.
Open another terminal in npm-backend-practice.
Test the health route
With curl available:
curl http://localhost:3000/health
Expected response shape:
{
  "status": "ok",
  "timestamp": "..."
}
The timestamp will differ.
Test valid data
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Study npm packages","dueDate":"2026-11-01"}'
Expected: HTTP status 201, with a JSON object containing the task.
Test invalid data
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   "}'
Expected: HTTP status 400, with validation details from Zod.
If you do not have curl, use an API client such as the REST Client extension in VS Code or another HTTP testing tool.
5. Investigate how the packages fit together
With the API working, run:
npm ls --depth=0
npm ls express
npm explain express
npm view express dependencies
npm view zod version
Answer these questions:
1. Which packages are direct dependencies of this API?
2. Which packages are development dependencies?
3. What did Express handle that you would otherwise need to implement yourself?
4. Why is Zod validation useful even when TypeScript is enabled?
5. Why does the server validate req.body at runtime instead of trusting its TypeScript types?
6. What would change if you removed Day.js and used JavaScript's built-in Date?
7. Which packages does Express itself depend on, according to the dependency metadata or installed tree?
Key concept: static types vs. runtime validation
TypeScript types help during development, but request data arrives over HTTP as external input. A TypeScript annotation alone does not verify that a client sent a valid title or date. Zod checks the actual data at runtime.
Key concept: dependencies are system building blocks
Packages do not automatically form an application. You decide how to connect them:
HTTP request
    ↓
Express route
    ↓
Zod validates request data
    ↓
Application builds a response
    ↓
Day.js supplies a timestamp
    ↓
Express sends JSON response
6. Document your findings
Add your answers to this file or create a separate LESSON-04-NOTES.md.
- What I built:
- What Express does:
- What Zod does:
- What Day.js does:
- One invalid request I tested:
- Why runtime validation matters:
- One transitive dependency I found:
- One error I encountered and how I investigated it:
Completion checklist
- [ ] Created a separate backend practice project.
- [ ] Installed runtime and development dependencies.
- [ ] Started the Express server.
- [ ] Tested the health route.
- [ ] Tested both valid and invalid task data.
- [ ] Inspected the dependency tree with npm.
- [ ] Documented what each package contributes.