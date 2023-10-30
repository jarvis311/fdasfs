import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
class ServiceCenterBrand extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    ServiceCenterBrand.hasMany(models.ServiceCenterData, {
      foreignKey: "brand_id",
    });
    ServiceCenterBrand.hasMany(models.ServiceCenterDealer, {
      foreignKey: "brand_id",
    });
  }
}
ServiceCenterBrand.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand_slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand_image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
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
    type: DataTypes.INTEGER,
  },
}, {
  sequelize: db.Vehicle,
  modelName: 'ServiceCenterBrand',
  tableName: 'service_center_brand',
  timestamps: false
});
export default ServiceCenterBrand;