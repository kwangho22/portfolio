/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('comments', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      
      boardId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      writer: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
    }, {
      timestamps:true,
      tableName: 'comments'
    });
  };
  