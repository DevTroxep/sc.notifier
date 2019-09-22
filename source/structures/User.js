module.exports = class User {
	constructor(manager, { user: member }) {
		this._manager = manager;

		this.uin = member.uin;
		this.scid = member.scid;

		this.username = member.nickname;
		this.avatar = member.avatar;
		this.language = member.lang;

		this.sex = member.sex;
		this.level = {
			number: member.lvl_id,
			icon: member.lvl_icon,
		};
	}

	async stream() {
		return await this._manager.fetchStream(this.scid);
	}
};