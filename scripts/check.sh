#!/usr/bin/env sh

cd ./lib/

for dir in */; do
    cd "$dir"

    size=$(stat -f%z ./package.json)

    echo "$dir: $size"

    if [ $((size / 1000000)) -gt 10 ]; then
        echo "ERROR: size of $dir exceeds 10MB!"
        exit 1
    fi

    cd ..
done

