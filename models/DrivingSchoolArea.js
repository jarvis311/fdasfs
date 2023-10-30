import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'

class DrivingSchoolArea extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    DrivingSchoolArea.belongsTo(models.DrivingSchoolCity, {
      foreignKey: "city_id",
    });
    // DrivingSchoolArea.hasMany(models.DrivingSchoolCity, {
    //   foreignKey: "area_id",
    // });
  }
}
DrivingSchoolArea.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  area_name: {
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
  zip_code: {
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
  modelName: 'DrivingSchoolArea',
  tableName: 'ds_area',
  timestamps: false
});
export default DrivingSchoolArea;