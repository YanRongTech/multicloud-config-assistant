#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const mysql = require('../lib/mysql');
const config = require('../lib/config');
const sql = require('../lib/sql');
const YAML = require('yamljs');

let serviceStr = '';

for (let key in config.services) {
    if (!config.services.hasOwnProperty(key)) {
        continue;
    }

    serviceStr += `[${key}] ${config.services[key]} \n`;
}

const temp = yargs.command('config', 'config the multicloud-configurations', (yargs) => {
    yargs.option('host', {
        demand: true,
        default: '127.0.0.1',
        describe: 'the host of the config service\'s database.',
        type: 'string'
    }).option('port', {
        demand: false,
        default: '3306',
        describe: 'the port of the config service\'s database.',
        type: 'string'
    }).option('username', {
        demand: true,
        describe: 'the user of the config service\'s database.',
        type: 'string'
    }).option('password', {
        demand: true,
        describe: 'the password of the config service\'s database.',
        type: 'string'
    }).option('database', {
        demand: false,
        default: 'config',
        describe: 'the name of the config service\'s database.',
        type: 'string'
    }).option('services', {
        demand: true,
        describe: 'the service id list. You can choose these.\n' + serviceStr,
        type: 'string'
    }).option('env', {
        alias: 'environment',
        demand: false,
        default: 'production',
        describe: 'the env of the service\'s configuration.',
        type: 'string'
    }).usage('Usage: multicloud config [options]')
        .example('multicloud config --host=127.0.0.1 --port=3306 --username=root --password=root --database=config --services=2,3', '')
        .help('h')
        .alias('h', 'help')
        .epilog('copyright Yanrong Tech 2017.');
}, (argv) => {
    const serviceIds = argv.services.split(',').filter(id => id);
    const conn = mysql.getConn(argv);
    conn.connect();

    const promises = [];
    serviceIds.forEach(function (id) {
        const file = readServiceConfigFile(id);
        const configuration = compileConfig(file.toString());

        promises.push(updateServiceConfig(conn, id, argv.environment, configuration));
    });

    Promise.all(promises).then(function () {
        conn.end();
        process.exit(0);
    }).catch(function (err) {
        throw err;
    });
}).usage('Usage: multicloud config -h for details')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright Yanrong Tech 2017.').argv;

function compileConfig(configuration) {
    const commonConfig = YAML.load(path.resolve(__dirname, '../configs', 'application.yml'));
    for (let key in commonConfig) {
        if (!commonConfig.hasOwnProperty(key)) {
            continue;
        }

        const re = new RegExp('\\$\\{' + key + '\\}', 'g');
        configuration = configuration.replace(re, commonConfig[key]);
    }

    return configuration;
}

function readServiceConfigFile(serviceId) {
    if (!config.services[serviceId]) {
        throw new Error(`The service id ${serviceId} is not exist.`);
    }

    const service = config.services[serviceId];

    return fs.readFileSync(path.resolve(__dirname, '../configs', service + '.yml'));
}

function updateServiceConfig(conn, serviceId, env, configuration) {
    if (!config.services[serviceId]) {
        throw new Error(`The service id ${serviceId} is not exist.`);
    }

    const service = config.services[serviceId];
    const now = new Date().getTime();
    return new Promise(function (resolve, reject) {
        conn.query(sql.getInsertServiceSql(service, now), function (error, results) {
            if (error && error.code !== 'ER_DUP_ENTRY') throw error;

            conn.query(sql.getInsertConfigSql(serviceId, env, 'yml', 1, configuration, now), function (error, results) {
                if (error && error.code !== 'ER_DUP_ENTRY') throw error;

                if (error && error.code === 'ER_DUP_ENTRY') {
                    conn.query(sql.getUpdateConfigSql(serviceId, env, configuration, now), function (error, results) {
                        conn.end(function () {

                        });

                        console.log(`config the ${service} success.`);
                        resolve();
                    });
                } else {
                    conn.end(function () {

                    });

                    console.log(`config the ${service} success.`);
                    resolve();
                }
            });
        });
    });

}