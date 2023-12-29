function getFirstChar(name) {
	const initialChar = name.charAt(0).toLowerCase();

	return initialChar === "@"
		? name.split("/")[1].charAt(0).toLowerCase()
		: initialChar;
}

function createPackageJSON({ scope, dependencies }) {
	const deps = {};
	for (const dependency of dependencies) {
		deps[dependency] = "*";
	}

	return JSON.stringify({
		name: `@everything-registry/${scope}`,
		version: require("../package.json").version,
		description: "npm install everything",
		main: "index.js",
		author: 'PatrickJS <github@patrickjs.com>"',
		keywords: ["everything", "allthethings", "everymodule"],
		license: "MIT",
		homepage: "https://github.com/everything-registry/everything",
		dependencies: deps,
	});
}

module.exports = { getFirstChar, createPackage: createPackageJSON };
