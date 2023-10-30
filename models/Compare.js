import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleInformation from "./VehicleInformation.js";
class Compare extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {

  }
}
Compare.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_id_1: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //   model: Movie, // 'Movies' would also work
    //   key: 'id'
    // }
  },
  vehicle_id_2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deleted_by: {
    type: DataTypes.INTEGER,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize:db.Vehicle,
  modelName: 'Compare',
  tableName: 'compares',
  timestamps: false
});
Compare.belongsTo(VehicleInformation, {
  as: 'vehicle1_name',
  foreignKey: 'vehicle_id_1'
})
Compare.belongsTo(VehicleInformation, {
  as: 'vehicle2_name',
  foreignKey: 'vehicle_id_2'
})
export default Compare;