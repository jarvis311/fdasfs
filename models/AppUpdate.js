import {
    Model,
    DataTypes
  } from "sequelize";

  import db from '../config/database.js'
  class AppUpdate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  AppUpdate.init({
    title: {
      type: DataTypes.STRING,
    },
    version_code: {
        type: DataTypes.STRING,
    },
    current_version: {
    type: DataTypes.STRING,
    },
    package_name: {
        type: DataTypes.STRING,
    },
    start_io_ads_enable: {
        type: DataTypes.INTEGER,
    },
    affilation_program_enable: {
        type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'AppUpdate',
    tableName: 'app_updates',
    timestamps: false
  });
  export default AppUpdate;