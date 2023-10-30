import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class Year extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Year.init({
    year_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bike: {
        type: DataTypes.STRING,
    },
    car: {
        type: DataTypes.STRING,
    },
    scooter: {
        type: DataTypes.STRING,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bicycle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taxi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tractor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    electric_car: {
        type: DataTypes.STRING,
        allowNull: false
    },
    truck: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize: db.Vehicle,
    modelName: 'Year',
    tableName: 'year',
    timestamps: false
  });
  export default Year;