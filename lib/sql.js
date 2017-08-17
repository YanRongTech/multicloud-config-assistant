exports.getInsertServiceSql = function (service, time) {
    return `insert into service (name, created_at, updated_at) values('${service}', ${time}, ${time})`;
};

exports.getInsertConfigSql = function (serviceId, env, ext, version, configuration, time) {
    return `insert into config 
        (service_id, environment, extension, version, config, created_at, updated_at) values
        (${serviceId}, '${env}', '${ext}', ${version}, '${configuration}', ${time}, ${time})
    `;
};

exports.getUpdateConfigSql = function (serviceId, env, configuration, time) {
    return `update config 
        set config = '${configuration}', updated_at = ${time} 
        where service_id = ${serviceId} and environment = '${env}'
    `;
};