'use strict'
const promise = require('bluebird');
const _ = require('lodash');
const log = require('./log');

module.exports = (logSources, printer) => {

	//Pop one log entry from each of the logSources
	promise.resolve(enqueueParsing(logSources)).mapSeries((logSourceWithFirstLogStmt) => {

		return logSourceWithFirstLogStmt;
	}).then(function (logSourcesWithFirstLogStmts) {

		getChronologicallyFirstLog(logSourcesWithFirstLogStmts, printer).then((log) => {

		}).catch((exception) => {
			log.objectToConsole(exception);
		});
	});
};


const getChronologicallyFirstLog = (logSourcesWithFirstLogStmts, printer) => {
	return new Promise((resolve, reject) => {
		logSourcesWithFirstLogStmts[0].source.popAsync().then((poppedLog) => {

			logSourcesWithFirstLogStmts[0].top = poppedLog;

			//Sort the top logs from each logSource chronologically (ascending order).
			logSourcesWithFirstLogStmts = _.sortBy(logSourcesWithFirstLogStmts, [(item) => {
				return new Date(item.top.date);
			}]);

			//The first item in logSourcesWithFirstLogStmts is the earliest item w.r.t. the order in which it has occurred.
			printer.print({
				date: logSourcesWithFirstLogStmts[0].top.date,
				msg: logSourcesWithFirstLogStmts[0].top.msg
			});

			//Remove items from logSourcesWithFirstLogStmts, whose logSource is done with all the logs.
			logSourcesWithFirstLogStmts = _.remove(logSourcesWithFirstLogStmts, (item) => {
				return item.top !== false;
			});

			if (logSourcesWithFirstLogStmts.length > 0) {//Break when all the logs are emptied from all the logSources.
				getChronologicallyFirstLog(logSourcesWithFirstLogStmts, printer).then((result) => {
					resolve(result[0].top);
				});
			}
		}).catch((exception) => {
			reject(exception);
		});
	});
};

const enqueueParsing = (logSources) => {
	return logSources.map(function (logSource) {
		return logSource.popAsync().then((poppedLog) => {
			return {
				top: poppedLog,
				source: logSource
			};
		});
	});
};