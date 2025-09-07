FROM node:18-slim
WORKDIR /site
COPY . .
RUN npm install && \
    mkdir -p _posts posts && \
    chmod -R 777 /site && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "trap 'exit 0' SIGINT; npm run dev"]