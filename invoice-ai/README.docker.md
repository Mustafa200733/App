# Docker deployment for invoice-ai

These instructions show how to build and run the `invoice-ai` Next.js app inside Docker (suitable for deploying to a VPS).

Prerequisites

- Docker and optionally Docker Compose installed on the host.

Build and run with Docker Compose

1. (Optional) Create an `.env` file next to `docker-compose.yml` with your environment variables:

```
# .env
LOCAL_LLM_URL=http://localhost:7860/api/v1/generate
# or provide OPENAI_API_KEY=sk_...
```

2. Build and start:

```bash
docker compose up -d --build
```

3. Check logs:

```bash
docker compose logs -f invoice-ai
```

4. The app will be available on port 3000 of the host.

Notes

- To run a local LLM alongside this service, either provide `LOCAL_LLM_URL` that points to a separate model host (e.g. a webui on another server) or extend `docker-compose.yml` with a model service. Model containers differ per project — consult the model/webui README for container images and args.
- This Dockerfile builds the Next.js app in production mode (`npm run build` + `npm run start`). If you need development mode, modify the image to run `npm run dev` and expose port 3000.
