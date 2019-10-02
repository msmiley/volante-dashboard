const express = require('express');
const connectHistoryApiFallback = require('connect-history-api-fallback');
const socketIo = require('socket.io');

//
// Export a Volante module which leverages VolanteExpress to expose a
// dashboard interface into the Volante framework.
//
module.exports = {
	name: 'VolanteDashboard',
  init() {
  	this.updateStats();
  	// start timer to send stats to all clients
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
		logCache: [],
	},
	events: {
		// point VolanteExpress to the dist files for the static-built dashboard
		'VolanteExpress.update'() {
			if (require.main !== module) {
				this.$emit('VolanteExpress.use', '/dashboard', (req, res, next) => {
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
						return res.status(401).send();
					}
					next();
				});
				this.$emit('VolanteExpress.use', '/dashboard', connectHistoryApiFallback({
					index: '//index.html',
				}));
				this.$emit('VolanteExpress.use', '/dashboard', express.static(__dirname + '/dist'));
			}
		},
		// start socket.io when express is ready
		'VolanteExpress.listening'(obj) {
			this.startSocketIO(obj.server);
		},
		// catch all volante events and forward to all clients
		'*'(...args) {
			this.lastEvents++;
			this.totalEvents++;
			if (this.io) {
				this.io.emit('*', ...args);
			}
		},
		'hello.world'(...args) {
			if (typeof args[args.length -1] === 'function') {
				let callback = args.pop();
				callback(null, args);
			}
		},
	},
	methods: {
		startSocketIO(server) {
			this.$debug('adding socket.io');
			this.io = socketIo(server);
			this.io.on('connection', (client) => {
				this.$debug('socket.io client connect');
				client.emit('volante-dashboard.info', {
					title: this.title,
					version: this.version,
				});
				this.sendVolanteInfo(client);
				// receive events from client side to re-emit on volante
			  client.on('event', (data) => {
			  	this.$debug('socket.io event from client', data);
			  	if (data.eventCallback) {
			  		// if eventCallback set, add a callback to the end the event args
			  		// for the handler to call
			  		data.eventArgs.push(function (err, result) {
			  			client.emit('callback-result', [err, result]);
			  		});
			  	}
			  	this.$emit(data.eventType, ...data.eventArgs);
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

			// gather connected client info
			let clients = [];
			if (this.io) {
				for (let v of Object.values(this.io.sockets.sockets)) {
					clients.push({
						ip: v.handshake.address,
						ua: v.handshake.headers['user-agent'],
						since: v.handshake.time,
						secure: v.handshake.secure,
					});
				}
			}

			// add to stats history
			this.stats.push({
				ts: new Date(),
				events: this.lastEvents,
				cpu: cpuPerc,
				memory: process.memoryUsage().rss,
				clients,
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
}