import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'

class AdType extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
AdType.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,

  },
  type: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize:db.Vehicle,
  modelName: 'AdType',
  tableName: 'ad_type',
  timestamps: false
});
export default AdType;