import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleInformation from "./VehicleInformation.js";
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  }
  Categories.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thumb_image: {
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
    sequelize:db.Vehicle,
    modelName: 'Categories',
    tableName: 'categories',
    timestamps: false
  });
  Categories.hasMany(VehicleInformation, {
    as: 'upcomingVehicles',
    foreignKey: 'category_id'
  })
  Categories.hasMany(VehicleInformation, {
    as: 'letestVehicles',
    foreignKey: 'category_id'
  })
  Categories.hasMany(VehicleInformation, {
    as: 'recommendedVehicles',
    foreignKey: 'category_id'
  })
  export default  Categories;
