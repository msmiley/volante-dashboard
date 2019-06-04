const express = require('express');

//
// Export a Volante module which leverages VolanteExpress to expose a
// dashboard interface into the Volante framework.
//
module.exports = {
	name: 'VolanteDashboard',
  init() {
	},
	data: {
		io: null,
	},
	events: {
		// point VolanteExpress to the dist files for the static-built dashboard
		'VolanteExpress.update'() {
			if (require.main !== module) {
				this.$emit('VolanteExpress.use', express.static(__dirname + '/dist'));
			}
		},
		// start socket.io when express is ready
		'VolanteExpress.listening'(obj) {
			this.startSocketIO(obj.server);
		},
		// catch all volante events and forward to browser
		'*'(...args) {
			if (this.io) {
				this.io.emit('*', ...args);
			}
		},
	},
	methods: {
		startSocketIO(server) {
			this.$debug('adding socket.io');
			this.io = require('socket.io')(server);
			this.io.on('connection', client => {
			  client.on('event', data => {
			  	console.log('event', data);
		  	});
			  client.on('disconnect', () => {
			  	console.log('client disconnect');
			  });
			});
		},
	},
};

if (require.main === module) {
	console.log('running test volante wheel');
	const volante = require('volante');

	let hub = new volante.Hub().debug();

	hub.on('volante.log', (d) => {
		console.log(d);
	});

	hub.attachAll().attachFromObject(module.exports);

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
	hub.on('VolanteExpress.listening', (o) => {
		console.log(`listening on http://${o.bind}:${o.port}`);
	});
	hub.emit('VolanteExpress.start');
}