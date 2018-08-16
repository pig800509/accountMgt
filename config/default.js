/**
 * Sample code for showing how to connect mongoose
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase', {   //accountManagement
	useNewUrlParser: true
});

//add some info about database connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'db connect success'));
db.once('open', function () {
	console.log('db connect success');
})


//another way to use config
module.exports = {
	'service': {
		'name': 'accountManagement'
	},
	'server': {
		'port': 3000
	},
	'tokenCert': 'wiCommPlatform',
	'database': {
		'uri': 'mongodb://localhost:27017/myDatabase',   //accountManagement
		'collection': 'account'
	},
	'logServer': {
		'url': 'http://localhost:4000',
		'logger': 'Account Management'
	}
};