const mysql = require('mysql');

let conn = null;

exports.getConn = function (config) {
    if (!conn) {
        conn = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });
    }

    return conn;
};

exports.releaseConn = function () {
    if (conn) {
        conn.destroy();
    }
};