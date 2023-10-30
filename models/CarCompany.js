import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class CarCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // CarCompany.belongsTo(models.DrivingSchoolCity, {
      //   foreignKey: "city_id",
      // });
      // CarCompany.hasMany(models.DrivingSchoolCity, {
      //   foreignKey: "area_id",
      // });
    }
  }
  CarCompany.init({
    car_company_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'CarCompany',
    tableName: 'car_company',
    timestamps: false
  });
  export default CarCompany;