import { Model, DataTypes } from "sequelize";

import db from "../config/database.js";
class Traffic extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // add associate here
  }
}
import Trafficstate from "../models/Trafficestate.js";

Traffic.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    traffic_state_id: {
      type: DataTypes.BIGINT,
      allowNull:false
    },
    offence: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    penalty: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize: db.Vehicle,
    modelName: "Traffic",
    tableName: "traffic",
    timestamps: false,
  }
);
Trafficstate.hasMany(Traffic,{
    as:"fine_data",
    foreignKey:"traffic_state_id"
})
export default Traffic;
