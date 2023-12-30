#!/usr/bin/env sh

# Navigate to the 'lib' directory or exit if the directory doesn't exist.
cd ./lib/ || exit

# For each sub-directory of 'lib' represented by 'dir'
for dir in */; do
    # Navigate into 'dir' or continue to the next 'dir' if this fails
    cd "$dir" || continue

    # Print the name of the directory we're attempting to publish
    echo "Publishing directory $dir"

    # Try to publish the npm package publicly. 
    # If successful, print a success message; if not, print a failure message.
    if npm publish --access public; then
        echo "Successfully published $dir"
    else
        echo "Failed to publish $dir"
    fi

    # Navigate back to the parent ('lib') directory
    cd ..
done
