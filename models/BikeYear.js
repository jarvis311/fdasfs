import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class BikeYear extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  BikeYear.init({
    bike_model_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bike_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bike_year_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'BikeYear',
    tableName: 'bike_year',
    timestamps: false
  });
  export default BikeYear;