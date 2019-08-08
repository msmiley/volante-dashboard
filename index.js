const express = require('express');

//
// Export a Volante module which leverages VolanteExpress to expose a
// dashboard interface into the Volante framework.
//
module.exports = {
	name: 'VolanteDashboard',
  init() {
  	this.updateStats();
  	this.timer = setInterval(() => {
  		this.updateStats();
  		this.sendVolanteInfo(this.io);
		}, this.statsInterval);
	},
	done() {
		this.timer && clearInterval(this.timer);
	},
	props: {
		title: 'volante',
		version: '0.0.0',
		statsInterval: 5000,
		statsHistory: 60,
		user: '',
		pass: '',
	},
	data: {
		io: null,
		timer: null,
		lasthrtime: process.hrtime(),
		lastUsage: process.cpuUsage(),
		totalEvents: 0,
		lastEvents: 0,
		stats: [],
	},
	events: {
		// point VolanteExpress to the dist files for the static-built dashboard
		'VolanteExpress.update'() {
			if (require.main !== module) {
				this.$emit('VolanteExpress.use', '/dashboard/*', (req, res, next) => {
					if (this.user.length > 0 && this.pass.length > 0) {
						if (req.headers.authorization) {
							// check authorization header
							let userpass = Buffer.from(req.headers.authorization.split('Basic ')[1], 'base64').toString();
							let [user, pass] = userpass.split(':');
							if (user === this.user && pass === this.pass) {
								return next();
							}
						}
						res.set('WWW-Authenticate', 'Basic');
						res.status(401).send();
					} else {
						next();
					}
				});
				this.$emit('VolanteExpress.use', '/dashboard', require('connect-history-api-fallback')());
				this.$emit('VolanteExpress.use', '/dashboard', express.static(__dirname + '/dist'));
			}
		},
		// start socket.io when express is ready
		'VolanteExpress.listening'(obj) {
			this.startSocketIO(obj.server);
		},
		// catch all volante events and forward to all browsers
		'*'(...args) {
			this.lastEvents++;
			this.totalEvents++;
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
				this.sendVolanteInfo(client);
			  client.on('event', data => {
			  	this.$debug('socket.io event', data);
		  	});
			  client.on('disconnect', () => {
			  	this.$debug('socket.io client disconnect');
			  });
			});
		},
		updateStats() {
			// update last values
			this.lasthrtime = process.hrtime(this.lasthrtime);
			this.lastUsage = process.cpuUsage(this.lastUsage);

			// calculate cpu
			let elapTimeMS = this.hrtimeToMS(this.lasthrtime);
			let elapUserMS = this.lastUsage.user / 1000;
			let elapSysMS = this.lastUsage.system / 1000;
			let cpuPerc = Math.round(100 * (elapUserMS + elapSysMS) / elapTimeMS);

			this.stats.push({
				ts: new Date(),
				events: this.lastEvents,
				cpu: cpuPerc,
				memory: process.memoryUsage().rss,
			});
			// slice stats to length=statsHistory
			if (this.stats.length > this.statsHistory) {
				this.stats.shift();
			}
			// reset interval event counter
			this.lastEvents = 0;
		},
		sendVolanteInfo(dest) {
			let info = {
				wheel: this.$hub.getAttached(),
				uptime: this.$hub.getUptime(),
				stats: this.stats,
			};
			dest.emit('volante.info', info);
		},
		hrtimeToMS(hrtime) {
			return hrtime[0] * 1000 + hrtime[1] / 1000000;
		}
	},
};

if (require.main === module) {
	console.log('running test volante wheel');
	const volante = require('volante');

	let hub = new volante.Hub().debug();

	hub.attachAll().attachFromObject(module.exports);

	hub.attachFromObject({
		name: 'TestSpoke',
		init() {
			setInterval(() => {
				this.counter++;
			}, 1000);
		},
		props: {
			counter: 0,
		},
	});

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