#! /bin/bash

echo "Preparing DB..."
# If database exists, migrate. Otherwise, setup
bundle exec rake db:migrate 2>/dev/null || bundle exec rake db:setup
echo "DB ready!"

# Rails automatically creates the folder during initialization when
# you start the server with bundle exec rails server (puma). This
# folder creation will be skipped if you start the server with
# bundle exec puma, resulting in the error. It would be nice
# though if both commands had the same result, saves some
# errors like these.
# https://stackoverflow.com/questions/52862529/no-such-file-or-directory-rb-sysopen-tmp-pids-puma-pid
# Should we start this with "bundle exec rails server" instead?

mkdir -p tmp/pids

bundle exec puma -C config/puma.rb
