const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password');

const User = sequelize.define('user', {
  email: {
      type: Sequelize.STRING(200),
      validate: { isEmail: true }
  },
  forename: {
      type: Sequelize.STRING(30),
      validate: { isAlpha: true },
  },
  surname:  {
      type: Sequelize.STRING(30),
      validate: { isAlpha: true },
  },
//  created: Sequelize.DATE,
}, {
    timestamps: true,
    updatedAt: false
});
