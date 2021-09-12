#! /bin/bash

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

if test "$RAILS_ENV" = "production"
  then
    echo "Precompiling assets..."
    bundle exec rake assets:precompile
fi

echo "Preparing DB..."
# If database exists, migrate. Otherwise, setup
bundle exec rake db:migrate 2>/dev/null || bundle exec rake db:setup
echo "DB ready!"

bundle exec puma -C config/puma.rb
