import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ResaleVehicleCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResaleVehicleCategory.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'ResaleVehicleCategory',
    tableName: 'resale_vehicle_category',
    timestamps: false
  });
  export default ResaleVehicleCategory;