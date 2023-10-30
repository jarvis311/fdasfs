import {
    Model,
    DataTypes
  } from "sequelize";

  import db from '../config/database.js'
  class AffilationCity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffilationCity.init({
    name: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'AffilationCity',
    tableName: 'affilation_city',
    timestamps: false
  });
  export default AffilationCity;