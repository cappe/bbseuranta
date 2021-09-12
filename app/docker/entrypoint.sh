#! /bin/bash

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

echo "Preparing DB..."
# If database exists, migrate. Otherwise, setup
bundle exec rake db:migrate 2>/dev/null || bundle exec rake db:setup
echo "DB ready!"

bundle exec puma -C config/puma.rb
