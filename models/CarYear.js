import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class CarYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  CarYear.init({
    car_model_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    car_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    car_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'CarYear',
    tableName: 'car_year',
    timestamps: false
  });
  export default CarYear;