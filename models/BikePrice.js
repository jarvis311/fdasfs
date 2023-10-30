import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class BikePrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  BikePrice.init({
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bike_company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bike_model_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bike_model_year_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bike_year_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bike_trim_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trim: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    onraod_price: {
        type: DataTypes.INTEGER,
    },
    year: {
        type: DataTypes.STRING,
    },
    new_car_price: {
        type: DataTypes.STRING,
    },
    logged_price: {
        type: DataTypes.INTEGER,
    },
    din: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    range_from: {
        type: DataTypes.INTEGER,
    },
    range_to: {
        type: DataTypes.INTEGER,
    },
    clunker_price: {
        type: DataTypes.INTEGER,
    },
    excity: {
        type: DataTypes.STRING,
    },
    rto: {
        type: DataTypes.INTEGER,
    },
    ins: {
        type: DataTypes.INTEGER,
    },
    onroad_price1: {
        type: DataTypes.INTEGER,
    },
    ex_showroom_price: {
        type: DataTypes.INTEGER,
    },
    year1: {
        type: DataTypes.STRING,
    },
    body_type: {
        type: DataTypes.STRING,
    },
    city1: {
        type: DataTypes.STRING,
    },
    stock_images: {
        type: DataTypes.STRING,
    },
    photo: {
        type: DataTypes.STRING,
    },

  }, {
    sequelize:db.Vehicle,
    modelName: 'BikePrice',
    tableName: 'bike_price',
    timestamps: false
  });
  export default BikePrice;