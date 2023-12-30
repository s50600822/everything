const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');

const { getFirstChar, getPkgJsonData, stringify } = require('./utils');

const PRETTY_PRINT_PACKAGE_JSON =
  ['yes', '1', 'y', 'true'].includes(process.env.PRETTY_PRINT_PACKAGE_JSON) ||
  false;

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
        url: 'git+https://github.com/everything-registry/everything.git',
        directory: `lib/${scope}`,
      },
      dependencies: dependencies.reduce((acc, curr) => {
        acc[curr] = '*';
        return acc;
      }, {}),
    },
    PRETTY_PRINT_PACKAGE_JSON,
  );
  const packageFile = path.join(packageDir, 'package.json');
  fs.writeFileSync(packageFile, pkgJson);

  // grab package.json file size
  const stats = fs.statSync(packageFile);
  // size in bytes
  const fileSizeInBytes = stats.size;
  // Convert it to megabytes (MB)
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  let fileSizeToDisplay;

  if (fileSizeInMegabytes < 1) {
    // round to 6 decimal places for files < 1MB
    fileSizeToDisplay = Math.round(fileSizeInMegabytes * 1e6) / 1e6;
  } else if (fileSizeInMegabytes < 10) {
    // round to 2 decimal places for file sizes 1MB-10MB
    fileSizeToDisplay = Math.round(fileSizeInMegabytes * 100) / 100;
  } else {
    // round to whole number for file sizes > 10MB
    fileSizeToDisplay = Math.round(fileSizeInMegabytes);
  }
  const msg = `package ${packageName} has the size of ${fileSizeToDisplay}mb`;
  if (fileSizeInMegabytes > 10) {
    console.warn(`WARNING: ${packageName} is larger than 10mb!`);
  }

  console.log(msg);
  fs.writeFileSync(
    path.join(packageDir, 'index.js'),
    `console.log('Beep boop! ${msg}');`,
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
      url: 'git+https://github.com/everything-registry/everything.git',
    },
    dependencies: Object.keys(packages).reduce((acc, curr) => {
      acc[`@everything-registry/${curr}`] =
        require('../package.json').versions.scoped;
      return acc;
    }, {}),
  },
  PRETTY_PRINT_PACKAGE_JSON,
);
const packageFile = path.join(everythingPackageDir, 'package.json');
fs.writeFileSync(packageFile, everythingPkgJson);
// grab package.json file size
const stats = fs.statSync(packageFile);
// size in bytes
const fileSizeInBytes = stats.size;
// Convert it to megabytes (MB)
const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
let fileSizeToDisplay;

if (fileSizeInMegabytes < 1) {
  // round to 6 decimal places for files < 1MB
  fileSizeToDisplay = Math.round(fileSizeInMegabytes * 1e6) / 1e6;
} else if (fileSizeInMegabytes < 10) {
  // round to 2 decimal places for file sizes 1MB-10MB
  fileSizeToDisplay = Math.round(fileSizeInMegabytes * 100) / 100;
} else {
  // round to whole number for file sizes > 10MB
  fileSizeToDisplay = Math.round(fileSizeInMegabytes);
}
const msg = `package ${packageName} has the size of ${fileSizeToDisplay}mb`;
if (fileSizeInMegabytes > 10) {
  console.warn(`WARNING: ${packageName} is larger than 10mb!`);
}

console.log(msg);
fs.writeFileSync(
  path.join(everythingPackageDir, 'index.js'),
  "console.log('You have installed everything... but at what cost?');",
);
