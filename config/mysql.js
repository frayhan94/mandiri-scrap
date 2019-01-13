const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host            : process.env.MYSQL_HOST,
        port            : process.env.MYSQL_PORT,
        dialect         : 'mysql',
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
