/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      org_id: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      user_pw: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      lv: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    }, {
      timestamps:false,
      tableName: 'users'
    });
  };
  