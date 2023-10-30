import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class BikeModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  }
  BikeModel.init({
    bike_model_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bike_company_id	: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    c_name	: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'BikeModel',
    tableName: 'bike_model',
    timestamps: false
  });
  export default BikeModel;