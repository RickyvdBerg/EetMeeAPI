var mysql = require('mysql');
var config = require('../config/config.js');

const connectionSettings = {
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name,
    port: CONFIG.db_port,
    debug: false
}
const reconnectTimeout = 2000; // ms.

var connection;

// http://sudoall.com/node-js-handling-mysql-disconnects/
function handleDisconnect() {
    connection = mysql.createConnection(connectionSettings);

    connection.connect(function (error) {
        if (error) {
            console.error('Error connecting to database ' + connectionSettings.database + ' on ' + connectionSettings.host + ': ' + error.message);
            connection.end();
            setTimeout(handleDisconnect, reconnectTimeout);
        } else {
            console.log('Connected to database ' + connectionSettings.database + ' on ' + connectionSettings.host + ', state = ' + connection.state);
        }
    });
    connection.on('error', function (error) {
        if (error.code === 'ECONNRESET') {
            console.error('Connection state = ' + connection.state + ' - reconnecting');
            connection.end();
            handleDisconnect();
        } else {
            console.error('Connection ERROR - database ' + connectionSettings.database + ' on ' + connectionSettings.host + ': ' + error.message);
            connection.end();
            handleDisconnect();
        }
    });
}

handleDisconnect();

module.exports = connection;