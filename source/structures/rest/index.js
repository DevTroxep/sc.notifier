const querystring = require('querystring');
const crypto = require('crypto');
const axios = require('axios');

const User = require('../User');
const Stream = require('../Stream');

module.exports = class RESTManager {
	constructor(manager) {
		this._response;

		this.manager = manager;

		this.authentication;
		this.authorized = false;

		this.endpoints = require('./endpoints');
		this.axios = axios.create();
	}

	async authenticate({ email, password }) {
		if (
			(!email || !password) ||
			(typeof email !== 'string' && typeof password !== 'string')
		) {
			throw new Error('Please specify a email and password.');
		}

		this.authentication = { email, password };
		return await this.axios.post(this.endpoints.authentication.login, {
			account: email,
			authtype: 0,
			isauto: 0,
			loginpw: this.md5(password),
		}).then(response => {
			/* const { headers } = response;

			if (headers['set-cookie']) {
				this.axios.defaults.headers.common['Cookie'] = headers['set-cookie']
					.map(cookie => cookie.split(';')[0])
					.join('; ');
			} */

			return response;
		}).then(async ({ data }) => {
			if (data.success) {
				this._response = data;
				this.authorized = true;

				this.axios.defaults.headers.common['Cookie'] = `sid=${data.sid}; `;
				this.manager.user = await this.fetchUser(data.user.id);

				this.manager.emit('ready');
			} else {
				throw new Error('Unable to authenticate with this account.');
			}
		});
	}

	async subscribe(channels, action = 1) {
		if (!this.authorized) {
			throw new Error('User is not authorized to perform this action, did you logged?');
		}

		return await this.axios.post(this.endpoints.actions.subscribe, {
			fFlag: action,
			uins: channels,
		}).then(({ data }) => {
			if(!data.success) {
				throw new Error(`Couldn't perform this action. (${data.msg})`);
			}

			return {
				success: data.data.successList,
				failed: data.data.failList,
			};
		});
	}

	async fetchUser(id) {
		if (!this.authorized) {
			throw new Error('User is not authorized to perform this action, did you logged?');
		}

		const parameters = this.qs({
			uid: id,
		});

		return await this.axios.get(`${this.endpoints.actions.fetch}/?${parameters}`)
			.then(({ data }) => {
				if (!data.success) {
					throw new Error(`Couldn't perform this action. (${data.msg})`);
				}

				return new User(this, data.data);
			});
	}

	async fetchStream(id) {
		if (!this.authorized) {
			throw new Error('User is not authorized to perform this action, did you logged?');
		}

		const parameters = this.qs({
			uid: id,
		});

		return await this.axios.get(`${this.endpoints.actions.fetch}/?${parameters}`)
			.then(({ data }) => {
				if (!data.success) {
					throw new Error(`Couldn't perform this action. (${data.msg})`);
				}

				return new Stream(this, data.data);
			});
	}

	async air() {
		if (!this.authorized) {
			throw new Error('User is not authorized to perform this action, did you logged?');
		}

		const parameters = this.qs({
			uin: this.manager.user.uin,
			p: 1,
			l: 10000,
		});

		return await this.axios.get(`${this.endpoints.actions.getLiveData}/?${parameters}`).then(async ({ data }) => {
			if (!data.success) {
				throw new Error(`Couldn't perform this action. (${data.msg})`);
			}

			const streaming = [];
			const value = data.data.list;

			for (let i = 0; i < value.length; i++) {
				const channel = value[i];

				if (!channel.live) continue;
				if (channel.live.status !== 1) continue;

				const stream = await this.fetchStream(channel.uin);
				stream.statistics.fans = channel.fansCount;

				streaming.push(stream);
			}

			return streaming;
		});
	}

	qs(json) {
		return querystring.stringify(json);
	}

	md5(parameter) {
		return crypto.createHash('md5')
			.update(parameter)
			.digest('hex');
	}
};