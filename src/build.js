const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');

const { getFirstChar, getPkgJsonData, stringify } = require('./utils');

const PRETTY_PRINT_PACKAGE_JSON =
	['yes', '1', 'y'].includes(process.env.PRETTY_PRINT_PACKAGE_JSON) || false;
const SCOPES = [...'abcdefghijklmnopqrstuvwxyz', ...'1234567890'];

const packages = {};

for (const name of names) {
	const firstChar = getFirstChar(name);
	const scope = SCOPES.includes(firstChar) ? firstChar : 'other';

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
		PRETTY_PRINT_PACKAGE_JSON,
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
	PRETTY_PRINT_PACKAGE_JSON,
);
fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
fs.writeFileSync(
	path.join(dir, 'index.js'),
	"console.log('You have installed everything... but at what cost?');",
);
