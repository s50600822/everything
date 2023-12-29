function stringify(str, fancy) {
	return JSON.stringify(str, null, fancy ? 2 : 0);
}

function getFirstChar(name) {
	const initialChar = name.charAt(0).toLowerCase();

	return initialChar === '@'
		? name.split('/')[1].charAt(0).toLowerCase()
		: initialChar;
}

function getPkgJsonData(packageName, scope) {
	return {
		description: `npm install ${packageName}`,
		main: 'index.js',
		contributors: [
			'PatrickJS <github@patrickjs.com>',
			'uncenter <hi@uncenter.dev>',
		],
		keywords: [
			scope ? `everything-${scope}` : null,
			'everything',
			'allthethings',
			'everymodule',
		].filter(Boolean),
		license: 'MIT',
		homepage: 'https://github.com/everything-registry/everything',
	};
}

module.exports = { stringify, getFirstChar, getPkgJsonData };
