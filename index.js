let packages = require("./all-packages.json");

let dependencies = {};
packages.forEach((pkg) => {
  dependencies[pkg] = "*";
});

// Initial package.json content
let packageJson = {
  name: "everything",
  version: "2.0.0",
  description: "npm install everything",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  repository: {
    type: "git",
    url: "https://github.com/patrickjs/node-everything.git",
  },
  author: {
    name: "Patrick Stapleton",
    email: "github@patrickjs.com",
    url: "https://patrickjs.com",
  },
  keywords: ["everything", "allthethings", "everymodule"],
  license: "MIT",
  bugs: {
    url: "https://github.com/patrickjs/node-everything/issues",
  },
  homepage: "https://github.com/patrickjs/node-everything",
  dependencies: dependencies,
};

// Then you can generate package.json file using fs module
const fs = require("fs");
fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
