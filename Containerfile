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
CMD bundle exec jekyll clean && bundle exec jekyll build && bundle exec jekyll serve --host 0.0.0.0
