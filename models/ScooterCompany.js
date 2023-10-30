import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class ScooterCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  ScooterCompany.init({
    scooter_company_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'ScooterCompany',
    tableName: 'scooter_company',
    timestamps: false
  });
  export default ScooterCompany;