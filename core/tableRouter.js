'use strict';

exports.writeRoutes = (routes) => {
	if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
		const Table = require('cli-table');
		let table = new Table({ head: ['Method', 'Path'] });

		for (let key in routes) {
			if (routes.hasOwnProperty(key)) {
				if (routes[key].route) {
					let _o = {};
					_o[routes[key].route.stack[0].method.toUpperCase()] = routes[key].route.path;
					table.push(_o);
				}
			}
		}

		console.log(table.toString());
	}
};