FROM ubuntu:20.04

WORKDIR /app
COPY . /app/

RUN apt update && apt upgrade -y
RUN apt install -y curl unzip
RUN curl -fsSL https://deno.land/x/install/install.sh | sh && mv /root/.deno/bin/deno /bin/deno

CMD ["deno", "run", "--allow-net", "--allow-read", "src/index.ts"]
EXPOSE 8080