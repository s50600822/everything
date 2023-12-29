const names = require("all-the-package-names");
const fs = require("fs");
const path = require("path");

const { getFirstChar, createPackageJSON } = require("./utils");

const scopes = [
	..."abcdefghijklmnopqrstuvwxyz".split(""),
	..."1234567890".split(""),
];

const packages = {};

for (const name of names) {
	const firstChar = getFirstChar(name);
	const scope = scopes.includes(firstChar) ? firstChar : "other";

	if (!(scope in packages)) {
		packages[scope] = [];
	}

	packages[scope].push(name);
}

const LIB = path.join(__dirname, "../lib/");
if (fs.existsSync(LIB)) fs.rmdirSync(LIB);

for (const [key, value] of Object.entries(packages)) {
	const dir = path.join(LIB, key);
	fs.mkdirSync(dir, { recursive: true });

	const pkgJson = createPackageJSON({ scope: key, dependencies: value });

	fs.writeFileSync(path.join(dir, "package.json"), pkgJson);
	fs.writeFileSync(path.join(dir, "index.js"), "console.log('Beep boop!');");
}
