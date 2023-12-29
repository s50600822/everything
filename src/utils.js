function getFirstChar(name) {
	const initialChar = name.charAt(0).toLowerCase();

	return initialChar === "@"
		? name.split("/")[1].charAt(0).toLowerCase()
		: initialChar;
}

function getPkgJsonData() {
	return {
		version: require("../package.json").version,
		description: "npm install everything",
		main: "index.js",
		author: 'PatrickJS <github@patrickjs.com>"',
		keywords: ["everything", "allthethings", "everymodule"],
		license: "MIT",
		homepage: "https://github.com/everything-registry/everything",
    }
}

module.exports = { getFirstChar, getPkgJsonData };
