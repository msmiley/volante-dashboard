const express = require('express');

//
// Export a Volante module which leverages VolanteExpress to expose a
// dashboard interface into the Volante framework.
//
module.exports = {
	name: 'VolanteDashboard',
  init() {
	},
	events: {
		'VolanteExpress.update'() {
			if (require.main !== module) {
				this.$emit('VolanteExpress.use', express.static(__dirname + '/dist'))
			}
		},
	},
};

if (require.main === module) {
	console.log('running test volante wheel')
	const volante = require('volante');

	let hub = new volante.Hub().debug();
	
	hub.on('volante.log', (d) => {
		console.log(d);
	});
	
	hub.attachAll().attachFromObject(module.exports)
	
	// set up hot-reload webpack environment for dev
	const webpack = require('webpack');
  const webpackConfig = require('./build/webpack.dev.config.js');
	const compiler = webpack(webpackConfig);
	
	hub.emit('VolanteExpress.update', {
		bind: '0.0.0.0',
		middleware: [
			require('webpack-hot-middleware')(compiler, {
		    log: false,
		    heartbeat: 2000
		  }),
			require('connect-history-api-fallback')(),
			require('webpack-dev-middleware')(compiler, {
		    publicPath: '/',
		    logLevel: 'silent',
		  }),
		],
	});
	
	hub.emit('VolanteExpress.start');
}