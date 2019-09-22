module.exports = {
	information: 'https://webapi.streamcraft.com/tools/common/info',
	actions: {
		getFollowing: 'https://webapi.streamcraft.com/ucenter/follow/getFollowLiveCount',
		getFollowers: 'https://webapi.streamcraft.com/ucenter/follow/getFollowerCount',
		getFollowedGames: 'https://webapi.streamcraft.com/ucenter/follow/getFollowedGameCount',

		getLiveData: 'https://webapi.streamcraft.com/ucenter/follow/getFollowerList',
		subscribe: 'https://webapi.streamcraft.com/ucenter/follow/followUser',
		fetch: 'https://webapi.streamcraft.com/live/room/anchorinfo',
	},

	authentication: {
		login: 'https://webapi.streamcraft.com/login',
	},
};