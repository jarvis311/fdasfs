import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ServiceProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  ServiceProvider.init({
    provider: {
        type: DataTypes.STRING,
    },
    city_id: {
        type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    }, deleted_at: {
        type: DataTypes.DATE,
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'ServiceProvider',
    tableName: 'service_provider',
    timestamps: false
  });
  export default ServiceProvider;