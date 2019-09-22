const { join } = require('path');

const FileAdapter = require('lowdb/adapters/FileSync');
const lowdb = require('lowdb');

const archive = new FileAdapter(join(__dirname, '../cache.json'));
const database = lowdb(archive);

database
	.defaults({ startup: +new Date(), streaming: {} })
	.write();

module.exports = database;