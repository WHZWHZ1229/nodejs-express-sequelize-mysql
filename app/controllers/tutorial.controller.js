const db = require("../models");
const utils = require("./utils.js")
const Tutorial = db.tutorials;
const User = db.User
const LeaveInfo = db.LeaveInfo
const Op = db.Sequelize.Op;

exports.getLeave = (req, res) => {
    const applier = req.query.applier;
    LeaveInfo.findAll({where: {applier: applier}, raw: true, order: [ ['updatedAt',  'DESC'] ]})
        .then(data => {
            res.send({ret_code: 0, ret_msg: data});
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ret_code: 1, ret_msg: "Error"});
        });
};

exports.createLeave = (req, res) => {
    // Create a Tutorial
    const LeaveInfoDetail = {
        leaveType: req.body.leaveType,
        startAt: req.body.dateValue[0],
        endAt: req.body.dateValue[1],
        description: req.body.desc,
        processed: false,
        days: req.body.daysOfLeave,
        supervisor: req.body.approvalEmail,
        applier: req.body.applier,
    };
    User.findByPk(req.body.applier).then(data => {
        const currentDays = data.dayRemain
        const changedDays = currentDays - req.body.daysOfLeave
        if (changedDays < 0) {
            res.send({
                ret_code: 1, ret_msg: "application days exceeded limits"
            });
            return;
        }
        LeaveInfo.create(LeaveInfoDetail)
            .then(data => {
                const id = req.body.applier
                User.update({dayRemain: changedDays}, {
                    where: {id: id}
                })
                    .then(num => {
                        console.log('updated user')
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send({ret_code: 1, ret_msg: "Error"});
                    });
                res.send({ret_code: 0, ret_msg: "submitted"});
            })
            .catch(err => {
                console.log(err)
                res.status(500).send({ret_code: 1, ret_msg: "Error"});
            });

    })
        .catch(err => {
            console.log(err)
            res.status(500).send({ret_code: 1, ret_msg: "Error"});
        });

};

exports.loadSession = (req, res) => {
    console.log("running session fetch")
    console.log(req.session.id)
    console.log(req.session.loginUser)
    if (req.session.loginUser) {
        res.send({username: req.session.loginUser})
    } else {
        res.send({username: null})
    }
}

exports.loginTest = (req, res) => {
    User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
}

exports.login = (req, res) => {
    console.log(req.session.id)
    // Validate request
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tutorial
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    // Save Tutorial in the database
    User.findAll({where: {id: user.username, password: user.password}})
        .then(data => {
            if (data.length !== 0) {
                req.session.regenerate(function (err) {
                    if (err) {
                        res.send({ret_code: 2, ret_msg: 'login error'});
                    }

                    req.session.loginUser = user.username;
                    res.send({ret_code: 0, ret_msg: 'success'});
                });
            } else {
                res.send({ret_code: 1, ret_msg: 'username or password error'});
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.logout = (req, res) => {
    console.log("logging out");
    console.log(req.session.id);
    console.log(req.session.loginUser);
    req.session.destroy(function (err) {
        if (err) {
            res.send({ret_code: 2, ret_msg: 'logout fail'});
            return;
        }

        // req.session.loginUser = null;
        // res.clearCookie(identityKey);
        res.send({ret_code: 0, ret_msg: 'logout'})
    });
}

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

    Tutorial.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} Tutorials were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
    Tutorial.findAll({where: {published: true}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
