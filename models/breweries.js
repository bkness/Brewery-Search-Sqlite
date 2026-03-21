const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Brewery extends Model {}

Brewery.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    refid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    city: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    state: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    zipcode: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    phone: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    website: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    latitude: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    longitude: { type: DataTypes.STRING, defaultValue: '', allowNull: false },
    remark: { type: DataTypes.STRING, allowNull: true },
    comments: { type: DataTypes.STRING, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'user', key: 'id' },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'brewery',
  }
);

module.exports = Brewery;
