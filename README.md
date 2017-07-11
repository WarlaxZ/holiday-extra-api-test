# holiday-extra-api-test
Holiday Extras - Web Development API Task


See https://github.com/holidayextras/culture/blob/master/recruitment/developer-API-task.md for specific task

See https://github.com/holidayextras/culture/blob/master/recruitment/introduction.md for all tasks.

This project is written in NodeJS using express and sequelize

All API requests can be accessed via /user

* GET /user - This is a list of all users in the system
* GET /user/id - This is information about a specific user
* POST /user - This is used to create a user
* DELETE /user/id - Use this to delete users


Note to start the project use "npm start".

To run the unit tests and check code coverage use "npm test".


For the sake of this being a demo I have just used sqlite however obviously this wouldn't be done in a production system. And again in production you would probably want some level of access control over this, that said I believe this test was more to prove that you can write a correct and functional CRUD API.
