#!/usr/bin/env sh

cd ./lib/

for dir in */; do
    cd "$dir"

    os=$(uname -s)

    if [ "$os" == "Linux" ]; then
        size=$(stat -c %s ./package.json)
    elif [ "$os" == "Darwin" ]; then
        size=$(stat -f%z ./package.json)
    else
        echo "ERROR: unsupported OS: $os"
        exit 1
    fi

    echo "$dir: $size"

    if [ $((size / 1000000)) -gt 10 ]; then
        echo "ERROR: size of $dir exceeds 10MB!"
        exit 1
    fi

    cd ..
done

