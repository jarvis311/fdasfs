import { Model, DataTypes } from "sequelize";

import db from "../config/database.js";
class TrafficRuleLang extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // add associate here
  }
}

TrafficRuleLang.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    lable:{
        type: DataTypes.STRING,
        defaultValue: null,
    },
    or:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    bn:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    kn:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    ml:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    te:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    ta:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    pa:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    mr:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    hi:{
        type: DataTypes.STRING,
        defaultValue: null,  
    },
    gu:{
        type: DataTypes.STRING,
        defaultValue: null,  
    }
  
  },
  {
    sequelize: db.Vehicle,
    modelName: "TrafficRuleLang",
    tableName: "traffic_rules_language",
    timestamps: false,
  }
);

export default TrafficRuleLang;
