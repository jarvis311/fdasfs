import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class Quotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quotes.init({
    en: {
        type: DataTypes.STRING,
    },
    hi: {
      type: DataTypes.STRING,
    },
    mr: {
      type: DataTypes.STRING,
    },
    gu: {
      type: DataTypes.STRING,
    },
    ta: {
      type: DataTypes.STRING,
    },
    te: {
      type: DataTypes.STRING,
    },
    kn: {
      type: DataTypes.STRING,
    },
    bn: {
      type: DataTypes.STRING,
    },
    pn: {
      type: DataTypes.STRING,
    }, or: {
      type: DataTypes.STRING,
    },
    ml: {
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
  }, {
    sequelize:db.Vehicle,
    modelName: 'Quotes',
    tableName: 'quotes',
    timestamps: false
  });


  export default Quotes;