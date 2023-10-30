import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
import  DrivingSchoolCity from './DrivingSchoolCity.js'
class DrivingSchoolState extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // DrivingSchoolState.hasMany(models.DrivingSchoolCity, {
    //   foreignKey: "state_id",
    // });
  }
}
DrivingSchoolState.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  state_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state_code: {
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
    type: DataTypes.DATE,
  },
}, {
  sequelize: db.Vehicle,
  modelName: 'DrivingSchoolState',
  tableName: 'ds_state',
  timestamps: false
});

// DrivingSchoolState.hasMany(DrivingSchoolCity,{
//   as:"cities",
//   foreignKey:"state_id"
// })

export default DrivingSchoolState;