'use strict';

const Sequelize = require('sequelize');
const db = require('../config/mysql');
const mutation = db.define('mutation', {
    date     : Sequelize.STRING,
    reference: Sequelize.TEXT,
    debit    : Sequelize.STRING,
    credit   : Sequelize.STRING
}, {
    tableName: 'mutation'
});

module.exports = mutation;





