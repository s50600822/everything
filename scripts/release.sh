#!/usr/bin/env sh

cd ./lib/

for dir in */; do
    cd "$dir"
    npm publish --access public
    cd ..
done
