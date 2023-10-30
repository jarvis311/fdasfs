import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class CarTrim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  CarTrim.init({
    car_trim_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    car_model_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'CarTrim',
    tableName: 'car_trim',
    timestamps: false
  });
  export default CarTrim;