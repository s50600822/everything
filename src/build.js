const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');

const { getFirstChar, getPkgJsonData, stringify } = require('./utils');

const PRETTY_PRINT_PACKAGE_JSON =
  ['yes', '1', 'y'].includes(process.env.PRETTY_PRINT_PACKAGE_JSON) || false;

// remap numbers to words
const NUMBERS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
// create object to remap numbers to words
const NUMBERS_MAP = NUMBERS.reduce((acc, curr, i) => {
  acc[i] = curr;
  return acc;
}, {});

const SCOPES = [...'abcdefghijklmnopqrstuvwxyz', ...'1234567890'];

const packages = {};

for (const name of names) {
  const scope = SCOPES.includes(getFirstChar(name))
    ? NUMBERS_MAP[getFirstChar(name)]
      ? NUMBERS_MAP[getFirstChar(name)]
      : getFirstChar(name)
    : 'other';

  if (!(scope in packages)) {
    packages[scope] = [];
  }
  packages[scope].push(name);
}

const LIB = path.join(__dirname, '../lib/');
if (fs.existsSync(LIB)) fs.rmSync(LIB, { recursive: true });

for (const [scope, dependencies] of Object.entries(packages)) {
  const packageName = `@everything-registry/${scope}`;
  const packageDir = path.join(LIB, scope);

  fs.mkdirSync(packageDir, { recursive: true });

  const pkgJson = stringify(
    {
      name: packageName,
      version: require('../package.json').versions.scoped,
      ...getPkgJsonData(packageName, scope),
      repository: {
        type: 'git',
        url: 'https://github.com/everything-registry/everything.git',
        directory: `lib/${scope}`,
      },
      dependencies: dependencies.reduce((acc, curr) => {
        acc[curr] = '*';
        return acc;
      }, {}),
    },
    PRETTY_PRINT_PACKAGE_JSON,
  );

  fs.writeFileSync(path.join(packageDir, 'package.json'), pkgJson);
  fs.writeFileSync(
    path.join(packageDir, 'index.js'),
    `console.log('Beep boop!');`,
  );
}

const everythingPackageDir = path.join(LIB, 'everything');
fs.mkdirSync(everythingPackageDir, { recursive: true });
const packageName = `everything`;

const everythingPkgJson = stringify(
  {
    name: packageName,
    version: require('../package.json').versions.main,
    ...getPkgJsonData(packageName),
    repository: {
      type: 'git',
      url: 'https://github.com/everything-registry/everything.git',
      directory: `lib/${packageName}`,
    },
    dependencies: Object.keys(packages).reduce((acc, curr) => {
      acc[`@everything-registry/${curr}`] =
        require('../package.json').versions.scoped;
      return acc;
    }, {}),
  },
  PRETTY_PRINT_PACKAGE_JSON,
);
fs.writeFileSync(
  path.join(everythingPackageDir, 'package.json'),
  everythingPkgJson,
);
fs.writeFileSync(
  path.join(everythingPackageDir, 'index.js'),
  "console.log('You have installed everything... but at what cost?');",
);
