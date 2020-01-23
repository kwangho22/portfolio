/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('boards', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      writer: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      catagory: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      views: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
    }, {
      timestamps:true,
      tableName: 'boards'
    });
  };
  