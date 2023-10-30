import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class BikeCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // BikeCompany.belongsTo(models.DrivingSchoolCity, {
      //   foreignKey: "city_id",
      // });
      // BikeCompany.hasMany(models.DrivingSchoolCity, {
      //   foreignKey: "area_id",
      // });
    }
  }
  BikeCompany.init({
    bike_company_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'BikeCompany',
    tableName: 'bike_company',
    timestamps: false
  });
  export default BikeCompany;