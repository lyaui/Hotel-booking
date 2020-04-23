set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

cd -

git push -f git@github.com:lyaui/Hotel-booking.git master:gh-pages

cd -