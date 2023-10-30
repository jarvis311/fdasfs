import {
  Model,DataTypes
} from "sequelize";
import db from '../config/database.js'

class DrivingSchoolCity extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // DrivingSchoolCity.belongsTo(models.DrivingSchoolState, {
    //   foreignKey: "state_id",
    // });
    // DrivingSchoolCity.hasMany(models.DrivingSchoolArea, {
    //   foreignKey: "city_id",
    // });
  } 
}
DrivingSchoolCity.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  city_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  other_name: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.STRING,
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
  modelName: 'DrivingSchoolCity',
  tableName: 'ds_city',
  timestamps: false
});

export default DrivingSchoolCity;
