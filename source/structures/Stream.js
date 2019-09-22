const User = require('./User');

module.exports = class Stream {
	constructor(manager, response) {
		this._manager = manager;

		this._raw = response;
		this._author = response.user;
		this._stream = response.liveinfo;

		this.fetch();
	}

	async fetch() {
		this.title = this._stream.live_title;
		this.statistics = {
			views: this._stream.view_count,
		};

		this.thumbnail = this._stream.cover;
		this.game = {
			id: this._stream.game_id,
			name: this._stream.game_name,
		};

		this.streamer = new User(this._manager, this._raw);
		this.streaming = this._raw.streams.RecvRtmpResolutionList.length >= 1;
	}
};