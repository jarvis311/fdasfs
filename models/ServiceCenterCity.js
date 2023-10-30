import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
import ServiceCenterState from './ServiceCenterState.js'
class ServiceCenterCity extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // ServiceCenterCity.hasOne(models.ServiceCenterState, {
    //   foreignKey: "state_id",
    // });
  }
}
ServiceCenterCity.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
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
  modelName: 'ServiceCenterCity',
  tableName: 'service_center_city',
  timestamps: false
});



ServiceCenterState.hasMany(ServiceCenterCity,{
  as:"get_city",
  foreignKey:"state_id"
})
// ServiceCenterCity.hasMany(ServiceCenterState,{
//   as:"get_city",
//   foreignKey:"id"
// })

// ServiceCenterCity.hasOne(ServiceCenterState,{
//   as:"get_city",
//   foreignKey:"state_id"
// })


export default ServiceCenterCity;