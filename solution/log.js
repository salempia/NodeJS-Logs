'use strict';

const util = require('util');

class log {
	static textMessageToConsole(message, obj) {
		console.log(`\n ${message}`);
		console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
	}

	static objectToConsole(obj) {
		console.log('\n' + util.inspect(obj, {showHidden: false, depth: null, colors: true}));
	}
}

module.exports = log;