'use strict';

const models = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const User = models.User;
const sequelize = models.sequelize;

const app = express();
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 

function validateUserId(userId, res) {
    if (isNaN(userId)) {
        res.status(500).json({
            error: 'Invalid user ID supplied'
        });
        return false;
    }
    return true;
}

app.get('/', function(req, res) {
    res.send('All requests can be accessed under /user<br />' +
        'POST to create, GET to retrieve all,<br />' + 
        '/user/id to get a specific user,<br />' + 
        'DELETE to delete funnily enough :)');
});

app.get('/user', function(req, res) {
    User.findAll().then(users => {
        res.json(users);
    });
});

app.post('/user', function(req, res) {
    let strippedUser = Object.assign({}, req.body);
    delete strippedUser.id;

    User.create(strippedUser).then(user => {
        res.redirect('/user/' + user.id);
    }).catch(err => {
        res.status(500).json({
            error: 'There was an issue creating this user',
            errors: err.errors
        });
    });
});

app.get('/user/:userId', function(req, res) {
    if (!validateUserId(req.params.userId, res)) {
        return;
    }
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        if (user === null) {
            throw Error("User not found");
        }
        res.json(user);
    }).catch(() => {
        res.status(404).json({
            error: 'Unable to find this user'
        });
    });
});

app.delete('/user/:userId', function(req, res) {
    if (!validateUserId(req.params.userId, res)) {
        return;
    }
    User.destroy({
        where: {
            id: req.params.userId
        }
    }).then(() => {
        res.status(200);
    }).catch(() => {
        res.status(404).json({
            error: 'Unable to find this user'
        });
    });
});


sequelize.authenticate().then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
}).then(() => {
    return app.listen(3000, () => {
        console.log('API is now running, connect via http://localhost:3000');
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = app;
