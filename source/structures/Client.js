const { EventEmitter } = require('events');
const RESTManager = require('./rest');

module.exports = class Client extends EventEmitter {
	constructor(options = {}) {
		super();

		this.rest = new RESTManager(this);
		this.database = require('../database');

		this.options = options;
		this.interval;
		this.cache = {};

		this.user;
		this.channels = {
			fetch: id => this.rest.fetchUser(id),
		};
	}

	follow(channels) {
		if (typeof channel === 'string') {
			channels = [channels];
		}

		return this.rest.subscribe(channels, 1);
	}

	unfollow(channels) {
		if (typeof channel === 'string') {
			channels = [channels];
		}

		return this.rest.subscribe(channels, 2);
	}

	online() {
		return this.rest.air();
	}

	async login({ email, password }) {
		return await this.rest.authenticate({ email, password })
			.then(() => this.startInterval());
	}

	startInterval() {
		if (this.interval) {
			clearInterval(this.interval);
		}

		this.interval = setInterval(async () => {
			try {
				const online = await this.online();
				const cached = this.database
					.get('streaming')
					.value();

				for (const uin in cached) {
					const streaming = online.map(channel => channel.streamer.uin.toString());

					if (!streaming.includes(uin.toString())) {
						this.emit('stopped', this.cache[uin]);
						this.database
							.unset(`streaming.${uin}`)
							.write();

						delete this.cache[uin];
					}
				}

				for (let i = 0; i < online.length; i++) {
					const channel = online[i];

					const database = this.database.get(`streaming.${channel.streamer.uin}`);
					const date = new Date(database.value());

					console;

					if (!this.cache[channel.streamer.uin] && !database.value()) {
						this.database
							.set(`streaming.${channel.streamer.uin}`, +new Date())
							.write();

						this.cache[channel.streamer.uin] = channel;
						this.emit('streaming', channel);
					}
				}
			} catch (error) {
				// Ignore.
			}
		}, this.options.interval || 2500);
	}
};