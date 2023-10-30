import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
class RCBlock extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
RCBlock.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  reg_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  deleted_by: {
    type: DataTypes.INTEGER,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize: db.Vehicle,
  modelName: 'RCBlock',
  tableName: 'rc_block',
  timestamps: false
});
export default RCBlock;