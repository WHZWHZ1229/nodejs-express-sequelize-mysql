module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING
        },
        dayRemain: {
            type: Sequelize.INTEGER
        },
        password: {
            type: Sequelize.STRING
        },
    });

    return User;
};
