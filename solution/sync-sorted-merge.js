'use strict'
const util = require('util');
const _ = require('lodash');
const log = require('./log');

module.exports = (logSources, printer) => {

	let logSourcesWithFirstLogStmts = [];

	//Pop one log entry from each of the logSources
	_.forEach(logSources, (logSource) => {
		logSourcesWithFirstLogStmts.push({
			top: logSource.pop(), source: logSource
		});
	});

	do {
		//Sort the top logs from each logSource chronologically (ascending order).
		logSourcesWithFirstLogStmts = _.sortBy(logSourcesWithFirstLogStmts, [(item) => {
			return new Date(item.top.date);
		}]);

		//The first item in logSourcesWithFirstLogStmts is the earliest item w.r.t. the order in which it has occurred.
		printer.print({
			date: logSourcesWithFirstLogStmts[0].top.date,
			msg: logSourcesWithFirstLogStmts[0].top.msg
		});

		//Now pop one more log from the same logSource since the previous one from this logSource is already sent to printer.
		logSourcesWithFirstLogStmts[0].top = logSourcesWithFirstLogStmts[0].source.pop();

		//Remove items from logSourcesWithFirstLogStmts, whose logSource is done with all the logs.
		logSourcesWithFirstLogStmts = _.remove(logSourcesWithFirstLogStmts, (item) => {
			return item.top !== false;
		});

	} while (logSourcesWithFirstLogStmts.length > 0);	//Break when all the logs are emptied from all the logSources.
};