# syntax=docker/dockerfile:1

FROM ruby:2.7.2

# Ensure latest packages for Yarn
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Allow apt to work with https-based sources
RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
    apt-transport-https \
    nodejs \
    postgresql-client \
    yarn

WORKDIR /app

# Backend packages
COPY Gemfile* ./
RUN bundle config --global frozen 1 \
 && bundle install --jobs 5 --retry 3 \
 # Remove unneeded files (cached *.gem, *.o, *.c)
 && rm -rf /usr/local/bundle/cache/*.gem \
 && find /usr/local/bundle/gems/ -name "*.c" -delete \
 && find /usr/local/bundle/gems/ -name "*.o" -delete

# Frontend packages
COPY package.json yarn.lock ./
RUN yarn install

# Add the Rails app
COPY . .

RUN chmod +x ./docker/*.sh
