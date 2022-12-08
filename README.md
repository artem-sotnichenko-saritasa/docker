# Docker playground

## Requirements

[Deno](https://deno.land/manual@v1.28.3/getting_started/installation)

## Development

### Start server

```bash
deno run --watch --allow-net --allow-read src/index.ts
```

## Build

You can omit `--platform linux/amd64` if you don't use machine with Apple
silicon.

### Build docker image

```bash
docker build -t deno . --platform linux/amd64
```

### Run docker image

```bash
docker run -dp 8080:8080 --platform linux/amd64 deno
```
