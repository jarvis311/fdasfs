import {
    Model,
    DataTypes
  } from "sequelize";
import db from '../config/database.js'
import ResaleVehicleCompany from "./ResaleVehicleCompany.js"
// import ResaleVehicleCategory from "./ResaleVehicleCategory.js";
  class ResaleVehicleModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResaleVehicleModel.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resale_vehicle_company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_cron: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize: db.Vehicle,
    modelName: 'ResaleVehicleModel',
    tableName: 'resale_vehicle_model',
    timestamps: false
  });

  export default ResaleVehicleModel;