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