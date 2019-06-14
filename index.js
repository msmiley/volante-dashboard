const express = require('express');

//
// Export a Volante module which leverages VolanteExpress to expose a
// dashboard interface into the Volante framework.
//
module.exports = {
	name: 'VolanteDashboard',
  init() {
	},
	props: {
		title: 'volante',
		version: '0.0.0',
	},
	data: {
		io: null,
	},
	events: {
		// point VolanteExpress to the dist files for the static-built dashboard
		'VolanteExpress.update'() {
			if (require.main !== module) {
				this.$emit('VolanteExpress.use', '/dashboard', require('connect-history-api-fallback')());
				this.$emit('VolanteExpress.use', '/dashboard', express.static(__dirname + '/dist'));
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
				this.$debug('socket.io client connect');
				client.emit('volante-dashboard.info', {
					title: this.title,
					version: this.version,
				});
			  client.on('event', data => {
			  	this.$debug('socket.io event', data);
		  	});
			  client.on('disconnect', () => {
			  	this.$debug('socket.io client disconnect');
			  });
			});
		},
	},
};

if (require.main === module) {
	console.log('running test volante wheel');
	const volante = require('volante');

	let hub = new volante.Hub().debug();

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

	// set up some timers for fake events
	let cnt = 0;
	setInterval(() => {
		hub.emit(`testevent-${cnt}`, {
			count: cnt++,
			count1: cnt++,
			count2: cnt++,
			count3: cnt++,
			count4: cnt++,
			count5: cnt++,
			count6: cnt++,
			count7: cnt++,
			count8: cnt++,
			count9: cnt++,
			count10: cnt++,
			count11: cnt++,
			count12: cnt++,
			count13: cnt++,
			count14: cnt++,
			count15: cnt++,
			count16: cnt++,
		});
	}, 5000);

}