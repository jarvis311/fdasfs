import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ScooterYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  ScooterYear.init({
    scooter_model_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scooter_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scooter_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'ScooterYear',
    tableName: 'scooter_year',
    timestamps: false
  });
  export default ScooterYear;