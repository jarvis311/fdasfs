import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  import QuoraImage from "./QuoraImage.js";
  
  class Quora extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quora.init({
    name: {
      type: DataTypes.STRING,
    },
    link: {
        type: DataTypes.STRING,
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
  }, {
    sequelize:db.Vehicle,
    modelName: 'Quora',
    tableName: 'qureka_ads',
    timestamps: false
  });

  Quora.hasMany(QuoraImage,{
    foreignKey:'qureka_ads_id',
    as: 'qureka_ads_image',
  })
  export default Quora;