import {
    Model,
    DataTypes
  } from "sequelize";

  import db from '../config/database.js'
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  Offer.init({
    index: {
      type: DataTypes.INTEGER,
    },
    lable: {
        type: DataTypes.STRING,
    },
    description: {
    type: DataTypes.STRING,
    },
    percentage: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
    color_code: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    action_button: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.TINYINT,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'Offer',
    tableName: 'offers',
    timestamps: false
  });
  export default Offer;