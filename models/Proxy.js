import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class Proxy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Proxy.init({
    android: {
      type: DataTypes.TINYINT,
    },
    ios: {
        type: DataTypes.TINYINT,
    },
    android_token: {
      type: DataTypes.TINYINT,
    },
    android_app_version: {
      type: DataTypes.TINYINT,
    },
    android_package_name: {
      type: DataTypes.TINYINT,
    },
    ios_token: {
      type: DataTypes.TINYINT,
    },
    ios_app_version: {
      type: DataTypes.TINYINT,
    },
    ios_package_name: {
      type: DataTypes.TINYINT,
    },
    parivahan_api: {
      type: DataTypes.TINYINT,
    },
    redirect_website: {
      type: DataTypes.TINYINT,
    },
    otp_verify_android: {
      type: DataTypes.TINYINT,
    },
    hard_otp_verify_android: {
      type: DataTypes.TINYINT,
    },
    otp_verify_ios: {
      type: DataTypes.TINYINT,
    },
    hard_otp_verify_ios: {
      type: DataTypes.TINYINT,
    },
    parivahan_dl: {
      type: DataTypes.TINYINT,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'Proxy',
    tableName: 'proxy',
    timestamps: false
  });
  export default Proxy;