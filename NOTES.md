# Lesson 1: Docker & Docker Compose

## Key ideas
- Image: a packed box built from the Dockerfile; it's just stored.
- Container: a running image.
- Volume: safe storage for data that must not be lost (containers lose their data when deleted).
- Ports "3000:3000": visiting port 3000 on my Mac goes to port 3000 inside the container.
- Docker Compose: (write in your words)
- Why containers use the service name "db" instead of localhost: (write in your words)

## Commands I used
- docker build / docker run / docker ps / docker stop
- docker compose up / ps / down
- docker volume ls / lsof -i :3000

## Problems I hit and how I fixed them
1. Image names must be lowercase (DevOps-Practice failed).
2. Forgot the "." in docker build.
3. Ctrl + C didn't stop the app, so I added SIGINT/SIGTERM handling.
4. Changed code but saw the old message, so I had to rebuild the image.
5. "address already in use" on port 3000, so I found the program with lsof.
6. A failed compose up left the db running for 2 days, so I check with docker compose ps.

- Docker Compose: a tool that starts several containers together from one file
  (docker-compose.yml). Instead of typing long docker run commands for the app
  and the database separately, I run one command: docker compose up. It also
  creates a private network so the containers can talk to each other.

- Why containers use the service name "db" instead of localhost: inside the app's
  container, "localhost" means the app's own container, not the database. The
  database is in a different container. Docker Compose gives each service a name
  on the private network, so the app finds the database at the address "db".

# Lesson 2: Continuous Integration (CI) with GitHub Actions

## What is CI?
CI means every time I push code, it is automatically built and tested on a
fresh computer. Developers merge small changes often instead of one big
change at the end, so problems are found early, while they are still small
and easy to fix.

Without CI, a bug can sit unnoticed until a user finds it. With CI, GitHub
tells me within seconds that something broke.

## What my ci.yml does
The file lives in `.github/workflows/ci.yml`. GitHub only looks for
workflows in that folder.

- **When it runs (`on:`):** on every push to `main` and on every pull request.
- **Where it runs (`runs-on:`):** on a brand-new Ubuntu Linux machine that
  GitHub creates for each run and deletes afterwards. That's why every run
  has to install everything from scratch.
- **What it does (`steps:`), in order:**
  1. Downloads my code (`actions/checkout`)
  2. Installs Node.js 20 (`actions/setup-node`), the same version as my Dockerfile
  3. Installs packages (`npm ci`)
  4. Runs my tests (`npm test`)
  5. Builds my Docker image, to check the Dockerfile still works
- If any step fails, the run stops and turns red. The next steps don't run.

## My test
`test/server.test.js` starts the app on a free port (port 0), visits
`/health`, and checks that the answer is exactly `{ status: "ok" }`.
`t.after()` makes sure the server always stops, even if the test fails.

To make the app testable, `server.js` now only starts listening when run
directly (`require.main === module`) and exports the server for tests.

## What the red run taught me
I changed the health message from `"ok"` to `"Okay"` and pushed without
testing.

- **CI caught it in 9 seconds.** The bug never reached anyone.
- **The log shows exactly what's wrong:** `+ actual` was `'Okay'` and
  `- expected` was `'ok'`, and it points to the exact line in my test file.
- **Computers compare text exactly:** `ok`, `Ok` and `Okay` are all different.
- **When a step fails, the rest stop.** The Docker build never ran. Later, CD
  will use this to refuse to deploy broken code.
- **Habit:** run `npm test` locally before pushing.

## Problems I hit and how I fixed them
1. `npm: command not found`: VS Code opened **bash**, but Node.js is only in
   **zsh's** PATH. Fixed by switching to zsh and making it the default terminal profile.
2. A Keychain pop-up on `git push`: it was asking permission to use my saved
   GitHub login. I entered my Mac password and chose "Always Allow".

## Evidence
- Green, red and fixed runs: https://github.com/VictoriaMirembe/DevOps/actions