module.exports = (sequelize, Sequelize) => {
    const LeaveInfo = sequelize.define("LeaveInfo", {
        leaveType:{
            type: Sequelize.STRING
        },
        startAt: {
            type: Sequelize.DATE
        },
        endAt: {
            type: Sequelize.DATE
        },
        description:{
            type: Sequelize.STRING
        },
        processed:{
            type: Sequelize.BOOLEAN
        },
        days:{
            type: Sequelize.INTEGER
        },
        supervisor:{
            type: Sequelize.STRING
        },
        applier:{
            type: Sequelize.STRING
        },
    });

    return LeaveInfo;
};
