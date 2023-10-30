import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ScooterModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  ScooterModel.init({
    scooter_model_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scooter_company_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    c_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'ScooterModel',
    tableName: 'scooter_company',
    timestamps: false
  });
  export default ScooterModel;