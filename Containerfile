FROM ruby:3.2-slim
WORKDIR /site
COPY . .
RUN apt-get update && \
    apt-get install -y build-essential git && \
    gem install jekyll bundler && \
    bundle install --no-cache && \
    chmod 777 /site && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 4000
# Change this line to use exec form and wrap Jekyll in sh -c to handle signals
ENTRYPOINT ["sh", "-c", "trap 'exit 0' SIGINT; bundle exec jekyll clean && bundle exec jekyll build && bundle exec jekyll serve --host 0.0.0.0"]
