import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
class ServiceCategory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
ServiceCategory.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
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
}, {
  sequelize: db.Vehicle,
  modelName: 'ServiceCategory',
  tableName: 'service_category',
  timestamps: false
});
export default ServiceCategory;