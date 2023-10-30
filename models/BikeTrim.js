import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class BikeTrim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  BikeTrim.init({
    bike_trim_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bike_model_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'BikeTrim',
    tableName: 'bike_trim',
    timestamps: false
  });
  export default BikeTrim;