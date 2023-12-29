const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');
const fancyPackage = process.env.FANCY_PACKAGE || false;

const { getFirstChar, getPkgJsonData, stringify } = require('./utils');

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
	const packageName = `@everything-registry/${scope}`;
	const dir = path.join(LIB, scope);
	fs.mkdirSync(dir, { recursive: true });

	const pkgJson = stringify(
		{
			name: packageName,
			...getPkgJsonData(packageName, scope),
			dependencies: dependencies.reduce((acc, curr) => {
				acc[curr] = '*';
				return acc;
			}, {}),
		},
		fancyPackage,
	);

	fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
	fs.writeFileSync(
		path.join(dir, 'index.js'),
		`console.log('Beep boop!', '${packageName}');`,
	);
}

const dir = path.join(LIB, 'everything');
fs.mkdirSync(dir, { recursive: true });
const pkgJson = stringify(
	{
		name: `everything`,
		...getPkgJsonData(),
		dependencies: Object.keys(packages).reduce((acc, curr) => {
			acc[`@everything-registry/${curr}`] = require('../package.json').version;
			return acc;
		}, {}),
	},
	fancyPackage,
);
fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
fs.writeFileSync(
	path.join(dir, 'index.js'),
	"console.log('You have installed everything... but at what cost?');",
);
