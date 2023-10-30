import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ResaleVehicleTrim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  ResaleVehicleTrim.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resale_year_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resale_vehicle_model_id	: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_cron:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'ResaleVehicleTrim',
    tableName: 'resale_vehicle_trim',
    timestamps: false
  });
  export default ResaleVehicleTrim;