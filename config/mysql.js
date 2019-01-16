const config = require('../config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.get('DB_NAME'),
    config.get('DB_USER'),
    config.get('DB_PASS'),
    {
        host            : config.get('DB_HOST'),
        port            : config.get('DB_PORT'),
        dialect         : config.get('DB_DIALECT'),
        logging         : false,
        operatorsAliases: Sequelize.Op,
        pool            : {
            max    : 5,
            min    : 0,
            acquire: 30000,
            idle   : 10000
        },
        timezone        : '+07:00'
    });

sequelize
    .authenticate()
    .then(() => {
        console.log('MYSQL Connection has been established successfully.');
    })
    .catch(err => {
        console.error('MYSQL Unable to connect to the database:', err);
    });


module.exports = sequelize;
