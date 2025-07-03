FROM ruby:3.4-slim
WORKDIR /site
COPY . .
RUN apt-get update && \
    apt-get install -y build-essential git && \
    gem install jekyll bundler && \
    bundle install --no-cache && \
    mkdir -p _posts _site && \
    chmod -R 777 /site && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 4000
ENTRYPOINT ["sh", "-c", "trap 'exit 0' SIGINT; bundle exec jekyll clean && bundle exec jekyll build && bundle exec jekyll serve --host 0.0.0.0"]
