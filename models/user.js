module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define("User", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    lastname: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    username: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastLogin: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM("active", "inactive"),
      defaultValue: "active"
    },

    profilepic: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:
        "http://mainenordmenn.com/wp-content/uploads/2017/09/Maine-Nordmenn-Board-Generic-Profile.jpg"
    }
  });

  User.associate = function(models) {
    models.User.hasMany(models.Message);
  };
  return User;
};
