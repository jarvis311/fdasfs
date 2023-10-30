import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class QuoraImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuoraImage.init({
    qureka_ads_id: {
      type: DataTypes.INTEGER,
    },
    image: {
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
    modelName: 'QuoraImage',
    tableName: 'qureka_ads_image',
    timestamps: false
  });
  export default QuoraImage;