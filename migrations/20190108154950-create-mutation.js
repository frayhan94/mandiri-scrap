'use strict';
module.exports = {
    up  : (queryInterface, Sequelize) => {
        return queryInterface.createTable('mutation', {
            id       : {
                allowNull    : false,
                autoIncrement: true,
                primaryKey   : true,
                type         : Sequelize.INTEGER
            },
            date     : {
                type: Sequelize.STRING
            },
            reference: {
                type: Sequelize.TEXT
            },
            debit    : {
                type: Sequelize.STRING
            },
            credit   : {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type     : Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type     : Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('mutation');
    }
};
