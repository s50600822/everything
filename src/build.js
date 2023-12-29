const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');

const { getFirstChar, getPkgJsonData } = require('./utils');

const scopes = [
	...'abcdefghijklmnopqrstuvwxyz'.split(''),
	...'1234567890'.split(''),
];

const packages = {};

for (const name of names) {
	const firstChar = getFirstChar(name);
	const scope = scopes.includes(firstChar) ? firstChar : 'other';

	if (!(scope in packages)) {
		packages[scope] = [];
	}

	packages[scope].push(name);
}

const LIB = path.join(__dirname, '../lib/');
if (fs.existsSync(LIB)) fs.rmSync(LIB, { recursive: true });

for (const [scope, dependencies] of Object.entries(packages)) {
	const dir = path.join(LIB, scope);
	fs.mkdirSync(dir, { recursive: true });

	const pkgJson = JSON.stringify({
		name: `@everything-registry/${scope}`,
		...getPkgJsonData(),
		dependencies: dependencies.reduce((acc, curr) => {
			acc[curr] = '*';
			return acc;
		}, {}),
	});

	fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
	fs.writeFileSync(path.join(dir, 'index.js'), "console.log('Beep boop!');");
}

const dir = path.join(LIB, 'everything');
fs.mkdirSync(dir, { recursive: true });
const pkgJson = JSON.stringify({
	name: `everything`,
	...getPkgJsonData(),
	dependencies: Object.keys(packages).reduce((acc, curr) => {
		acc[`@everything-registry/${curr}`] = require('../package.json').version;
		return acc;
	}, {}),
});
fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
fs.writeFileSync(path.join(dir, 'index.js'), "console.log('Beep boop!');");
